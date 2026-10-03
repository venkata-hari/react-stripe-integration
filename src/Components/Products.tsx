import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import Checkout from './Checkout';

const stripePromise = loadStripe('pk_test_51Srx23IUNcV6tYDnwXiyASQdw84FjMAG8Htl5r7DGXso5i35EwH96gsQratXaJ83uQlhiEULy9CJ3sdlsJWYJw5v00l9hH0Cj2');

const Products = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [amount, setAmount] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('https://fakestoreapi.com/products')
      .then(res => res.json())
      .then(setProducts);
  }, []);

  const buyNow = async (price: number) => {
    setLoading(true);
    try {
      const res = await fetch(
        'http://15.134.105.190:3000/api/payment/create-order/699d62fa7d77766da0574e8d',
        {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            token:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjk5YzIyOGY2N2RiZjA1NjIyNWUxMWUzIiwiZW1haWwiOiJoYXJpQGdtYWlsLmNvbSJ9LCJpYXQiOjE3NzE5MjIxMjQsImV4cCI6MTc4MDU2MjEyNH0.Wg3IsEOi8SGZ6NTrV7wCE4xKYTGK-qZezFifU8YkzuE'
          },
          body: JSON.stringify({ amount: 140 }),
        }
      );

      const data = await res.json();
      
      // Debug: Log the response
      console.log('API Response:', data);
      console.log('Status:', res.status);
      
      // Check if request was successful
      if (!res.ok) {
        alert(`Error: ${data.message || 'API request failed'}`);
        return;
      }
      
      // Handle both client_secret and clientSecret
      const secret = data.client_secret || data.clientSecret;
      
      if (secret) {
        setClientSecret(secret);
        setAmount(price);
      } else {
        alert('Failed to create payment: No client secret received');
        console.error('Response data:', data);
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Something went wrong! Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ marginBottom: '30px' }}>Product saakjhkahs</h2>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
        gap: '20px' 
      }}>
        {products.map(p => (
          <div key={p.id} style={{ 
            border: '1px solid #ddd', 
            padding: '15px', 
            borderRadius: '8px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <img 
              src={p.image} 
              alt={p.title} 
              style={{ 
                width: '100%', 
                height: '200px', 
                objectFit: 'contain' 
              }} 
            />
            <h3 style={{ fontSize: '14px', minHeight: '40px' }}>{p.title}</h3>
            <p style={{ 
              fontSize: '20px', 
              fontWeight: 'bold', 
              color: '#667eea' 
            }}>
              ${p.price}
            </p>
            <button 
              onClick={() => buyNow(p.price)}
              disabled={loading}
              style={{ 
                padding: '12px 20px',
                background: loading ? '#ccc' : '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background 0.3s',
              }}
            >
              {loading ? 'Loading...' : 'Buy Now'}
            </button>
          </div>
        ))}
      </div>

      {clientSecret && (
        <Elements 
          stripe={stripePromise} 
          options={{ 
            clientSecret,
            appearance: {
              theme: 'stripe',
            },
            loader: 'auto',
          }}
        >
          <Checkout
            amount={amount}
            onClose={() => setClientSecret(null)}
          />
        </Elements>
      )}
    </div>
  );
};

export default Products;