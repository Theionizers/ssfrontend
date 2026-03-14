import React, { lazy, Suspense, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import api from './api';

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
        
        <button 
            className="mobile-icon" 
            style={{ 
                position: 'fixed', 
                bottom: '100px', 
                right: '25px', 
                background: 'var(--primary)', 
                color: 'white', 
                border: 'none', 
                width: '50px', 
                height: '50px', 
                borderRadius: '50%', 
                fontSize: '1.5rem', 
                boxShadow: '0 4px 15px rgba(255,107,53,0.3)',
                zIndex: 1000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
            }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
            ↑
        </button>

        <TimeoutCallButton />
    </>
);

function App() {
    const [isBackendReady, setIsBackendReady] = useState(false);

    useEffect(() => {
        // Ping the backend to wake it up (Render cold start)
        const wakeBackend = async () => {
            try {
                // Try to load products as the "health check"
                await api.get('/api/products/');
                setIsBackendReady(true);
            } catch (error) {
                console.error("Backend wake-up ping failed:", error);
                // Even if it fails, we should probably let the app load after a timeout
                // but for now, we wait for a response.
                // If it's a 4xx/5xx, it still means the backend is "up" enough to respond.
                setIsBackendReady(true);
            }
        };

        wakeBackend();
    }, []);

    if (!isBackendReady) {
        return <LoadingScreen fullScreen />;
    }

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
