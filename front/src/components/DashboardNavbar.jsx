import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function DashboardNavbar({ onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    onLogout?.();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <header className="dashboard-navbar">
      {/* Logo - Lado Esquerdo */}
      <Link to="/" className="navbar-logo">
        <div className="logo-icon">
          <span className="logo-bar"></span>
          <span className="logo-bar"></span>
          <span className="logo-bar"></span>
        </div>
        <span className="logo-text">IRONFIT</span>
      </Link>

      {/* Links de Navegação - Centro */}
      <nav className="navbar-nav">
        <Link 
          to="/dashboard" 
          className={`nav-link ${isActive('/dashboard')}`}
        >
          Análise Corporal
        </Link>
        <Link 
          to="/meus-treinos" 
          className={`nav-link ${isActive('/meus-treinos')}`}
        >
          Meus Treinos
        </Link>
        <Link 
          to="/evolucao" 
          className={`nav-link ${isActive('/evolucao')}`}
        >
          Evolução
        </Link>
        <Link 
          to="#" 
          className="nav-link"
        >
          Configurações
        </Link>
      </nav>

      {/* Ação do Usuário - Lado Direito */}
      <button 
        onClick={handleLogout} 
        className="navbar-logout-btn"
      >
        Sair da Conta
      </button>
    </header>
  );
}
