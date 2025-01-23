import React from 'react';
import { CreditCard, ShoppingCart } from 'lucide-react';

function Billing() {
  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Billing Dashboard</h2>
      
      <div className="flex mb-6 border-b border-gray-700">
        <button className="px-4 py-2 tab-active">Subscriptions</button>
        <button className="px-4 py-2">Payments</button>
        <button className="px-4 py-2">Wallet & Transactions</button>
      </div>

      <div className="card p-6 rounded-lg mb-6">
        <h3 className="text-lg font-semibold mb-4">Current Plan</h3>
        <div className="flex items-center justify-between p-4 border border-gray-700 rounded-lg">
          <div>
            <h4 className="font-semibold">Professional Plan</h4>
            <p className="text-gray-400">$49/month</p>
          </div>
          <button className="btn-primary">Upgrade Plan</button>
        </div>
      </div>

      <div className="card p-6 rounded-lg mb-6">
        <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
        <div className="flex items-center gap-4 p-4 border border-gray-700 rounded-lg mb-4">
          <CreditCard className="w-8 h-8" />
          <div>
            <p className="font-semibold">•••• •••• •••• 4242</p>
            <p className="text-sm text-gray-400">Expires 12/24</p>
          </div>
        </div>
        <button className="btn-primary">Add Payment Method</button>
      </div>

      <div className="card p-6 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Marketplace Apps</h3>
          <button className="btn-primary flex items-center gap-2">
            <ShoppingCart className="w-4 h-4" />
            Browse Marketplace
          </button>
        </div>
        <p className="text-gray-400">Enhance your CRM with additional apps and integrations</p>
      </div>
    </div>
  );
}

export default Billing;