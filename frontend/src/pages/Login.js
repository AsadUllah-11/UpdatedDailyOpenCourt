import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, User } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(username, password);
    
    if (result. success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <img 
            src="/punjab-police-logo.png" 
            alt="Punjab Police" 
            className="login-logo"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <h1>Daily Open Court</h1>
          <p>Punjab Police Management System</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label>
              <User size={18} />
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
          </div>

          <div className="form-group">
            <label>
              <Lock size={18} />
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Logging in.. .' : 'Login'}
          </button>

          <div className="login-help">
            <p><strong>Demo Credentials:</strong></p>
            <p>DIG: <code>admin / 123</code></p>
            <p>PSO: <code>pso / 123</code></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;