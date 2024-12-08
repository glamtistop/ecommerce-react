require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { Client, Environment } = require('square');

const app = express();
const port = process.env.PORT || 5000;

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',') 
  : ['http://localhost:5173']; // Default for development

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

// Custom JSON serializer to handle BigInt
const safeJSONStringify = (obj) => {
  return JSON.stringify(obj, (_, value) => 
    typeof value === 'bigint' ? value.toString() : value
  );
};

app.use(express.json());

// Override response.json to use our custom serializer
app.use((req, res, next) => {
  const originalJson = res.json;
  res.json = function(obj) {
    return originalJson.call(this, JSON.parse(safeJSONStringify(obj)));
  };
  next();
});

// Square API configuration
const SQUARE_ACCESS_TOKEN = process.env.SQUARE_ACCESS_TOKEN;
const SQUARE_LOCATION_ID = process.env.SQUARE_LOCATION_ID;

// Initialize Square client
const squareClient = new Client({
  accessToken: SQUARE_ACCESS_TOKEN,
  environment: Environment.Production
});

const squareApi = axios.create({
  baseURL: 'https://connect.squareup.com/v2',
  headers: {
    'Square-Version': '2024-01-17',
    'Authorization': `Bearer ${SQUARE_ACCESS_TOKEN}`,
    'Content-Type': 'application/json'
  },
  transformResponse: [
    data => {
      try {
        return JSON.parse(data, (_, value) => 
          typeof value === 'bigint' ? value.toString() : value
        );
      } catch (error) {
        return data;
      }
    }
  ]
});

// Image proxy endpoint
app.get('/api/image/:imageId', async (req, res) => {
  try {
    const imageId = req.params.imageId;
    const response = await squareApi.get(`/catalog/object/${imageId}`);
    
    if (response.data.object && response.data.object.image_data && response.data.object.image_data.url) {
      // Redirect to the actual image URL
      res.redirect(response.data.object.image_data.url);
    } else {
      res.status(404).send('Image not found');
    }
  } catch (error) {
    console.error('Error fetching image:', error);
    res.status(500).send('Error fetching image');
  }
});

// Proxy endpoint for catalog
app.get('/api/catalog', async (req, res) => {
  try {
    console.log('Fetching catalog...');
    
    // First, get all catalog objects using search endpoint
    const searchResponse = await squareApi.post('/catalog/search', {
      include_related_objects: true,
      object_types: ["ITEM", "ITEM_VARIATION", "CATEGORY"]
    });

    if (!searchResponse.data.objects) {
      console.log('No catalog objects found');
      return res.json([]);
    }

    const allObjects = searchResponse.data.objects;
    const relatedObjects = searchResponse.data.related_objects || [];

    console.log(`Found ${allObjects.length} catalog objects and ${relatedObjects.length} related objects`);

    // Create maps for categories and variations
    const categoryMap = new Map();
    const variationMap = new Map();

    // Process all objects to populate maps
    [...allObjects, ...relatedObjects].forEach(obj => {
      if (obj.type === 'CATEGORY') {
        categoryMap.set(obj.id, obj.category_data.name);
        console.log(`Found category: ${obj.id} = ${obj.category_data.name}`);
      } else if (obj.type === 'ITEM_VARIATION') {
        console.log(`Found variation: ${obj.id} = ${obj.item_variation_data?.name}`);
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

    // Process items
    const items = allObjects
      .filter(obj => obj.type === 'ITEM')
      .map(item => {
        const categoryIds = item.item_data?.category_ids || [];
        const categories = categoryIds.map(id => ({
          id,
          name: categoryMap.get(id) || 'Uncategorized'
        }));

        // Map variation IDs to their full data
        const variations = (item.item_data.variations || []).map(varRef => {
          const variationData = variationMap.get(varRef.id);
          if (!variationData) {
            console.warn(`Variation not found for ID: ${varRef.id}`);
            return null;
          }
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
        }).filter(Boolean);

        console.log(`Processing item "${item.item_data.name}" with ${variations.length} variations`);

        return {
          id: item.id,
          type: item.type,
          itemData: {
            name: item.item_data.name,
            description: item.item_data.description,
            categories: categories,
            variations: variations,
            imageIds: item.item_data.image_ids || []
          }
        };
      });

    console.log(`Processed ${items.length} items`);
    res.json(items);
  } catch (error) {
    console.error('Error fetching catalog:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    res.status(500).json({ 
      error: 'Failed to fetch catalog',
      details: error.response?.data || error.message
    });
  }
});

// Proxy endpoint for inventory
app.post('/api/inventory', async (req, res) => {
  try {
    console.log('Fetching inventory...');
    const response = await squareApi.post('/inventory/batch-retrieve-counts', {
      location_ids: [SQUARE_LOCATION_ID]
    });
    console.log('Inventory response received');
    
    const counts = response.data.counts || [];
    console.log(`Found ${counts.length} inventory counts`);
    
    res.json(counts);
  } catch (error) {
    console.error('Error fetching inventory:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    res.json([]);
  }
});

// Payment endpoint
app.post('/api/payment', async (req, res) => {
  try {
    console.log('Processing payment...');
    const { sourceId, total, customerInfo } = req.body;

    if (!sourceId || total === undefined || !customerInfo) {
      throw new Error('Missing required payment information');
    }

    // Convert total to string first, then to number
    const amount = Math.round(Number(String(total)));

    if (isNaN(amount)) {
      throw new Error('Invalid payment amount');
    }

    // Create customer in Square
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

    // Create payment with customer information
    const payment = {
      idempotencyKey: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      sourceId: sourceId,
      amountMoney: {
        amount: String(amount),
        currency: 'USD'
      },
      locationId: SQUARE_LOCATION_ID,
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
    };

    console.log('Creating payment with Square...', { 
      locationId: SQUARE_LOCATION_ID, 
      amount: amount,
      customerId: customerResult.customer.id
    });

    const { result } = await squareClient.paymentsApi.createPayment(payment);

    console.log('Payment processed successfully:', result.payment.id);
    res.json({
      success: true,
      payment: {
        id: result.payment.id,
        status: result.payment.status,
        amount: String(result.payment.amountMoney.amount)
      }
    });
  } catch (error) {
    console.error('Payment error:', {
      message: error.message,
      details: error.details,
      code: error.code
    });
    
    res.status(500).json({
      success: false,
      error: error.message || 'Payment processing failed',
      details: error.details || []
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    square: {
      accessToken: !!SQUARE_ACCESS_TOKEN,
      locationId: !!SQUARE_LOCATION_ID,
      applicationId: !!process.env.SQUARE_APPLICATION_ID
    },
    cors: {
      allowedOrigins
    }
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Allowed Origins: ${allowedOrigins.join(', ')}`);
  console.log(`API Configuration Check:`);
  console.log(`- Access Token: ${SQUARE_ACCESS_TOKEN ? 'Present' : 'Missing'}`);
  console.log(`- Location ID: ${SQUARE_LOCATION_ID ? 'Present' : 'Missing'}`);
  console.log(`- Application ID: ${process.env.SQUARE_APPLICATION_ID ? 'Present' : 'Missing'}`);
});
