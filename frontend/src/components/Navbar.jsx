import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-brand">
          Booksite - Booksantos
        </Link>
        </div>
      <ul className="navbar-nav">
        <li className={`navbar-item ${location.pathname === '/' ? 'active' : ''}`}>
          <Link to="/">Reservas</Link>
        </li>
        <li className={`navbar-item ${location.pathname === '/nova-reserva' ? 'active' : ''}`}>
          <Link to="/nova-reserva">Nova Reserva</Link>
        </li>
        <li className={`navbar-item ${location.pathname === '/dashboard' ? 'active' : ''}`}>
          <Link to="/dashboard">Dashboard</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;