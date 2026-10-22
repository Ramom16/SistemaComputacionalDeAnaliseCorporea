import { Link } from 'react-router-dom';
import { getToken } from '../../services/auth';
import '../../styles/erro.css';

export default function NaoEncontrado() {
  const autenticado = Boolean(getToken());
  const destino = autenticado ? '/dashboard' : '/';

  return (
    <section className="nao-encontrado">
      <div>
        <p className="nao-encontrado-codigo">404</p>
        <h1 className="nao-encontrado-titulo">Página não encontrada</h1>
        <p className="nao-encontrado-texto">
          A página que procura não existe, foi movida ou o endereço está incorreto.
        </p>
        <div className="nao-encontrado-acoes">
          <Link className="btn-primario" to={destino}>
            {autenticado ? 'Ir para o painel' : 'Voltar ao início'}
          </Link>
          {autenticado && (
            <Link className="btn-secundario" to="/exercicios">Ver exercícios</Link>
          )}
        </div>
      </div>
    </section>
  );
}
