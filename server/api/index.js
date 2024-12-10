const { Client, Environment } = require('square');
const axios = require('axios');

// Initialize Square client
const squareClient = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  environment: Environment.Production
});

// Initialize Square API
const squareApi = axios.create({
  baseURL: 'https://connect.squareup.com/v2',
  headers: {
    'Square-Version': '2024-01-17',
    'Authorization': `Bearer ${process.env.SQUARE_ACCESS_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

// Helper function to set CORS headers
const setCorsHeaders = (res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');
};

module.exports = async (req, res) => {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const url = new URL(req.url, `https://${req.headers.host}`);
  const path = url.pathname;

  try {
    // Health check endpoint
    if (path === '/api/health') {
      return res.json({ 
        status: 'ok',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        square: {
          accessToken: !!process.env.SQUARE_ACCESS_TOKEN,
          locationId: !!process.env.SQUARE_LOCATION_ID,
          applicationId: !!process.env.SQUARE_APPLICATION_ID
        }
      });
    }

    // Catalog endpoint
    if (path === '/api/catalog') {
      const searchResponse = await squareApi.post('/catalog/search', {
        include_related_objects: true,
        object_types: ["ITEM", "ITEM_VARIATION", "CATEGORY"]
      });

      if (!searchResponse.data.objects) {
        return res.json([]);
      }

      const allObjects = searchResponse.data.objects;
      const relatedObjects = searchResponse.data.related_objects || [];

      const categoryMap = new Map();
      const variationMap = new Map();

      [...allObjects, ...relatedObjects].forEach(obj => {
        if (obj.type === 'CATEGORY') {
          categoryMap.set(obj.id, obj.category_data.name);
        } else if (obj.type === 'ITEM_VARIATION') {
          variationMap.set(obj.id, {
            id: obj.id,
            type: 'ITEM_VARIATION',
            present_at_all_locations: obj.present_at_all_locations,
            item_variation_data: {
              item_id: obj.item_variation_data?.item_id,
              name: obj.item_variation_data?.name,
              sku: obj.item_variation_data?.sku,
              ordinal: obj.item_variation_data?.ordinal,
              pricing_type: obj.item_variation_data?.pricing_type,
              price_money: obj.item_variation_data?.price_money,
              track_inventory: obj.item_variation_data?.track_inventory
            }
          });
        }
      });

      const items = allObjects
        .filter(obj => obj.type === 'ITEM')
        .map(item => ({
          id: item.id,
          type: item.type,
          itemData: {
            name: item.item_data.name,
            description: item.item_data.description,
            categories: (item.item_data?.category_ids || []).map(id => ({
              id,
              name: categoryMap.get(id) || 'Uncategorized'
            })),
            variations: (item.item_data.variations || [])
              .map(varRef => {
                const variationData = variationMap.get(varRef.id);
                if (!variationData) return null;
                return {
                  id: variationData.id,
                  type: variationData.type,
                  itemVariationData: {
                    ...variationData.item_variation_data,
                    priceMoney: {
                      ...variationData.item_variation_data.price_money,
                      amount: String(variationData.item_variation_data.price_money?.amount || 0)
                    }
                  }
                };
              })
              .filter(Boolean),
            imageIds: item.item_data.image_ids || []
          }
        }));

      return res.json(items);
    }

    // Inventory endpoint
    if (path === '/api/inventory' && req.method === 'POST') {
      const response = await squareApi.post('/inventory/batch-retrieve-counts', {
        location_ids: [process.env.SQUARE_LOCATION_ID]
      });
      return res.json(response.data.counts || []);
    }

    // Payment endpoint
    if (path === '/api/payment' && req.method === 'POST') {
      const { sourceId, total, customerInfo } = req.body;

      if (!sourceId || total === undefined || !customerInfo) {
        throw new Error('Missing required payment information');
      }

      const amount = Math.round(Number(String(total)));
      if (isNaN(amount)) {
        throw new Error('Invalid payment amount');
      }

      const { result: customerResult } = await squareClient.customersApi.createCustomer({
        idempotencyKey: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        givenName: customerInfo.firstName,
        familyName: customerInfo.lastName,
        emailAddress: customerInfo.email,
        phoneNumber: customerInfo.phone,
        address: {
          addressLine1: customerInfo.address.line1,
          addressLine2: customerInfo.address.line2 || '',
          locality: customerInfo.address.city,
          administrativeDistrictLevel1: customerInfo.address.state,
          postalCode: customerInfo.address.zipCode,
          country: 'US'
        }
      });

      const { result } = await squareClient.paymentsApi.createPayment({
        idempotencyKey: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        sourceId,
        amountMoney: {
          amount: String(amount),
          currency: 'USD'
        },
        locationId: process.env.SQUARE_LOCATION_ID,
        customerId: customerResult.customer.id,
        billingAddress: {
          addressLine1: customerInfo.address.line1,
          addressLine2: customerInfo.address.line2 || '',
          locality: customerInfo.address.city,
          administrativeDistrictLevel1: customerInfo.address.state,
          postalCode: customerInfo.address.zipCode,
          country: 'US'
        },
        buyerEmailAddress: customerInfo.email,
        autocomplete: true
      });

      return res.json({
        success: true,
        payment: {
          id: result.payment.id,
          status: result.payment.status,
          amount: String(result.payment.amountMoney.amount)
        }
      });
    }

    // Image proxy endpoint
    if (path.startsWith('/api/image/')) {
      const imageId = path.split('/api/image/')[1];
      const response = await squareApi.get(`/catalog/object/${imageId}`);
      
      if (response.data.object?.image_data?.url) {
        return res.redirect(response.data.object.image_data.url);
      }
      return res.status(404).send('Image not found');
    }

    // If no route matches
    return res.status(404).json({ error: 'Not found' });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({
      error: error.message || 'Internal server error',
      details: error.response?.data || error.details || []
    });
  }
};
