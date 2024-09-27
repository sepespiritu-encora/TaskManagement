import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ isLoggedIn, handleLogout, username, setIsLoggedIn, setUsername }) => {
  const navigate = useNavigate();

  const navStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px',
    backgroundColor: '#333',
    color: '#fff',
  };

  const ulStyle = {
    listStyleType: 'none',
    display: 'flex',
    margin: 0,
    padding: 0,
  };

  const liStyle = {
    margin: '0 10px',
  };

  const linkStyle = {
    color: '#fff',
    textDecoration: 'none',
  };

  const handleLogoutClick = () => {
    handleLogout();
    navigate('/');
  };

  return (
    <nav style={navStyle}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <h3>Task Management</h3>
      </div>
      {isLoggedIn && (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ marginRight: '10px' }}>Welcome, {username}</span>
          <button onClick={handleLogoutClick} style={{ backgroundColor: '#555', color: '#fff', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>Logout</button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;