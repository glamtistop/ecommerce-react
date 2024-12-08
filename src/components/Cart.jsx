import { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { formatPrice, initializeSquarePayments, processPayment } from '../utils/squareApi';

export default function Cart({ isOpen, onClose }) {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    getCartTotal,
    clearCart
  } = useCart();

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [card, setCard] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [isLoadingForm, setIsLoadingForm] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: {
      line1: '',
      line2: '',
      city: '',
      state: '',
      zipCode: ''
    }
  });

  // Reset states when cart is closed
  useEffect(() => {
    if (!isOpen) {
      setShowPayment(false);
      setError(null);
      setCard(null);
      setIsProcessing(false);
      setIsLoadingForm(false);
      setCustomerInfo({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: {
          line1: '',
          line2: '',
          city: '',
          state: '',
          zipCode: ''
        }
      });
    }
  }, [isOpen]);

  // Initialize payment form
  useEffect(() => {
    let mounted = true;

    async function initializePayments() {
      if (showPayment && !card) {
        setIsLoadingForm(true);
        setError(null);
        try {
          const cardInstance = await initializeSquarePayments();
          if (mounted) {
            setCard(cardInstance);
            setError(null);
          }
        } catch (err) {
          if (mounted) {
            console.error('Payment form error:', err);
            setError(err.message || 'Failed to load payment form');
            setCard(null);
          }
        } finally {
          if (mounted) {
            setIsLoadingForm(false);
          }
        }
      }
    }

    initializePayments();

    return () => {
      mounted = false;
    };
  }, [showPayment]);

  const handleCheckout = () => {
    setError(null);
    setShowPayment(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setCustomerInfo(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setCustomerInfo(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const validateForm = () => {
    const required = [
      'firstName',
      'lastName',
      'email',
      'phone',
      'address.line1',
      'address.city',
      'address.state',
      'address.zipCode'
    ];

    const missing = required.filter(field => {
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        return !customerInfo[parent][child];
      }
      return !customerInfo[field];
    });

    if (missing.length > 0) {
      setError('Please fill in all required fields');
      return false;
    }

    if (!customerInfo.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError('Please enter a valid email address');
      return false;
    }

    if (!customerInfo.phone.match(/^\d{10}$/)) {
      setError('Please enter a valid 10-digit phone number');
      return false;
    }

    return true;
  };

  const handlePayment = async () => {
    if (!validateForm()) return;
    if (!card) {
      setError('Payment form not loaded');
      return;
    }

    setIsProcessing(true);
    setError(null);
    try {
      // Convert total to string to handle BigInt
      const total = getCartTotal().toString();
      await processPayment(card, total);
      clearCart();
      onClose();
      alert('Payment successful! Thank you for your purchase.');
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.message || 'Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setShowPayment(false);
    setError(null);
    setCard(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
      <div className="bg-white w-full max-w-2xl h-full overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#034F24]">Your Cart</h2>
            <button
              onClick={handleClose}
              className="text-[#4D4D4D] hover:text-[#C41E3A]"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          {cartItems.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-[#4D4D4D]">Your cart is empty</p>
            </div>
          ) : (
            <>
              <div className="space-y-4 mb-8">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-4 border border-[#034F24] rounded-lg"
                  >
                    {item.itemData?.imageIds?.[0] && (
                      <img
                        src={`http://localhost:5000/api/image/${item.itemData.imageIds[0]}`}
                        alt={item.itemData?.name}
                        className="w-20 h-20 object-cover rounded"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://placehold.co/80x80?text=Tree';
                        }}
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-[#034F24]">
                        {item.itemData?.name}
                      </h3>
                      <p className="text-[#C41E3A] font-bold">
                        {formatPrice(
                          item.itemData?.variations?.[0]?.itemVariationData?.priceMoney?.amount || '0'
                        )}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center border border-[#034F24] rounded"
                        >
                          -
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center border border-[#034F24] rounded"
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="ml-auto text-[#C41E3A] hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-6 space-y-6">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-[#C41E3A]">{formatPrice(getCartTotal())}</span>
                </div>

                {error && (
                  <div className="text-[#C41E3A] text-sm p-3 bg-red-50 border border-red-100 rounded">
                    {error}
                  </div>
                )}

                {showPayment ? (
                  <div className="space-y-6">
                    {/* Customer Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-[#034F24]">Customer Information</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            First Name *
                          </label>
                          <input
                            type="text"
                            name="firstName"
                            value={customerInfo.firstName}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded focus:ring-[#034F24] focus:border-[#034F24]"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Last Name *
                          </label>
                          <input
                            type="text"
                            name="lastName"
                            value={customerInfo.lastName}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded focus:ring-[#034F24] focus:border-[#034F24]"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email *
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={customerInfo.email}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded focus:ring-[#034F24] focus:border-[#034F24]"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phone *
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            value={customerInfo.phone}
                            onChange={handleInputChange}
                            placeholder="1234567890"
                            className="w-full p-2 border border-gray-300 rounded focus:ring-[#034F24] focus:border-[#034F24]"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Billing Address */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-[#034F24]">Billing Address</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Address Line 1 *
                          </label>
                          <input
                            type="text"
                            name="address.line1"
                            value={customerInfo.address.line1}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded focus:ring-[#034F24] focus:border-[#034F24]"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Address Line 2
                          </label>
                          <input
                            type="text"
                            name="address.line2"
                            value={customerInfo.address.line2}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded focus:ring-[#034F24] focus:border-[#034F24]"
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              City *
                            </label>
                            <input
                              type="text"
                              name="address.city"
                              value={customerInfo.address.city}
                              onChange={handleInputChange}
                              className="w-full p-2 border border-gray-300 rounded focus:ring-[#034F24] focus:border-[#034F24]"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              State *
                            </label>
                            <input
                              type="text"
                              name="address.state"
                              value={customerInfo.address.state}
                              onChange={handleInputChange}
                              className="w-full p-2 border border-gray-300 rounded focus:ring-[#034F24] focus:border-[#034F24]"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              ZIP Code *
                            </label>
                            <input
                              type="text"
                              name="address.zipCode"
                              value={customerInfo.address.zipCode}
                              onChange={handleInputChange}
                              className="w-full p-2 border border-gray-300 rounded focus:ring-[#034F24] focus:border-[#034F24]"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Payment Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-[#034F24]">Payment Information</h3>
                      <div 
                        id="card-container" 
                        className={`min-h-[100px] p-4 rounded-md border ${
                          isLoadingForm ? 'bg-gray-50' : 'bg-white'
                        } ${error ? 'border-red-300' : 'border-gray-300'}`}
                      >
                        {isLoadingForm && (
                          <div className="flex items-center justify-center h-[100px]">
                            <span className="text-gray-500">Loading payment form...</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <button
                        onClick={() => setShowPayment(false)}
                        className="flex-1 py-3 px-4 border border-[#034F24] text-[#034F24] rounded-md 
                                 hover:bg-[#034F24] hover:text-white transition-colors duration-300"
                      >
                        Back to Cart
                      </button>
                      <button
                        onClick={handlePayment}
                        disabled={isProcessing || isLoadingForm || error || !card}
                        className="flex-1 py-3 px-4 bg-[#034F24] text-white rounded-md 
                                 hover:bg-[#0A6F35] transition-colors duration-300 
                                 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isProcessing ? 'Processing...' : 'Complete Purchase'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={clearCart}
                      className="w-full py-3 px-4 border border-[#C41E3A] text-[#C41E3A] rounded-md 
                               hover:bg-[#C41E3A] hover:text-white transition-colors duration-300"
                    >
                      Clear Cart
                    </button>
                    <button
                      onClick={handleCheckout}
                      className="w-full py-3 px-4 bg-[#034F24] text-white rounded-md 
                               hover:bg-[#0A6F35] transition-colors duration-300"
                    >
                      Proceed to Checkout
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
