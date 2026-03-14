import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import TimeoutCallButton from './components/TimeoutCallButton';
import LoadingScreen from './components/LoadingScreen';

// Pages - Lazy Loaded
const Home = lazy(() => import('./pages/Home'));
const Products = lazy(() => import('./pages/Products'));
const Contact = lazy(() => import('./pages/Contact'));

// Admin Pages - Lazy Loaded
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));
const AdminOrders = lazy(() => import('./pages/AdminOrders'));
const AdminProducts = lazy(() => import('./pages/AdminProducts'));
const AdminGallery = lazy(() => import('./pages/AdminGallery'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    if (!isAuthenticated) return <Navigate to="/admin-login" replace />;
    return children;
};

// Main Layout (Navbar + Footer) for public pages
const PublicLayout = ({ children }) => (
    <>
        <Navbar />
        {children}
        <Footer />

        {/* floating contact buttons for mobile */}
        <div className="mobile-contact-buttons">
            <Link to="/" className="home-icon" aria-label="Go to Home">🏠</Link>
            <a href="tel:+917897391004" className="mobile-icon" aria-label="Call us">📞</a>
            <a href="https://wa.me/917897391004" className="mobile-icon" aria-label="WhatsApp us" target="_blank" rel="noopener noreferrer">💬</a>
        </div>
        
        <TimeoutCallButton />
    </>
);

function App() {
    return (
        <AuthProvider>
            <Router>
                <Suspense fallback={<LoadingScreen fullScreen />}>
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
                        <Route path="/products" element={<PublicLayout><Products /></PublicLayout>} />
                        {/* gallery page removed; images shown on home */}
                        <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />

                        {/* Admin Login (No Navbar/Footer) */}
                        <Route path="/admin-login" element={<AdminLogin />} />

                        {/* Protected Admin Routes */}
                        <Route path="/admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>}>
                            <Route index element={<AdminDashboard />} />
                            <Route path="orders" element={<AdminOrders />} />
                            <Route path="products" element={<AdminProducts />} />
                            <Route path="gallery" element={<AdminGallery />} />
                        </Route>

                        {/* Fallback */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </Suspense>
            </Router>
        </AuthProvider>
    );
}

export default App;
