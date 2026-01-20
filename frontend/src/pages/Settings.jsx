// ============================================================================
// Settings Page - CloudPOS
// ============================================================================
import { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon,
  Store,
  DollarSign,
  Palette,
  Save,
  RotateCcw,
  CheckCircle,
  Mail,
  Phone,
  MapPin,
  Percent,
} from 'lucide-react';
import api from '../services/api';
import Loading from '../components/common/Loading';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import { SectionCard } from '../components/common/Card';
import { tokens, alertColors, colorScheme } from '../config/colors';

const Settings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState(null);
  const [formData, setFormData] = useState({
    store_name: '',
    store_email: '',
    store_phone: '',
    store_address: '',
    tax_rate: 10,
    currency: 'USD',
    currency_symbol: '$',
    theme_primary: 'blue',
    theme_success: 'green',
    theme_danger: 'red',
    theme_neutral: 'gray',
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await api.getSettings();
      setSettings(response.settings);
      setFormData({
        store_name: response.settings.store_name || '',
        store_email: response.settings.store_email || '',
        store_phone: response.settings.store_phone || '',
        store_address: response.settings.store_address || '',
        tax_rate: response.settings.tax_rate || 10,
        currency: response.settings.currency || 'USD',
        currency_symbol: response.settings.currency_symbol || '$',
        theme_primary: response.settings.theme_primary || 'blue',
        theme_success: response.settings.theme_success || 'green',
        theme_danger: response.settings.theme_danger || 'red',
        theme_neutral: response.settings.theme_neutral || 'gray',
      });
    } catch (error) {
      console.error('Failed to fetch settings:', error);
      setMessage({ type: 'error', text: 'Failed to load settings' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'tax_rate' ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setMessage({ type: '', text: '' });

      await api.updateSettings(formData);

      setMessage({ type: 'success', text: 'Settings saved successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      fetchSettings();
    } catch (error) {
      console.error('Failed to save settings:', error);
      setMessage({ type: 'error', text: 'Failed to save settings' });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!confirm('Are you sure you want to reset all settings to defaults?')) {
      return;
    }

    try {
      setSaving(true);
      await api.resetSettings();
      setMessage({ type: 'success', text: 'Settings reset to defaults' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      fetchSettings();
    } catch (error) {
      console.error('Failed to reset settings:', error);
      setMessage({ type: 'error', text: 'Failed to reset settings' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loading message="Loading settings..." />;
  }

  const colorOptions = [
    { value: 'blue', label: 'Blue', bg: 'bg-blue-500' },
    { value: 'green', label: 'Green', bg: 'bg-green-500' },
    { value: 'red', label: 'Red', bg: 'bg-red-500' },
    { value: 'purple', label: 'Purple', bg: 'bg-purple-500' },
    { value: 'orange', label: 'Orange', bg: 'bg-orange-500' },
    { value: 'gray', label: 'Gray', bg: 'bg-gray-500' },
  ];

  const currencyOptions = [
    { value: 'USD', label: 'USD - US Dollar' },
    { value: 'EUR', label: 'EUR - Euro' },
    { value: 'GBP', label: 'GBP - British Pound' },
    { value: 'JPY', label: 'JPY - Japanese Yen' },
    { value: 'CAD', label: 'CAD - Canadian Dollar' },
    { value: 'AUD', label: 'AUD - Australian Dollar' },
  ];

  return (
    <div className="space-y-6">
      {/* ── Page Header ────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-white"
          style={{ backgroundColor: colorScheme.primary[600] }}
        >
          <SettingsIcon size={24} />
        </div>
        <div>
          <h1 className={`text-2xl font-bold ${tokens.text.primary}`}>Settings</h1>
          <p className={tokens.text.muted}>Manage your store configuration and preferences</p>
        </div>
      </div>

      {/* ── Success/Error Messages ─────────────────────────────────────────── */}
      {message.text && (
        <div
          className={`px-4 py-3 rounded-xl flex items-center gap-2 ${
            message.type === 'success' ? alertColors.success.full : alertColors.error.full
          }`}
        >
          {message.type === 'success' && <CheckCircle size={20} />}
          {message.type === 'error' && (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          )}
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ── Store Information ────────────────────────────────────────────── */}
        <SectionCard title="Store Information" icon={Store}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="Store Name"
              type="text"
              name="store_name"
              value={formData.store_name}
              onChange={handleChange}
              placeholder="My Store"
              icon={Store}
              required
            />

            <Input
              label="Store Email"
              type="email"
              name="store_email"
              value={formData.store_email}
              onChange={handleChange}
              placeholder="store@example.com"
              icon={Mail}
            />

            <Input
              label="Store Phone"
              type="tel"
              name="store_phone"
              value={formData.store_phone}
              onChange={handleChange}
              placeholder="+1 (555) 123-4567"
              icon={Phone}
            />

            <Input
              label="Store Address"
              type="text"
              name="store_address"
              value={formData.store_address}
              onChange={handleChange}
              placeholder="123 Main St, City, State 12345"
              icon={MapPin}
            />
          </div>
        </SectionCard>

        {/* ── Financial Settings ───────────────────────────────────────────── */}
        <SectionCard title="Financial Settings" icon={DollarSign}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Input
              label="Tax Rate (%)"
              type="number"
              name="tax_rate"
              value={formData.tax_rate}
              onChange={handleChange}
              min="0"
              max="100"
              step="0.01"
              icon={Percent}
              helperText="Default tax rate for all transactions"
              required
            />

            <Select
              label="Currency"
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              options={currencyOptions}
              icon={DollarSign}
            />

            <Input
              label="Currency Symbol"
              type="text"
              name="currency_symbol"
              value={formData.currency_symbol}
              onChange={handleChange}
              maxLength="3"
              placeholder="$"
              icon={DollarSign}
            />
          </div>
        </SectionCard>

        {/* ── Color Theme ──────────────────────────────────────────────────── */}
        <SectionCard title="Color Theme" icon={Palette}>
          <div className="space-y-6">
            {/* Primary Color */}
            <div>
              <label className={`block text-sm font-semibold ${tokens.text.secondary} mb-3`}>
                Primary Color (Main actions, links)
              </label>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {colorOptions.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, theme_primary: color.value })}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      formData.theme_primary === color.value
                        ? 'border-gray-900 ring-2 ring-blue-500 ring-offset-2'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-full h-10 ${color.bg} rounded-lg mb-2`}></div>
                    <p className={`text-xs font-medium text-center ${tokens.text.secondary}`}>
                      {color.label}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Success Color */}
            <div>
              <label className={`block text-sm font-semibold ${tokens.text.secondary} mb-3`}>
                Success Color (Confirmations, positive actions)
              </label>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {colorOptions.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, theme_success: color.value })}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      formData.theme_success === color.value
                        ? 'border-gray-900 ring-2 ring-green-500 ring-offset-2'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-full h-10 ${color.bg} rounded-lg mb-2`}></div>
                    <p className={`text-xs font-medium text-center ${tokens.text.secondary}`}>
                      {color.label}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Danger Color */}
            <div>
              <label className={`block text-sm font-semibold ${tokens.text.secondary} mb-3`}>
                Danger Color (Errors, deletions, alerts)
              </label>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {colorOptions.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, theme_danger: color.value })}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      formData.theme_danger === color.value
                        ? 'border-gray-900 ring-2 ring-red-500 ring-offset-2'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-full h-10 ${color.bg} rounded-lg mb-2`}></div>
                    <p className={`text-xs font-medium text-center ${tokens.text.secondary}`}>
                      {color.label}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Info Note */}
            <div className={`${alertColors.info.bg} border ${alertColors.info.border} rounded-xl p-4`}>
              <p className={`text-sm ${alertColors.info.text}`}>
                <strong>Note:</strong> Color changes will be applied after saving and refreshing the page.
                The system uses a centralized color scheme with black, white, blue, green, and red as the primary colors.
              </p>
            </div>
          </div>
        </SectionCard>

        {/* ── Action Buttons ───────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-3 justify-end">
          <Button
            type="button"
            onClick={handleReset}
            variant="secondary"
            size="lg"
            disabled={saving}
            icon={RotateCcw}
          >
            Reset to Defaults
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={saving}
            icon={Save}
          >
            Save Settings
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
