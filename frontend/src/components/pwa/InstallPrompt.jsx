// ============================================================================
// Install Prompt Component - CloudPOS
// Shows PWA install prompt to users
// ============================================================================
import { useState, useEffect } from 'react';
import { Download, X, Smartphone } from 'lucide-react';
import { usePWA } from '../../hooks/usePWA';
import Button from '../common/Button';
import { tokens, colorScheme } from '../../config/colors';

const InstallPrompt = () => {
  const { canInstall, promptInstall, dismissInstall } = usePWA();
  const [dismissed, setDismissed] = useState(false);

  // Check if user has previously dismissed
  useEffect(() => {
    const dismissedAt = localStorage.getItem('pwa-install-dismissed');
    if (dismissedAt) {
      const daysSinceDismiss = (Date.now() - parseInt(dismissedAt)) / (1000 * 60 * 60 * 24);
      // Show again after 7 days
      if (daysSinceDismiss < 7) {
        setDismissed(true);
      }
    }
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
    dismissInstall();
  };

  const handleInstall = async () => {
    const installed = await promptInstall();
    if (installed) {
      setDismissed(true);
    }
  };

  if (!canInstall || dismissed) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-slide-up">
      <div
        className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
        style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}
      >
        {/* Header */}
        <div
          className="p-4 text-white"
          style={{ background: `linear-gradient(135deg, ${colorScheme.primary[600]}, ${colorScheme.primary[700]})` }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Smartphone size={20} />
              </div>
              <div>
                <h3 className="font-bold">Install CloudPOS</h3>
                <p className="text-sm text-white/80">Add to your device</p>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Dismiss"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-4">
          <p className={`text-sm ${tokens.text.secondary} mb-4`}>
            Install CloudPOS on your device for quick access and offline support. Works just like a native app!
          </p>

          <div className="flex gap-3">
            <Button
              onClick={handleInstall}
              variant="primary"
              size="md"
              fullWidth
              icon={Download}
            >
              Install App
            </Button>
            <Button
              onClick={handleDismiss}
              variant="secondary"
              size="md"
            >
              Later
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstallPrompt;
