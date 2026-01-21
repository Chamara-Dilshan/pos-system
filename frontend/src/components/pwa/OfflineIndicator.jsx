// ============================================================================
// Offline Indicator Component - CloudPOS
// Shows offline status and update notifications
// ============================================================================
import { WifiOff, RefreshCw, X } from 'lucide-react';
import { usePWA } from '../../hooks/usePWA';
import { alertColors } from '../../config/colors';

const OfflineIndicator = () => {
  const { isOnline, updateAvailable, applyUpdate } = usePWA();

  // Show offline indicator
  if (!isOnline) {
    return (
      <div className="fixed top-0 left-0 right-0 z-50">
        <div className={`${alertColors.warning.full} px-4 py-2 flex items-center justify-center gap-2 text-sm font-medium`}>
          <WifiOff size={16} />
          <span>You are offline. Some features may be unavailable.</span>
        </div>
      </div>
    );
  }

  // Show update available notification
  if (updateAvailable) {
    return (
      <div className="fixed top-0 left-0 right-0 z-50">
        <div className={`${alertColors.info.full} px-4 py-2 flex items-center justify-center gap-3 text-sm font-medium`}>
          <RefreshCw size={16} />
          <span>A new version is available!</span>
          <button
            onClick={applyUpdate}
            className="underline hover:no-underline font-semibold"
          >
            Update now
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default OfflineIndicator;
