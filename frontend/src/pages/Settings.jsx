// ============================================================================
// Settings Page - CloudPOS
// ============================================================================
import { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon,
  Store,
  DollarSign,
  Save,
  CheckCircle,
  Mail,
  Phone,
  MapPin,
  Percent,
  Pencil,
  X,
} from 'lucide-react';
import api from '../services/api';
import { useSettings } from '../context/SettingsContext';
import Loading from '../components/common/Loading';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import { SectionCard } from '../components/common/Card';
import { tokens, alertColors, colorScheme } from '../config/colors';

const Settings = () => {
  const { updateSettings: updateGlobalSettings } = useSettings();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    store_name: '',
    store_email: '',
    store_phone: '',
    store_address: '',
    tax_rate: 10,
    currency: 'USD',
    currency_symbol: '$',
  });
  const [originalData, setOriginalData] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await api.getSettings();
      const data = {
        store_name: response.settings.store_name || '',
        store_email: response.settings.store_email || '',
        store_phone: response.settings.store_phone || '',
        store_address: response.settings.store_address || '',
        tax_rate: response.settings.tax_rate || 10,
        currency: response.settings.currency || 'USD',
        currency_symbol: response.settings.currency_symbol || '$',
      };
      setFormData(data);
      setOriginalData(data);
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

  const handleEdit = () => {
    setIsEditing(true);
    setMessage({ type: '', text: '' });
  };

  const handleCancel = () => {
    setFormData(originalData);
    setIsEditing(false);
    setMessage({ type: '', text: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setMessage({ type: '', text: '' });

      await api.updateSettings(formData);

      // Update global settings context so changes reflect across the app
      updateGlobalSettings(formData);

      setMessage({ type: 'success', text: 'Settings saved successfully!' });
      setOriginalData(formData);
      setIsEditing(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Failed to save settings:', error);
      setMessage({ type: 'error', text: 'Failed to save settings' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loading message="Loading settings..." />;
  }

  const currencyOptions = [
    { value: 'LKR', label: 'LKR - Sri Lankan Rupee' },
    { value: 'USD', label: 'USD - US Dollar' },
    { value: 'EUR', label: 'EUR - Euro' },
    { value: 'GBP', label: 'GBP - British Pound' },
    { value: 'JPY', label: 'JPY - Japanese Yen' },
    { value: 'CAD', label: 'CAD - Canadian Dollar' },
    { value: 'AUD', label: 'AUD - Australian Dollar' },
    { value: 'INR', label: 'INR - Indian Rupee' },
  ];

  return (
    <div className="space-y-6">
      {/* ── Page Header ────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
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
        {!isEditing && (
          <Button
            type="button"
            onClick={handleEdit}
            variant="primary"
            size="lg"
            icon={Pencil}
          >
            Edit Settings
          </Button>
        )}
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
              disabled={!isEditing}
            />

            <Input
              label="Store Email"
              type="email"
              name="store_email"
              value={formData.store_email}
              onChange={handleChange}
              placeholder="store@example.com"
              icon={Mail}
              disabled={!isEditing}
            />

            <Input
              label="Store Phone"
              type="tel"
              name="store_phone"
              value={formData.store_phone}
              onChange={handleChange}
              placeholder="+1 (555) 123-4567"
              icon={Phone}
              disabled={!isEditing}
            />

            <Input
              label="Store Address"
              type="text"
              name="store_address"
              value={formData.store_address}
              onChange={handleChange}
              placeholder="123 Main St, City, State 12345"
              icon={MapPin}
              disabled={!isEditing}
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
              disabled={!isEditing}
            />

            <Select
              label="Currency"
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              options={currencyOptions}
              icon={DollarSign}
              disabled={!isEditing}
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
              disabled={!isEditing}
            />
          </div>
        </SectionCard>

        {/* ── Action Buttons (only show when editing) ────────────────────────── */}
        {isEditing && (
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <Button
              type="button"
              onClick={handleCancel}
              variant="secondary"
              size="lg"
              disabled={saving}
              icon={X}
            >
              Cancel
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
        )}
      </form>
    </div>
  );
};

export default Settings;
