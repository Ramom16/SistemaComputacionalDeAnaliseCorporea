import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import RecuperarSenha from './pages/RecuperarSenha';
import Verify from './pages/Verify';
import Dashboard from './pages/Dashboard';
import MeusTreinos from './pages/MeusTreinos';
import DetalhesTreinos from './pages/DetalhesTreinos';
import Evolucao from './pages/Evolucao';
import CriarTreino from './pages/CriarTreino';
import RedefinirSenha from './pages/RedefinirSenha';
import ProtectedRoute from './components/ProtectedRoute';

// Componente para proteger rotas ADMIN
function AdminRoute({ children }) {
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  if (usuario.role !== 'ADMIN') {
    return <Navigate to="/meus-treinos" replace />;
  }
  
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/recuperar-senha" element={<RecuperarSenha />} />
        <Route path="/redefinir-senha" element={<RedefinirSenha />} />
        <Route path="/verificar-email" element={<Verify />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/meus-treinos" element={<MeusTreinos />} />
          <Route path="/treino/:id" element={<DetalhesTreinos />} />
          <Route path="/evolucao" element={<Evolucao />} />
          <Route 
            path="/admin/criar-treino" 
            element={
              <AdminRoute>
                <CriarTreino />
              </AdminRoute>
            } 
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
