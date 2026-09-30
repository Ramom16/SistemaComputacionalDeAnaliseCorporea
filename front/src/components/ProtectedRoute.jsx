import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { getToken, getUsuario } from '../services/auth';

export default function ProtectedRoute({ role }) {
  const location = useLocation();

  if (!getToken()) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (role && getUsuario().role !== role) {
    // Mantem o destino do antigo AdminRoute para nao alterar o fluxo do usuario.
    return <Navigate to="/meus-treinos" replace />;
  }

  return <Outlet />;
}
