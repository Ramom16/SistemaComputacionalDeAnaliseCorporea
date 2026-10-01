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
import Configuracoes from './pages/Configuracoes';
import RedefinirSenha from './pages/RedefinirSenha';
import ProtectedRoute from './components/ProtectedRoute';

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
          <Route path="/configuracoes" element={<Configuracoes />} />
        </Route>

        <Route element={<ProtectedRoute role="ADMIN" />}>
          <Route path="/admin/criar-treino" element={<CriarTreino />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
