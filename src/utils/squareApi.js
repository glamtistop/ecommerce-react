// Square API configuration and helper functions
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const SQUARE_LOCATION_ID = import.meta.env.VITE_SQUARE_LOCATION_ID;

export async function fetchCatalog() {
  try {
    const response = await fetch(`${API_BASE_URL}/catalog`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data || [];
  } catch (error) {
    console.error('Error fetching Square catalog:', error);
    return [];
  }
}

export async function fetchInventory() {
  try {
    const response = await fetch(`${API_BASE_URL}/inventory`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data || [];
  } catch (error) {
    console.error('Error fetching inventory:', error);
    return [];
  }
}

export function formatPrice(amount) {
  // Convert amount to string first to handle potential BigInt
  const amountStr = amount?.toString() || '0';
  const amountNum = parseInt(amountStr, 10);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amountNum / 100);
}

export function getCategoryName(categoryId, categories) {
  return categories.find(cat => cat.id === categoryId)?.name || 'Uncategorized';
}

// Load Square Web Payments SDK
export function loadSquareSdk() {
  return new Promise((resolve, reject) => {
    if (document.querySelector('script[src*="squarecdn"]')) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://web.squarecdn.com/v1/square.js';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Square SDK'));
    document.body.appendChild(script);
  });
}

// Initialize Square Payments
export async function initializeSquarePayments() {
  try {
    await loadSquareSdk();

    if (!window.Square) {
      throw new Error('Square SDK not loaded');
    }

    const applicationId = import.meta.env.VITE_SQUARE_APPLICATION_ID;
    if (!applicationId) {
      throw new Error('Square Application ID not found');
    }

    const payments = await window.Square.payments(applicationId, SQUARE_LOCATION_ID);
    if (!payments) {
      throw new Error('Failed to initialize Square Payments');
    }

    const card = await payments.card();
    if (!card) {
      throw new Error('Failed to initialize card payment method');
    }

    const cardOptions = {
      style: {
        '.input-container': {
          borderColor: '#E0E0E0',
          borderRadius: '4px'
        },
        input: {
          backgroundColor: 'white',
          color: '#333333',
          fontSize: '16px',
          padding: '12px'
        },
        'input::placeholder': {
          color: '#999999'
        },
        'input.is-focus': {
          borderColor: '#006AFF'
        },
        'input.is-error': {
          borderColor: '#ff1744'
        }
      }
    };

    await card.attach('#card-container', cardOptions);
    return card;
  } catch (error) {
    console.error('Failed to initialize Square Payments:', error);
    throw new Error('Failed to load payment form: ' + (error.message || 'Unknown error'));
  }
}

// Process payment
export async function processPayment(card, total, customerInfo) {
  try {
    const result = await card.tokenize();
    if (result.status === 'OK') {
      // Convert total to string first to handle potential BigInt
      const totalStr = total?.toString() || '0';
      const amount = parseInt(totalStr, 10);
      
      const response = await fetch(`${API_BASE_URL}/payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sourceId: result.token,
          total: amount,
          customerInfo: customerInfo
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Payment request failed');
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Payment failed');
      }

      return data;
    } else {
      throw new Error(result.errors?.[0]?.message || 'Card tokenization failed');
    }
  } catch (error) {
    console.error('Payment processing error:', error);
    throw error;
  }
}
