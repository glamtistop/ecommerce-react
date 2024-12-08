import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchCatalog, fetchInventory, formatPrice } from '../utils/squareApi';
import { useCart } from '../context/CartContext';

export default function ProductDisplay() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedVariation, setSelectedVariation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        const catalogItems = await fetchCatalog();
        const foundProduct = catalogItems.find(item => item.id === productId);
        
        if (!foundProduct) {
          setError('Product not found');
          setLoading(false);
          return;
        }

        // Sort variations by price if they exist
        if (foundProduct.itemData?.variations?.length > 0) {
          foundProduct.itemData.variations.sort((a, b) => {
            const priceA = a.itemVariationData?.priceMoney?.amount || 0;
            const priceB = b.itemVariationData?.priceMoney?.amount || 0;
            return priceA - priceB;
          });
        }

        let inventory = [];
        try {
          inventory = await fetchInventory();
          const inventoryItem = inventory.find(
            inv => inv.catalogObjectId === foundProduct.id
          );
          foundProduct.inventory = inventoryItem?.quantity || null;
        } catch (err) {
          console.log('Inventory data not available:', err);
        }

        setProduct(foundProduct);
        // Only set selected variation if variations exist
        if (foundProduct.itemData?.variations?.length > 0) {
          setSelectedVariation(foundProduct.itemData.variations[0]);
        }
        setError(null);
      } catch (err) {
        console.error('Error loading product:', err);
        setError('Failed to load product. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    if (productId) {
      loadProduct();
    }
  }, [productId]);

  const handleAddToCart = () => {
    if (product && selectedVariation) {
      const productToAdd = {
        ...product,
        selectedVariation
      };
      addToCart(productToAdd);
      // Optional: Show a success message or navigate somewhere
    }
  };

  const nextImage = () => {
    if (product?.itemData?.imageIds?.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === product.itemData.imageIds.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (product?.itemData?.imageIds?.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? product.itemData.imageIds.length - 1 : prev - 1
      );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#034F24]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-[#C41E3A] py-8">
        <p className="mb-4">{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="bg-[#034F24] text-white px-4 py-2 rounded-md hover:bg-[#0A6F35]"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!product || !product.itemData) {
    return (
      <div className="text-center text-[#C41E3A] py-8">
        <p className="mb-4">Product not found</p>
        <button
          onClick={() => navigate(-1)}
          className="bg-[#034F24] text-white px-4 py-2 rounded-md hover:bg-[#0A6F35]"
        >
          Go Back
        </button>
      </div>
    );
  }

  const { name = 'Unnamed Product', description = '', imageIds = [], variations = [] } = product.itemData;
  const currentImage = imageIds[currentImageIndex];
  const hasMultipleVariations = variations.length > 1;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-[#034F24] hover:text-[#0A6F35] flex items-center"
      >
        ← Back
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div className="relative">
          <div className="aspect-square bg-[#F8F8F8] rounded-lg overflow-hidden">
            {currentImage ? (
              <img
                src={`http://localhost:5000/api/image/${currentImage}`}
                alt={name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://placehold.co/400x400?text=Product+Image+Coming+Soon';
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No image available
              </div>
            )}
          </div>
          
          {imageIds.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white"
              >
                ←
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white"
              >
                →
              </button>
            </>
          )}

          {/* Thumbnail Gallery */}
          {imageIds.length > 1 && (
            <div className="flex gap-2 mt-4 overflow-x-auto">
              {imageIds.map((imageId, index) => (
                <button
                  key={imageId}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-20 h-20 flex-shrink-0 rounded-md overflow-hidden border-2 
                    ${currentImageIndex === index ? 'border-[#034F24]' : 'border-transparent'}`}
                >
                  <img
                    src={`http://localhost:5000/api/image/${imageId}`}
                    alt={`${name} thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div>
          <h1 className="text-3xl font-bold text-[#034F24] mb-4">{name}</h1>
          
          {description && (
            <p className="text-gray-600 mb-6">{description}</p>
          )}

          {/* Variations */}
          {variations.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">
                {hasMultipleVariations ? 'Select Size' : 'Options'}
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {variations.map((variation) => (
                  <button
                    key={variation.id}
                    onClick={() => setSelectedVariation(variation)}
                    className={`p-3 rounded-md border transition-all duration-300 ${
                      selectedVariation?.id === variation.id
                        ? 'border-[#034F24] bg-[#034F24] text-white'
                        : 'border-gray-300 hover:border-[#034F24]'
                    }`}
                  >
                    <span className="block text-lg">
                      {variation.itemVariationData?.name || 'Unnamed Variation'}
                    </span>
                    {variation.itemVariationData?.priceMoney?.amount && (
                      <span className="block mt-1 font-semibold">
                        {formatPrice(variation.itemVariationData.priceMoney.amount)}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Price and Add to Cart */}
          <div className="space-y-4">
            {selectedVariation?.itemVariationData?.priceMoney?.amount && (
              <div className="text-2xl font-bold text-[#C41E3A]">
                {formatPrice(selectedVariation.itemVariationData.priceMoney.amount)}
              </div>
            )}

            {product.inventory !== null && (
              <div className={`text-sm ${
                product.inventory > 0 ? 'text-[#034F24]' : 'text-[#C41E3A]'
              }`}>
                {product.inventory > 0 
                  ? `${product.inventory} in stock` 
                  : 'Out of stock'}
              </div>
            )}

            <button
              onClick={handleAddToCart}
              disabled={!selectedVariation || product.inventory === 0}
              className="w-full bg-[#034F24] text-white py-3 px-6 rounded-md 
                       hover:bg-[#0A6F35] transition-colors duration-300 
                       disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {!selectedVariation 
                ? 'Please Select an Option'
                : product.inventory === 0
                  ? 'Out of Stock'
                  : 'Add to Cart'
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
