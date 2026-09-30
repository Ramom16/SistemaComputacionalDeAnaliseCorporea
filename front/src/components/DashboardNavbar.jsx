import { NavLink, useNavigate } from 'react-router-dom';
import { limparSessao } from '../services/auth';

const LINKS = [
  ['/dashboard', 'Análise Corporal'],
  ['/meus-treinos', 'Meus Treinos'],
  ['/exercicios', 'Exercícios'],
  ['/evolucao', 'Evolução'],
  ['/configuracoes', 'Configurações'],
];

export default function DashboardNavbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    limparSessao();
    navigate('/login', { replace: true });
  };

  return (
    <header className="dashboard-navbar">
      <NavLink to="/dashboard" className="navbar-logo">
        <div className="logo-icon">
          <span className="logo-bar"></span>
          <span className="logo-bar"></span>
          <span className="logo-bar"></span>
        </div>
        <span className="logo-text">IRONFIT</span>
      </NavLink>

      <nav className="navbar-nav">
        {LINKS.map(([to, label]) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            {label}
          </NavLink>
        ))}
      </nav>

      <button onClick={handleLogout} className="navbar-logout-btn">
        Sair da Conta
      </button>
    </header>
  );
}
