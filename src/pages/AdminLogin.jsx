import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// use shared api instance that respects VITE_API_BASE_URL
import api from '../api';
import { useAuth } from '../AuthContext';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await api.post('/api/auth/login/', { username, password });
            login(res.data.token, res.data.username);
            navigate('/admin');
        } catch (err) {
            // display server-provided error if available
            const msg = err.response?.data?.error || 'Invalid username or password.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-login">
            <div className="glass-card login-card">
                <h2>Admin Portal</h2>
                <p className="subtitle">Authorized access only</p>

                {error && <div className="error-msg">{error}</div>}

                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label>Username</label>
                        <input
                            type="text"
                            className="form-control"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%', marginTop: '1rem' }}
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Secure Login'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
