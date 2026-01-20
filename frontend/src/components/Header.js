import React from 'react';
import { LogOut, User } from 'lucide-react';
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
        <img 
          src="/punjab-police-logo.png" 
          alt="Punjab Police" 
          className="header-logo"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
        <h1 className="header-title">Daily Open Court</h1>
      </div>
      <div className="header-right">
        <div className="user-info">
          <User size={20} />
          <div className="user-details">
            <span className="user-name">{user?.username}</span>
            <span className="user-role">{user?. role === 'DIG' ? 'DIG/Senior Officer' : 'Police Station Officer'}</span>
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