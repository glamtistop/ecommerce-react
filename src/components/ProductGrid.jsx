import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchCatalog, fetchInventory, formatPrice } from '../utils/squareApi';
import { useCart } from '../context/CartContext';

export default function ProductGrid({ category }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        // Fetch products from Square
        const catalogItems = await fetchCatalog();
        console.log('Catalog items received:', catalogItems);
        
        let inventory = [];
        try {
          inventory = await fetchInventory();
          console.log('Inventory data received:', inventory);
        } catch (err) {
          console.log('Inventory data not available:', err);
        }

        // Filter products by category if specified
        const filteredProducts = category
          ? catalogItems.filter(item => {
              console.log('Checking item:', item.itemData?.name);
              // Check categories first
              const categoryMatch = item.itemData?.categories?.some(cat => 
                cat.name.toLowerCase() === category.toLowerCase()
              );
              
              // For Christmas trees, also check the item name if no category match
              if (category === 'christmas-trees' && !categoryMatch) {
                return item.itemData?.name?.toLowerCase().includes('fir') ||
                       item.itemData?.name?.toLowerCase().includes('christmas') ||
                       item.itemData?.name?.toLowerCase().includes('pine');
              }
              
              return categoryMatch;
            })
          : catalogItems;

        console.log('Filtered products:', filteredProducts);

        // Combine catalog and inventory data
        const productsWithInventory = filteredProducts.map(product => {
          const inventoryItem = inventory.find(
            inv => inv.catalogObjectId === product.id
          );
          return {
            ...product,
            inventory: inventoryItem?.quantity || null
          };
        });

        console.log('Products with inventory:', productsWithInventory);
        setProducts(productsWithInventory);
        setError(null);
      } catch (err) {
        console.error('Error loading products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, [category]);

  const handleAddToCart = (product) => {
    // If product has variations, navigate to product page instead
    if (product.itemData?.variations?.length > 1) {
      handleQuickView(product.id);
      return;
    }
    addToCart(product);
    console.log('Added to cart:', product.itemData?.name);
  };

  const handleQuickView = (productId) => {
    // Use relative path navigation
    navigate(productId);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#034F24]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-[#C41E3A] py-8 bg-white rounded-lg shadow-md border border-[#C41E3A] p-4">
        {error}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center text-[#034F24] py-8 bg-white rounded-lg shadow-md border border-[#034F24] p-4">
        No products available at the moment. Please check back soon!
      </div>
    );
  }

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => {
        // Safely access nested properties
        const name = product.itemData?.name || 'Unnamed Product';
        const description = product.itemData?.description || '';
        const imageId = product.itemData?.imageIds?.[0];
        const variations = product.itemData?.variations || [];
        const hasMultipleVariations = variations.length > 1;
        
        // Get the price range if multiple variations exist
        let priceDisplay = '';
        if (variations.length > 0) {
          const prices = variations
            .map(v => v.itemVariationData?.priceMoney?.amount)
            .filter(Boolean)
            .sort((a, b) => a - b);
          
          if (prices.length > 0) {
            if (hasMultipleVariations) {
              priceDisplay = `${formatPrice(prices[0])} - ${formatPrice(prices[prices.length - 1])}`;
            } else {
              priceDisplay = formatPrice(prices[0]);
            }
          }
        }

        return (
          <div 
            key={product.id} 
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 
                     border border-[#034F24] hover:border-[#C41E3A] transform hover:-translate-y-1"
          >
            {imageId && (
              <div 
                className="aspect-square overflow-hidden bg-[#F8F8F8] cursor-pointer"
                onClick={() => handleQuickView(product.id)}
              >
                <img
                  src={`${API_BASE_URL}/image/${imageId}`}
                  alt={name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://placehold.co/400x400?text=Product+Image+Coming+Soon';
                  }}
                />
              </div>
            )}
            
            <div className="p-4">
              <h3 
                className="text-lg font-semibold text-[#034F24] mb-2 hover:text-[#C41E3A] transition-colors cursor-pointer"
                onClick={() => handleQuickView(product.id)}
              >
                {name}
              </h3>
              
              {description && (
                <p className="text-[#4D4D4D] text-sm mb-3 line-clamp-2">
                  {description}
                </p>
              )}
              
              <div className="flex justify-between items-center">
                {priceDisplay && (
                  <span className="text-[#C41E3A] font-bold text-lg">
                    {priceDisplay}
                  </span>
                )}
                
                {product.inventory !== null && (
                  <span className={`text-sm ${
                    product.inventory > 0 ? 'text-[#034F24]' : 'text-[#C41E3A]'
                  }`}>
                    {product.inventory > 0 
                      ? `${product.inventory} in stock` 
                      : 'Out of stock'}
                  </span>
                )}
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <button 
                  onClick={() => handleAddToCart(product)}
                  className="w-full bg-[#034F24] text-white py-2 px-4 rounded-md hover:bg-[#0A6F35] 
                           transition-colors duration-300 font-medium"
                  disabled={product.inventory === 0}
                >
                  {hasMultipleVariations ? 'Select Options' : 'Add to Cart'}
                </button>
                <button 
                  onClick={() => handleQuickView(product.id)}
                  className="w-full bg-[#C41E3A] text-white py-2 px-4 rounded-md hover:bg-[#E25766] 
                           transition-colors duration-300 font-medium"
                >
                  Quick View
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
