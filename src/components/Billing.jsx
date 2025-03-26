import React, { useState, useEffect } from 'react';
import { CreditCard, Trash2, AlertTriangle } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe('pk_test_51QzOYG2MWieuisj2wn3zMsNYgmAIHK9dfzBvf21D6FeLBoDqcQ086js6otEiAxpK53xSPwdgooBMeshGn6k2tS7300GySQZ0FT'); // Replace with your Stripe publishable key

function Billing() {
  const [currentPlan, setCurrentPlan] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [paymentMethodToDelete, setPaymentMethodToDelete] = useState(null);
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    const fetchBillingDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const updatedPaymentMethodsResponse = await axios.get('http://82.180.137.7:5000/api/payment/get-payment-methods', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPaymentMethods(updatedPaymentMethodsResponse.data.paymentMethods);
  

        const subscriptionResponse = await axios.get('http://82.180.137.7:5000/api/user/subscription-plan', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCurrentPlan(subscriptionResponse.data);
      } catch (error) {
        console.error('Error fetching billing details:', error);
        setMessage('Failed to fetch billing details.');
      } finally {
        setLoading(false);
      }
    };

    fetchBillingDetails();
  }, []);
  

  const handleAddPaymentMethod = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setMessage('Stripe.js has not loaded yet.');
      return;
    }

    const cardElement = elements.getElement(CardElement);

    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (error) {
        setMessage(`Error: ${error.message}`);
        return;
      }

      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://82.180.137.7:5000/api/payment/add-payment-method',
        { paymentMethodId: paymentMethod.id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(response.data.message);

      const updatedPaymentMethodsResponse = await axios.get('http://82.180.137.7:5000/api/payment/get-payment-methods', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPaymentMethods(updatedPaymentMethodsResponse.data.paymentMethods);

      cardElement.clear();
    } catch (error) {
      console.error('Error adding payment method:', error);
      setMessage('Failed to add payment method.');
    }
  };

  const handleDeletePaymentMethod = async () => {
    if (!paymentMethodToDelete) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`http://82.180.137.7:5000/api/payment/delete-payment-method/${paymentMethodToDelete}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage(response.data.message);

      const updatedPaymentMethodsResponse = await axios.get('http://82.180.137.7:5000/api/payment/get-payment-methods', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPaymentMethods(updatedPaymentMethodsResponse.data.paymentMethods);

      setShowDeletePopup(false);
      setPaymentMethodToDelete(null);
    } catch (error) {
      console.error('Error deleting payment method:', error);
      setMessage('Failed to delete payment method.');
    }
  };

  const handleSetDefaultPaymentMethod = async (paymentMethodId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://82.180.137.7:5000/api/payment/set-default-payment-method',
        { paymentMethodId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage(response.data.message);

      const updatedPaymentMethodsResponse = await axios.get('http://82.180.137.7:5000/api/payment/get-payment-methods', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPaymentMethods(updatedPaymentMethodsResponse.data.paymentMethods);
    } catch (error) {
      console.error('Error setting default payment method:', error);
      setMessage('Failed to set default payment method.');
    }
  };

  const handleUpgradePlan = () => {
    navigate('/subscription-plans');
  };

  if (loading) {
    return <p>Loading billing details...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Billing Dashboard</h2>

      <div className="card p-6 rounded-lg mb-6">
        <h3 className="text-lg font-semibold mb-4">Current Plan</h3>
        <div className="flex items-center justify-between p-4 border border-gray-700 rounded-lg">
          {currentPlan ? (
            <>
              <div>
                <h4 className="font-semibold">{currentPlan.subscriptionPlan}</h4>
                <p className="text-gray-400">${currentPlan.price}/month</p>
              </div>
              <button className="btn-primary" onClick={handleUpgradePlan}>
                Upgrade Plan
              </button>
            </>
          ) : (
            <p>No subscription plan found.</p>
          )}
        </div>
      </div>

      <div className="card p-6 rounded-lg mb-6">
        <h3 className="text-lg font-semibold mb-4">Payment Methods</h3>
        {paymentMethods.length > 0 ? (
          paymentMethods.map((method) => (
            <div
              key={method.id}
              className={`flex items-center justify-between p-4 border border-gray-700 rounded-lg mb-4 ${
                method.isDefault ? 'bg-gray-800' : ''
              }`}
            >
              <div className="flex items-center gap-4">
                <CreditCard className="w-8 h-8" />
                <div>
                  <p className="font-semibold">•••• •••• •••• {method.last4}</p>
                  <p className="text-sm text-gray-400">
                    {method.brand} - Expires {method.expMonth}/{method.expYear}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!method.isDefault && (
                  <button
                    className="btn-secondary"
                    onClick={() => handleSetDefaultPaymentMethod(method.id)}
                  >
                    Set as Default
                  </button>
                )}
                <button
                  className="btn-danger"
                  onClick={() => {
                    setPaymentMethodToDelete(method.id);
                    setShowDeletePopup(true);
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400 mb-4">No payment methods found. Add one below.</p>
        )}

        <form onSubmit={handleAddPaymentMethod}>
          <div className="p-4 border border-gray-700 rounded-lg mb-4">
            <CardElement />
          </div>
          <button className="btn-primary mt-4" type="submit">
            Add Payment Method
          </button>
        </form>
        {message && <p className="text-sm text-gray-400 mt-2">{message}</p>}
      </div>

      {showDeletePopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <AlertTriangle className="w-12 h-12 text-yellow-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Are you sure?</h3>
            <p className="text-gray-400 mb-4">
              Removing this card will prevent you from making future purchases with it.
            </p>
            <div className="flex justify-end gap-2">
              <button
                className="btn-secondary"
                onClick={() => {
                  setShowDeletePopup(false);
                  setPaymentMethodToDelete(null);
                }}
              >
                Cancel
              </button>
              <button className="btn-danger" onClick={handleDeletePaymentMethod}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const App = () => (
  <Elements stripe={stripePromise}>
    <Billing />
  </Elements>
);

export default App;