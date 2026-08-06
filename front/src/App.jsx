import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import RecuperarSenha from './pages/RecuperarSenha';
import Verify from './pages/Verify';
import Dashboard from './pages/Dashboard';
import MeusTreinos from './pages/MeusTreinos';
import DetalhesTreinos from './pages/DetalhesTreinos';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/recuperar-senha" element={<RecuperarSenha />} />
        <Route path="/verificar-email" element={<Verify />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/meus-treinos" element={<MeusTreinos />} />
        <Route path="/treino/:id" element={<DetalhesTreinos />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
