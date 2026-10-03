import {
    useStripe,
    useElements,
    PaymentElement,
  } from '@stripe/react-stripe-js';
  import { useState, useEffect } from 'react';
  
  const Checkout = ({ amount, onClose }: any) => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
      if (elements) {
        setIsReady(true);
      }
    }, [elements]);
  
    const pay = async (e: any) => {
      e.preventDefault();
      if (!stripe || !elements) return;
  
      setLoading(true);
      setMessage('');
  
      try {
        const { error, paymentIntent } = await stripe.confirmPayment({
          elements,
          redirect: 'if_required',
          confirmParams: {
            return_url: window.location.origin + '/payment-success',
          },
        });
  
        if (error) {
          setMessage(error.message || 'Payment failed');
        } else if (paymentIntent?.status === 'succeeded') {
          setMessage('Payment Success! 🎉');
          setTimeout(() => {
            onClose();
          }, 2000);
        }
      } catch (err: any) {
        setMessage(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        overflow: 'auto',
        padding: '20px',
      }}>
        <div style={{
          background: 'white',
          padding: '30px',
          borderRadius: '12px',
          maxWidth: '500px',
          width: '100%',
          position: 'relative',
          maxHeight: '90vh',
          overflowY: 'auto',
          margin: 'auto',
        }}>
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              zIndex: 10,
            }}
          >
            ✕
          </button>
  
          <form onSubmit={pay}>
            <h3 style={{ marginBottom: '20px' }}>Pay ${amount.toFixed(2)}</h3>
  
            {!isReady ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <div style={{
                  display: 'inline-block',
                  width: '40px',
                  height: '40px',
                  border: '4px solid #f3f4f6',
                  borderTop: '4px solid #667eea',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                <p style={{ marginTop: '16px', color: '#666' }}>Loading payment form...</p>
                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
              </div>
            ) : (
              <>
                <div style={{ marginBottom: '20px', minHeight: '300px' }}>
                  <PaymentElement 
                    options={{
                      layout: {
                        type: 'accordion',
                        defaultCollapsed: false,
                        radios: true,
                        spacedAccordionItems: true
                      }
                    }}
                  />
                </div>
  
                <button
                  type="submit"
                  disabled={!stripe || loading}
                  style={{
                    width: '100%',
                    padding: '14px 20px',
                    borderRadius: '8px',
                    background: loading || !stripe ? '#ccc' : '#667eea',
                    color: 'white',
                    border: 'none',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: loading || !stripe ? 'not-allowed' : 'pointer',
                    transition: 'background 0.3s',
                  }}
                >
                  {loading ? 'Processing...' : 'Pay Now'}
                </button>
              </>
            )}
  
            {message && (
              <div
                style={{
                  marginTop: '20px',
                  padding: '12px',
                  borderRadius: '8px',
                  textAlign: 'center',
                  background: message.includes('Success') ? '#d1fae5' : '#fee2e2',
                  color: message.includes('Success') ? '#065f46' : '#991b1b',
                  fontWeight: '500',
                }}
              >
                {message}
              </div>
            )}
          </form>
        </div>
      </div>
    );
  };
  
  export default Checkout;