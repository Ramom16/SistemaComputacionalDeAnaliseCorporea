import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/public/LandingPage';
import Login from './pages/auth/Login';
import Cadastro from './pages/auth/Cadastro';
import RecuperarSenha from './pages/auth/RecoverPages/RecuperarSenha';
import Verify from './pages/auth/Verify';
import Dashboard from './pages/dashboard/Dashboard';
import MeusTreinos from './pages/treinos/MeusTreinos';
import DetalhesTreinos from './pages/treinos/DetalhesTreinos';
import Evolucao from './pages/dashboard/Evolucao';
import Exercicios from './pages/treinos/Exercicios';
import CriarTreino from './pages/treinos/CreatePages/CriarTreino';
import Configuracoes from './pages/dashboard/Configuracoes';
import RedefinirSenha from './pages/auth/RecoverPages/RedefinirSenha';
import NaoEncontrado from './pages/public/NaoEncontrado';
import ProtectedRoute from './components/auth/ProtectedRoute';
import FeedbackProvider from './components/ui/FeedbackProvider';
import ErrorBoundary from './components/ui/ErrorBoundary';

function App() {
  return (
    <BrowserRouter>
      <FeedbackProvider>
        <ErrorBoundary>
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
              <Route path="/exercicios" element={<Exercicios />} />
              <Route path="/evolucao" element={<Evolucao />} />
              <Route path="/configuracoes" element={<Configuracoes />} />
            </Route>

            <Route element={<ProtectedRoute role="ADMIN" />}>
              <Route path="/admin/criar-treino" element={<CriarTreino />} />
              <Route path="/admin/editar-treino/:id" element={<CriarTreino />} />
            </Route>

            <Route path="*" element={<NaoEncontrado />} />
          </Routes>
        </ErrorBoundary>
      </FeedbackProvider>
    </BrowserRouter>
  );
}

export default App;
