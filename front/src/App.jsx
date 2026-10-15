import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import RecuperarSenha from './pages/RecoverPages/RecuperarSenha';
import Verify from './pages/Verify';
import Dashboard from './pages/Dashboard';
import MeusTreinos from './pages/MeusTreinos';
import DetalhesTreinos from './pages/DetalhesTreinos';
import Evolucao from './pages/Evolucao';
import Exercicios from './pages/Exercicios';
import CriarTreino from './pages/CreatePages/CriarTreino';
import Configuracoes from './pages/Configuracoes';
import RedefinirSenha from './pages/RecoverPages/RedefinirSenha';
import NaoEncontrado from './pages/NaoEncontrado';
import ProtectedRoute from './components/ProtectedRoute';
import FeedbackProvider from './components/FeedbackProvider';
import ErrorBoundary from './components/ErrorBoundary';

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
