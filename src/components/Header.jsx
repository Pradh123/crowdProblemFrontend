import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Header() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold">CrowdSolve</Link>
      <div>
        {user ? (
          <>
            <Link to="/dashboard" className="mr-4">Dashboard</Link>
            {user.role === 'admin' && <Link to="/admin" className="mr-4">Admin</Link>}
            <Link to="/profile" className="mr-4">Profile</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </header>
  );
}

export default Header;