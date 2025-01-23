import React from 'react';
import { Palette, Layout, Type, Image } from 'lucide-react';

function Appearance() {
  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Appearance Settings</h2>
      
      <div className="space-y-6">
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <Palette className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-semibold">Theme</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Color Scheme</label>
              <div className="grid grid-cols-3 gap-4">
                <button className="p-4 rounded-lg bg-gray-800 border-2 border-blue-500">
                  <div className="text-center">
                    <span className="block text-sm font-medium">Dark</span>
                  </div>
                </button>
                <button className="p-4 rounded-lg bg-white border border-gray-700">
                  <div className="text-center">
                    <span className="block text-sm font-medium text-gray-900">Light</span>
                  </div>
                </button>
                <button className="p-4 rounded-lg bg-gradient-to-b from-white to-gray-900 border border-gray-700">
                  <div className="text-center">
                    <span className="block text-sm font-medium">Auto</span>
                  </div>
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Accent Color</label>
              <div className="grid grid-cols-6 gap-4">
                <button className="w-10 h-10 rounded-full bg-blue-500 ring-2 ring-offset-2 ring-offset-gray-800 ring-blue-500"></button>
                <button className="w-10 h-10 rounded-full bg-purple-500"></button>
                <button className="w-10 h-10 rounded-full bg-green-500"></button>
                <button className="w-10 h-10 rounded-full bg-red-500"></button>
                <button className="w-10 h-10 rounded-full bg-yellow-500"></button>
                <button className="w-10 h-10 rounded-full bg-pink-500"></button>
              </div>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <Layout className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-semibold">Layout</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Navigation Style</label>
              <select className="input">
                <option>Sidebar</option>
                <option>Top Navigation</option>
                <option>Minimal</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Compact Mode</p>
                <p className="text-sm text-gray-400">Reduce spacing between elements</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <Type className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-semibold">Typography</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Font Family</label>
              <select className="input">
                <option>Inter</option>
                <option>Roboto</option>
                <option>Open Sans</option>
                <option>System Default</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Font Size</label>
              <select className="input">
                <option>Small</option>
                <option>Medium (Default)</option>
                <option>Large</option>
                <option>Extra Large</option>
              </select>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <Image className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-semibold">Custom Branding</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Favicon</label>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-700 rounded flex items-center justify-center">
                  <Image className="w-6 h-6 text-gray-400" />
                </div>
                <button className="btn-secondary">Upload New</button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Login Page Background</label>
              <div className="flex items-center gap-4">
                <div className="w-32 h-20 bg-gray-700 rounded flex items-center justify-center">
                  <Image className="w-6 h-6 text-gray-400" />
                </div>
                <button className="btn-secondary">Upload New</button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Custom CSS</p>
                <p className="text-sm text-gray-400">Apply custom CSS styles</p>
              </div>
              <button className="btn-secondary">Edit CSS</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Appearance;