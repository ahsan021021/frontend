import React from 'react';
import { Shield, Key, Smartphone, History } from 'lucide-react';

function Security() {
  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Security Settings</h2>
      
      <div className="space-y-6">
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-semibold">Account Security</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Two-Factor Authentication</p>
                <p className="text-sm text-gray-400">Add an extra layer of security to your account</p>
              </div>
              <button className="btn-primary">Enable 2FA</button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Password Requirements</p>
                <p className="text-sm text-gray-400">Enforce strong password policies</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <Key className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-semibold">API Security</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">API Access</p>
                <p className="text-sm text-gray-400">Enable API access for third-party integrations</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div>
              <button className="btn-secondary">Manage API Keys</button>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <Smartphone className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-semibold">Device Management</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Trusted Devices</p>
                <p className="text-sm text-gray-400">Manage devices that can access your account</p>
              </div>
              <button className="btn-secondary">View Devices</button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Auto-logout</p>
                <p className="text-sm text-gray-400">Automatically log out after inactivity</p>
              </div>
              <select className="input w-40">
                <option>15 minutes</option>
                <option>30 minutes</option>
                <option>1 hour</option>
                <option>4 hours</option>
              </select>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <History className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-semibold">Security History</h3>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-400 mb-4">Recent security events and login attempts</p>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span>Successful login from Chrome on Windows</span>
                  <span className="text-gray-400">2 hours ago</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Password changed</span>
                  <span className="text-gray-400">2 days ago</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>New device authorized</span>
                  <span className="text-gray-400">5 days ago</span>
                </div>
              </div>
            </div>
            <button className="btn-secondary w-full">View Full History</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Security;