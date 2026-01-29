import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { SettingsProvider } from './context/SettingsContext';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import Setup from './pages/auth/Setup';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import ProductForm from './pages/ProductForm';
import Categories from './pages/Categories';
import POS from './pages/POS';
import Orders from './pages/Orders';
import OrderDetails from './pages/OrderDetails';
import Users from './pages/Users';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

import Layout from './components/layout/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';
import SetupGuard from './components/common/SetupGuard';
import InstallPrompt from './components/pwa/InstallPrompt';
import OfflineIndicator from './components/pwa/OfflineIndicator';

function App() {
  return (
    <Router>
      <AuthProvider>
        <SettingsProvider>
          <CartProvider>
            {/* PWA Components */}
          <OfflineIndicator />
          <InstallPrompt />

          <Routes>
          {/* Setup route - accessible only when no admin exists */}
          <Route path="/setup" element={<Setup />} />

          {/* Public routes - protected by SetupGuard */}
          <Route path="/login" element={<SetupGuard><Login /></SetupGuard>} />
          <Route path="/register" element={<SetupGuard><Register /></SetupGuard>} />
          <Route path="/forgot-password" element={<SetupGuard><ForgotPassword /></SetupGuard>} />

          {/* Protected routes - wrapped with SetupGuard and ProtectedRoute */}
          <Route
            path="/"
            element={
              <SetupGuard>
                <ProtectedRoute adminOnly>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              </SetupGuard>
            }
          />

          <Route
            path="/pos"
            element={
              <SetupGuard>
                <ProtectedRoute>
                  <Layout fullWidth>
                    <POS />
                  </Layout>
                </ProtectedRoute>
              </SetupGuard>
            }
          />

          <Route
            path="/products"
            element={
              <SetupGuard>
                <ProtectedRoute adminOnly>
                  <Layout>
                    <Products />
                  </Layout>
                </ProtectedRoute>
              </SetupGuard>
            }
          />

          <Route
            path="/products/new"
            element={
              <SetupGuard>
                <ProtectedRoute adminOnly>
                  <Layout>
                    <ProductForm />
                  </Layout>
                </ProtectedRoute>
              </SetupGuard>
            }
          />

          <Route
            path="/products/:id"
            element={
              <SetupGuard>
                <ProtectedRoute adminOnly>
                  <Layout>
                    <ProductForm />
                  </Layout>
                </ProtectedRoute>
              </SetupGuard>
            }
          />

          <Route
            path="/categories"
            element={
              <SetupGuard>
                <ProtectedRoute adminOnly>
                  <Layout>
                    <Categories />
                  </Layout>
                </ProtectedRoute>
              </SetupGuard>
            }
          />

          <Route
            path="/orders"
            element={
              <SetupGuard>
                <ProtectedRoute>
                  <Layout>
                    <Orders />
                  </Layout>
                </ProtectedRoute>
              </SetupGuard>
            }
          />

          <Route
            path="/orders/:id"
            element={
              <SetupGuard>
                <ProtectedRoute>
                  <Layout>
                    <OrderDetails />
                  </Layout>
                </ProtectedRoute>
              </SetupGuard>
            }
          />

          <Route
            path="/reports"
            element={
              <SetupGuard>
                <ProtectedRoute adminOnly>
                  <Layout>
                    <Reports />
                  </Layout>
                </ProtectedRoute>
              </SetupGuard>
            }
          />

          <Route
            path="/users"
            element={
              <SetupGuard>
                <ProtectedRoute adminOnly>
                  <Layout>
                    <Users />
                  </Layout>
                </ProtectedRoute>
              </SetupGuard>
            }
          />

          <Route
            path="/settings"
            element={
              <SetupGuard>
                <ProtectedRoute adminOnly>
                  <Layout>
                    <Settings />
                  </Layout>
                </ProtectedRoute>
              </SetupGuard>
            }
          />

          {/* Catch all - redirect to login */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
          </CartProvider>
        </SettingsProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
