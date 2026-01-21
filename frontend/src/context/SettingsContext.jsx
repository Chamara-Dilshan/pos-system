import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const SettingsContext = createContext();

// Local storage key for caching settings
const SETTINGS_STORAGE_KEY = 'cloudpos_settings';

// Get cached settings from localStorage
const getCachedSettings = () => {
  try {
    const cached = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (error) {
    console.error('Failed to parse cached settings:', error);
  }
  return null;
};

// Save settings to localStorage
const cacheSettings = (settings) => {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to cache settings:', error);
  }
};

// Default settings
const defaultSettings = {
  store_name: 'CloudPOS',
  store_email: '',
  store_phone: '',
  store_address: '',
  tax_rate: 10,
  currency: 'USD',
  currency_symbol: '$',
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsProvider = ({ children }) => {
  const { currentUser } = useAuth();

  // Initialize with cached settings or defaults
  const [settings, setSettings] = useState(() => {
    const cached = getCachedSettings();
    return cached || defaultSettings;
  });
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await api.getSettings();
      if (response.settings) {
        const newSettings = {
          store_name: response.settings.store_name || defaultSettings.store_name,
          store_email: response.settings.store_email || defaultSettings.store_email,
          store_phone: response.settings.store_phone || defaultSettings.store_phone,
          store_address: response.settings.store_address || defaultSettings.store_address,
          tax_rate: response.settings.tax_rate ?? defaultSettings.tax_rate,
          currency: response.settings.currency || defaultSettings.currency,
          currency_symbol: response.settings.currency_symbol || defaultSettings.currency_symbol,
        };
        setSettings(newSettings);
        // Cache the settings to localStorage
        cacheSettings(newSettings);
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch settings when user logs in
  useEffect(() => {
    if (currentUser) {
      fetchSettings();
    } else {
      // Clear cached settings when user logs out
      localStorage.removeItem(SETTINGS_STORAGE_KEY);
      setSettings(defaultSettings);
    }
  }, [currentUser]);

  // Function to update settings (called from Settings page after save)
  const updateSettings = (newSettings) => {
    const updated = {
      ...settings,
      ...newSettings,
    };
    setSettings(updated);
    // Update the cache immediately
    cacheSettings(updated);
  };

  // Helper to format price with currency symbol
  const formatPrice = (amount) => {
    return `${settings.currency_symbol}${parseFloat(amount).toFixed(2)}`;
  };

  const value = {
    settings,
    loading,
    fetchSettings,
    updateSettings,
    formatPrice,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};
