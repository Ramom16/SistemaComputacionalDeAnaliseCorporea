import { FaCheck, FaTimes } from 'react-icons/fa';
import { REGRAS_SENHA } from '../constants/senha';

/**
 * Lista de critérios de senha em tempo real.
 * Cinzento enquanto não cumprido, verde quando cumprido.
 */
export default function PasswordChecklist({ senha, className = '' }) {
  return (
    <ul className={`senha-regras ${className}`.trim()}>
      {REGRAS_SENHA.map((regra) => {
        const cumprida = regra.testar(senha);
        return (
          <li key={regra.id} className={cumprida ? 'cumprida' : ''}>
            <span className="regra-icone">{cumprida ? <FaCheck /> : <FaTimes />}</span>
            <span>{regra.label}</span>
          </li>
        );
      })}
    </ul>
  );
}
