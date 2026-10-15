import { createContext, useContext } from 'react';

export const FeedbackContext = createContext(null);

/**
 * Acesso ao sistema de feedback (toasts + confirmação) disponibilizado
 * pelo <FeedbackProvider>. Deve ser usado dentro da árvore do provider.
 */
export function useFeedback() {
  const contexto = useContext(FeedbackContext);
  if (!contexto) {
    throw new Error('useFeedback deve ser usado dentro de <FeedbackProvider>.');
  }
  return contexto;
}
