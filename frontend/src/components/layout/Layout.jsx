// ============================================================================
// Layout Component - CloudPOS
// ============================================================================
import { useState } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';
import Header from './Header';
import { tokens } from '../../config/colors';

const Layout = ({ children, fullWidth = false }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={`flex min-h-screen ${tokens.bg.page}`}>
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-64">
        {/* Header */}
        <Header onMenuClick={() => setSidebarOpen(true)} />

        {/* Page Content */}
        <main className={`flex-1 p-4 md:p-6 overflow-x-hidden ${fullWidth ? 'flex flex-col' : ''}`}>
          {fullWidth ? (
            <div className="flex-1 flex flex-col min-h-0">
              {children}
            </div>
          ) : (
            <div className="content-shell space-y-4">
              <div className="surface-panel p-4 sm:p-6">
                {children}
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className={`px-6 py-4 text-center text-sm ${tokens.text.muted} border-t ${tokens.border.default}`}>
          <p>CloudPOS &copy; {new Date().getFullYear()} - Point of Sale System</p>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
