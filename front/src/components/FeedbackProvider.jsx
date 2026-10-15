import { useCallback, useMemo, useRef, useState } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle } from 'react-icons/fa';
import { FeedbackContext } from '../hooks/useFeedback';
import '../styles/feedback.css';

const ICONES = {
  sucesso: <FaCheckCircle />,
  erro: <FaExclamationCircle />,
  info: <FaInfoCircle />,
};

const DURACAO_TOAST = 4500;

/**
 * Disponibiliza `toast` (mensagens) e `confirmar` (diálogo modal baseado em
 * Promise) a toda a aplicação, substituindo window.alert / window.confirm.
 */
export default function FeedbackProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [dialogo, setDialogo] = useState(null);
  const proximoId = useRef(0);

  const removerToast = useCallback((id) => {
    setToasts((atuais) => atuais.filter((t) => t.id !== id));
  }, []);

  const mostrarToast = useCallback((texto, tipo) => {
    if (!texto) return;
    const id = proximoId.current;
    proximoId.current += 1;
    setToasts((atuais) => [...atuais, { id, texto, tipo }]);
    window.setTimeout(() => removerToast(id), DURACAO_TOAST);
  }, [removerToast]);

  const toast = useMemo(() => ({
    sucesso: (texto) => mostrarToast(texto, 'sucesso'),
    erro: (texto) => mostrarToast(texto, 'erro'),
    info: (texto) => mostrarToast(texto, 'info'),
  }), [mostrarToast]);

  const confirmar = useCallback((opcoes = {}) => new Promise((resolve) => {
    setDialogo({
      titulo: opcoes.titulo || 'Confirmar ação',
      mensagem: opcoes.mensagem || '',
      textoConfirmar: opcoes.textoConfirmar || 'Confirmar',
      textoCancelar: opcoes.textoCancelar || 'Cancelar',
      perigoso: Boolean(opcoes.perigoso),
      resolve,
    });
  }), []);

  const responder = useCallback((resultado) => {
    setDialogo((atual) => {
      atual?.resolve(resultado);
      return null;
    });
  }, []);

  const valor = useMemo(() => ({ toast, confirmar }), [toast, confirmar]);

  return (
    <FeedbackContext.Provider value={valor}>
      {children}

      <div className="toast-container" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast-${t.tipo}`} role="status">
            <span className="toast-icone">{ICONES[t.tipo]}</span>
            <span className="toast-texto">{t.texto}</span>
            <button
              type="button"
              className="toast-fechar"
              onClick={() => removerToast(t.id)}
              aria-label="Fechar notificação"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {dialogo && (
        <div
          className="confirm-overlay"
          role="presentation"
          onMouseDown={() => responder(false)}
        >
          <div
            className="confirm-dialogo"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-titulo"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <h2 id="confirm-titulo" className="confirm-titulo">{dialogo.titulo}</h2>
            {dialogo.mensagem && <p className="confirm-mensagem">{dialogo.mensagem}</p>}

            <div className="confirm-acoes">
              <button
                type="button"
                className="btn-confirmar-cancelar"
                onClick={() => responder(false)}
              >
                {dialogo.textoCancelar}
              </button>
              <button
                type="button"
                className={`btn-confirmar-ok${dialogo.perigoso ? ' perigoso' : ''}`}
                onClick={() => responder(true)}
              >
                {dialogo.textoConfirmar}
              </button>
            </div>
          </div>
        </div>
      )}
    </FeedbackContext.Provider>
  );
}
