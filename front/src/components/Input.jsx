import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function Input({ label, id, type, placeholder, value, onChange, required = true }) {
  const [visivel, setVisivel] = useState(false);
  const ehSenha = type === 'password';
  const Icone = visivel ? FaEyeSlash : FaEye;

  return (
    <div className="form-group">
      <label htmlFor={id}>{label}</label>
      <div className="input-com-icone">
        <input
          type={ehSenha && visivel ? 'text' : type}
          id={id}
          placeholder={placeholder}
          required={required}
          value={value}
          onChange={onChange}
        />
        {ehSenha && (
          <button
            type="button"
            className="btn-ver-senha"
            onClick={() => setVisivel((v) => !v)}
            aria-label={visivel ? 'Ocultar senha' : 'Mostrar senha'}
          >
            <Icone />
          </button>
        )}
      </div>
    </div>
  );
}
