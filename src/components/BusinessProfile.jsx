import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';

function BusinessProfile() {
  const [logo, setLogo] = useState(null);

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Business Profile Settings</h2>
      <div className="card p-6 rounded-lg mb-6">
        <h3 className="text-lg font-semibold mb-4">General Information</h3>
        
        {/* Logo Upload */}
        <div className="mb-6">
          <label className="block mb-2">Business Logo</label>
          <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
            {logo ? (
              <div className="relative inline-block">
                <img src={logo} alt="Business logo" className="max-w-[200px]" />
                <button
                  onClick={() => setLogo(null)}
                  className="absolute top-0 right-0 p-1 bg-red-500 rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div>
                <Upload className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p>Drop your logo here or click to upload</p>
                <p className="text-sm text-gray-500 mt-2">Max size: 2MB</p>
              </div>
            )}
          </div>
        </div>

        {/* Business Details Form */}
        <form className="space-y-4">
          <div>
            <label className="block mb-1">Business Name</label>
            <input type="text" className="input" placeholder="Enter business name" />
          </div>
          
          <div>
            <label className="block mb-1">Business Email</label>
            <input type="email" className="input" placeholder="Enter business email" />
          </div>
          
          <div>
            <label className="block mb-1">Business Phone</label>
            <input type="tel" className="input" placeholder="Enter business phone" />
          </div>
          
          <div>
            <label className="block mb-1">Business Address</label>
            <textarea className="input" rows="3" placeholder="Enter business address"></textarea>
          </div>

          <button type="submit" className="btn-primary">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}

export default BusinessProfile;