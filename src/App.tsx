import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthenticatedLayout } from './components/AuthenticatedLayout';
import { BadgeCustomizer } from './components/BadgeCustomizer';
import { KeyboardCustomizer } from './components/KeyboardCustomizer';

// Views
import { LandingView } from './views/LandingView';
import { LoginView } from './views/LoginView';
import { RegisterView, StepItem, SocialButton, InputGroup, PasswordInput } from './views/RegisterView';
import { HomeView } from './views/HomeView';
import { ShopView } from './views/ShopView';
import { ProductDetailView } from './views/ProductDetailView';
import { CustomPrintView } from './views/CustomPrintView';
import { CheckoutView } from './views/CheckoutView';
import { TngPaymentView } from './views/TngPaymentView';
import { OrderTrackingView } from './views/OrderTrackingView';
import { BossAdminView } from './views/BossAdminView';
import { AboutView } from './views/AboutView';
import { ContactView } from './views/ContactView';
import { TermsView } from './views/TermsView';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Landing Page */}
          <Route path="/" element={<LandingView />} />

          {/* Authentication Routes */}
          <Route path="/login" element={<LoginView />} />
          <Route path="/register" element={<RegisterView />} />

          {/* Protected Main Application Routes */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <HomeView />
                </AuthenticatedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/shop"
            element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <ShopView />
                </AuthenticatedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/shop/:productId"
            element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <ProductDetailView />
                </AuthenticatedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/custom"
            element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <CustomPrintView />
                </AuthenticatedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/badge-custom"
            element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <div className="pt-6">
                    <BadgeCustomizer />
                  </div>
                </AuthenticatedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/keyboard-custom"
            element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <div className="pt-6">
                    <KeyboardCustomizer />
                  </div>
                </AuthenticatedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/about"
            element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <AboutView />
                </AuthenticatedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/contact"
            element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <ContactView />
                </AuthenticatedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/terms"
            element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <TermsView />
                </AuthenticatedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <ShopView />
                </AuthenticatedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <CheckoutView />
                </AuthenticatedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment"
            element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <TngPaymentView />
                </AuthenticatedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment/tng"
            element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <TngPaymentView />
                </AuthenticatedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/track"
            element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <OrderTrackingView />
                </AuthenticatedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/track/:orderId"
            element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <OrderTrackingView />
                </AuthenticatedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/boss-admin"
            element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <BossAdminView />
                </AuthenticatedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <BossAdminView />
                </AuthenticatedLayout>
              </ProtectedRoute>
            }
          />

          {/* Catch-all fallback redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

// Export the required functional components for reusability
export { StepItem, SocialButton, InputGroup, PasswordInput };
