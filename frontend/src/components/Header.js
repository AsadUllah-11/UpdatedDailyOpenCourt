import React from 'react';
import { LogOut, User, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="app-header">
      <div className="header-left">
        {/* Logo with fallback */}
        <div className="header-logo-wrapper">
          <img 
            src="/punjab-police-logo.jpeg" 
            alt="Punjab Police" 
            className="header-logo"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div className="header-logo-fallback" style={{ display: 'none' }}>
            <Shield size={32} />
          </div>
        </div>
        <div className="header-text">
          <h1 className="header-title">Daily Open Court</h1>
          <p className="header-subtitle">Punjab Police</p>
        </div>
      </div>
      <div className="header-right">
        <div className="user-info">
          <User size={20} />
          <div className="user-details">
            <span className="user-name">{user?.username || 'admin'}</span>
            <span className="user-role">
              {user?.role === 'ADMIN' ? 'Police Station Officer' : 'Staff Member'}
            </span>
          </div>
        </div>
        <button onClick={handleLogout} className="logout-btn">
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;