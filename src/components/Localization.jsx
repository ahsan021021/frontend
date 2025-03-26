import React, { useState, useEffect } from 'react';
import { Globe, Clock, Calendar, DollarSign } from 'lucide-react';
import axios from 'axios';

function Localization() {
  const [defaultLanguage, setDefaultLanguage] = useState('English (US)');
  const [regionFormat, setRegionFormat] = useState('United States');
  const [timeZone, setTimeZone] = useState('(GMT-05:00) Eastern Time');
  const [timeFormat, setTimeFormat] = useState('12-hour (AM/PM)');
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');
  const [firstDayOfWeek, setFirstDayOfWeek] = useState('Sunday');
  const [currency, setCurrency] = useState('USD ($)');
  const [numberFormat, setNumberFormat] = useState('1,234.56');

  // Fetch localization settings on page load
  useEffect(() => {
    const fetchLocalization = async () => {
      try {
        const response = await axios.get('http://82.180.137.7:5000/api/localization', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } // Include the token in the request
        });
        const settings = response.data;
        if (settings) {
          setDefaultLanguage(settings.defaultLanguage);
          setRegionFormat(settings.regionFormat);
          setTimeZone(settings.timeZone);
          setTimeFormat(settings.timeFormat);
          setDateFormat(settings.dateFormat);
          setFirstDayOfWeek(settings.firstDayOfWeek);
          setCurrency(settings.currency);
          setNumberFormat(settings.numberFormat);
        }
      } catch (error) {
        console.error('Error fetching localization settings:', error);
      }
    };

    fetchLocalization();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const localizationData = {
      defaultLanguage,
      regionFormat,
      timeZone,
      timeFormat,
      dateFormat,
      firstDayOfWeek,
      currency,
      numberFormat,
    };

    try {
      const response = await axios.post('http://82.180.137.7:5000/api/localization', localizationData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}` // Include the token in the request
        },
      });

      if (response.status === 200) {
        alert('Localization settings updated successfully');
      } else {
        alert('Failed to update localization settings');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while updating localization settings');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Localization Settings</h2>
      
      <div className="space-y-6">
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-semibold">Language & Region</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Default Language</label>
              <select
                className="input"
                value={defaultLanguage}
                onChange={(e) => setDefaultLanguage(e.target.value)}
              >
                <option>English (US)</option>
                <option>Spanish</option>
                <option>French</option>
                <option>German</option>
                <option>Chinese (Simplified)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Region Format</label>
              <select
                className="input"
                value={regionFormat}
                onChange={(e) => setRegionFormat(e.target.value)}
              >
                <option>United States</option>
                <option>United Kingdom</option>
                <option>European Union</option>
                <option>China</option>
                <option>Japan</option>
              </select>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-semibold">Time Zone</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Time Zone</label>
              <select
                className="input"
                value={timeZone}
                onChange={(e) => setTimeZone(e.target.value)}
              >
                <option>(GMT-05:00) Eastern Time</option>
                <option>(GMT-08:00) Pacific Time</option>
                <option>(GMT+00:00) UTC</option>
                <option>(GMT+01:00) Central European Time</option>
                <option>(GMT+08:00) China Standard Time</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Time Format</label>
              <select
                className="input"
                value={timeFormat}
                onChange={(e) => setTimeFormat(e.target.value)}
              >
                <option>12-hour (AM/PM)</option>
                <option>24-hour</option>
              </select>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-semibold">Date Format</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Date Format</label>
              <select
                className="input"
                value={dateFormat}
                onChange={(e) => setDateFormat(e.target.value)}
              >
                <option>MM/DD/YYYY</option>
                <option>DD/MM/YYYY</option>
                <option>YYYY-MM-DD</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">First Day of Week</label>
              <select
                className="input"
                value={firstDayOfWeek}
                onChange={(e) => setFirstDayOfWeek(e.target.value)}
              >
                <option>Sunday</option>
                <option>Monday</option>
              </select>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <DollarSign className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-semibold">Number & Currency</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Currency</label>
              <select
                className="input"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              >
                <option>USD ($)</option>
                <option>EUR (€)</option>
                <option>GBP (£)</option>
                <option>JPY (¥)</option>
                <option>CNY (¥)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Number Format</label>
              <select
                className="input"
                value={numberFormat}
                onChange={(e) => setNumberFormat(e.target.value)}
              >
                <option>1,234.56</option>
                <option>1.234,56</option>
              </select>
            </div>
          </div>
        </div>

        <button type="submit" className="btn-primary" onClick={handleSubmit}>
          Save Changes
        </button>
      </div>
    </div>
  );
}

export default Localization;
