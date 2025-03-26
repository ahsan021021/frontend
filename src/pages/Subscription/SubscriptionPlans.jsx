import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import './SubscriptionPlans.css'; // Import the CSS file for styling
import axios from 'axios';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe('pk_test_51QzOYG2MWieuisj2wn3zMsNYgmAIHK9dfzBvf21D6FeLBoDqcQ086js6otEiAxpK53xSPwdgooBMeshGn6k2tS7300GySQZ0FT'); // Replace with your Stripe Publishable Key

const planLimits = {
  free: 'free', // Free plan has no price ID
  basic: 'basic', // Basic plan
  pro: 'pro', // Professional plan
  premium: 'premium', // Enterprise plan
};

// PaymentModal Component
const PaymentModal = ({ selectedPlan, onClose, onSuccess, onError, errorMessage }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [savedPaymentMethods, setSavedPaymentMethods] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

  // Fetch saved payment methods when the modal opens
  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const response = await axios.get('http://82.180.137.7:5000/api/payment/methods', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (response.status === 200) {
          setSavedPaymentMethods(response.data.paymentMethods || []);
        }
      } catch (error) {
        console.error('Error fetching payment methods:', error);
      }
    };

    fetchPaymentMethods();
  }, []);

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (selectedPlan === 'free') {
        const response = await axios.post(
          'http://82.180.137.7:5000/api/payment/create-subscription',
          { planId: 'free' },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );

        if (response.status === 200) {
          onSuccess(response.data.message || 'Subscription created successfully.');
        } else {
          onError(response.data.message || 'Subscription failed. Please try again.');
        }
      } else if (selectedPaymentMethod) {
        // Use saved payment method
        const response = await axios.post(
          'http://82.180.137.7:5000/api/payment/create-subscription',
          { planId: selectedPlan, paymentMethodId: selectedPaymentMethod },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );

        if (response.status === 200) {
          onSuccess(response.data.message || 'Subscription created successfully.');
        } else {
          onError(response.data.message || 'Subscription failed. Please try again.');
        }
      } else {
        // Use new card details
        const cardElement = elements.getElement(CardElement);
        const { paymentMethod, error } = await stripe.createPaymentMethod({
          type: 'card',
          card: cardElement,
        });

        if (error) {
          onError(error.message);
          setLoading(false);
          return;
        }

        const response = await axios.post(
          'http://82.180.137.7:5000/api/payment/create-subscription',
          { planId: selectedPlan, paymentMethodId: paymentMethod.id },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );

        if (response.status === 200) {
          onSuccess(response.data.message || 'Subscription created successfully.');
        } else {
          onError(response.data.message || 'Subscription failed. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      onError('An error occurred while processing your payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-modal">
      <div className="payment-modal-backdrop" onClick={onClose}></div>
      <div className="payment-modal-content">
        <h2>Enter Payment Details</h2>
        <form onSubmit={handlePayment}>
          {savedPaymentMethods.length > 0 && (
            <div className="saved-payment-methods">
              <h3>Saved Payment Methods</h3>
              {savedPaymentMethods.map((method) => (
                <div key={method.id} className="payment-method">
                  <input
                    type="radio"
                    id={method.id}
                    name="paymentMethod"
                    value={method.id}
                    onChange={() => setSelectedPaymentMethod(method.id)}
                  />
                  <label htmlFor={method.id}>
                    {method.card.brand.toUpperCase()} **** {method.card.last4}
                  </label>
                </div>
              ))}
              <div>
                <input
                  type="radio"
                  id="new-card"
                  name="paymentMethod"
                  value="new"
                  onChange={() => setSelectedPaymentMethod(null)}
                />
                <label htmlFor="new-card">Use a new card</label>
              </div>
            </div>
          )}

          {(!savedPaymentMethods.length || selectedPaymentMethod === null) && (
            <div className="new-card-details">
              <CardElement />
            </div>
          )}

          <button type="submit" className="subscribe-button" disabled={loading}>
            {loading ? 'Processing...' : 'Subscribe'}
          </button>
        </form>
        <button className="close-button" onClick={onClose}>
          Cancel
        </button>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>
    </div>
  );
};

// SubscriptionPlans Component
const SubscriptionPlans = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isSuccessScreenVisible, setIsSuccessScreenVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState(''); // Store success message
  const [errorMessage, setErrorMessage] = useState('');
  const [currentPlan, setCurrentPlan] = useState(''); // Store the user's current plan

  // Fetch the user's current subscription plan
  useEffect(() => {
    const fetchCurrentPlan = async () => {
      try {
        const response = await axios.get('http://82.180.137.7:5000/api/user/subscription-plan', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (response.status === 200) {
          setCurrentPlan(response.data.plan); // Set the current plan (e.g., 'free', 'basic', 'pro', 'premium')
        }
      } catch (error) {
        console.error('Error fetching subscription plan:', error);
        alert('Failed to fetch subscription plan. Please try again.');
      }
    };

    fetchCurrentPlan();
  }, []);

  // Handle plan selection
  const handlePlanSelection = (planKey) => {
    const planId = planLimits[planKey]; // Map the planKey to the backend plan ID
    setSelectedPlan(planId);
    setIsPaymentModalOpen(true); // Open payment modal
  };

  // Determine if a plan button should be disabled
  const isPlanDisabled = (planKey) => {
    const planOrder = ['free', 'basic', 'pro', 'premium'];
    const currentPlanIndex = planOrder.indexOf(currentPlan);
    const planKeyIndex = planOrder.indexOf(planKey);

    return planKeyIndex <= currentPlanIndex; // Disable plans lower than or equal to the current plan
  };

  // Get the button text for a plan
  const getButtonText = (planKey) => {
    if (planKey === currentPlan) {
      return 'Current Plan';
    }

    if (isPlanDisabled(planKey)) {
      return 'Upgrade Plan';
    }

    return 'Upgrade Plan';
  };

  return (
    <div className="subscription-plans">
      {/* Hide plans if success screen is visible */}
      {!isSuccessScreenVisible && (
        <>
          <h1 className="title">Choose Your Plan</h1>
          <div className="plans-container">
            {/* FREE Plan */}
            <div className="plan-card">
              <h2 className="plan-title">FREE</h2>
              <p className="plan-price">$0/month</p>
              <ul className="plan-details">
                <li>Access to everything</li>
                <li>Data scraper - 50/month</li>
                <li>Email marketing - 50/month</li>
                <li>Landing page builder - Build 1 page (no deploy)</li>
                <li className="disabled">Priority support</li>
              </ul>
              <button
                className="plan-button"
                onClick={() => handlePlanSelection('free')}
                disabled={isPlanDisabled('free')}
              >
                {getButtonText('free')}
              </button>
            </div>

            {/* BASIC Plan */}
            <div className="plan-card highlighted">
              <h2 className="plan-title">BASIC</h2>
              <p className="plan-price">$29.99/month</p>
              <ul className="plan-details">
                <li>Data scraper - First 40 free + API charges</li>
                <li>Email marketing - 2,000 emails/month</li>
                <li>Landing page builder - 1 page with deploy</li>
                <li>Priority email support</li>
              </ul>
              <button
                className="plan-button"
                onClick={() => handlePlanSelection('basic')}
                disabled={isPlanDisabled('basic')}
              >
                {getButtonText('basic')}
              </button>
            </div>

            {/* PROFESSIONAL Plan */}
            <div className="plan-card">
              <h2 className="plan-title">PRO</h2>
              <p className="plan-price">$49.99/month</p>
              <ul className="plan-details">
                <li>Data scraper - First 40 free + API charges</li>
                <li>Email marketing - 5,000 emails/month</li>
                <li>Landing page builder - 2 pages with deploy</li>
                <li>24/7 Priority support</li>
              </ul>
              <button
                className="plan-button"
                onClick={() => handlePlanSelection('pro')}
                disabled={isPlanDisabled('pro')}
              >
                {getButtonText('pro')}
              </button>
            </div>

            {/* ENTERPRISE Plan */}
            <div className="plan-card">
              <h2 className="plan-title">PREMIUM</h2>
              <p className="plan-price">$89.99/month</p>
              <ul className="plan-details">
                <li>Data scraper - First 40 free + API charges</li>
                <li>Email marketing - 10,000 emails/month</li>
                <li>Landing page builder - 3 pages with deploy</li>
                <li>Dedicated support manager</li>
              </ul>
              <button
                className="plan-button"
                onClick={() => handlePlanSelection('premium')}
                disabled={isPlanDisabled('premium')}
              >
                {currentPlan === 'premium' ? 'Top of the Line Plan' : 'Upgrade Plan'}
              </button>
            </div>
          </div>
        </>
      )}

      {/* Payment Modal */}
      {isPaymentModalOpen && (
        <Elements stripe={stripePromise}>
          <PaymentModal
            selectedPlan={selectedPlan}
            onClose={() => setIsPaymentModalOpen(false)}
            onSuccess={(message) => {
              setIsPaymentModalOpen(false);
              setSuccessMessage(message); // Set success message
              setIsSuccessScreenVisible(true);
            }}
            onError={(message) => setErrorMessage(message)}
            errorMessage={errorMessage} // Pass errorMessage as a prop
          />
        </Elements>
      )}

      {/* Success Screen */}
      {isSuccessScreenVisible && (
        <div className="success-screen">
          <div className="success-content">
            <div className="animation-container">
              <div className="verified-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="green"
                  className="verified-checkmark"
                >
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-1.5 18l-5-5 1.414-1.414L10.5 14.586l7.086-7.086L19 9l-8.5 9z" />
                </svg>
              </div>
              <h1>🎉 Congratulations! 🎉</h1>
              <p>{successMessage}</p> {/* Display success message */}
            </div>
            <button className="dashboard-button" onClick={() => (window.location.href = '/dashboard')}>
              Go to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionPlans;