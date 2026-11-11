import ReenviarEmail from './ReenviarEmail';

/**
 * "Esqueci-me da palavra-passe": pede o link de recuperação de senha.
 * Importante: usa /auth/solicitar-recuperacao e NÃO /auth/reenviar-email
 * (esse último é só para reenviar a verificação de e-mail e devolve 400
 * quando a conta já está verificada).
 */
export default function RecuperarSenha() {
  return (
    <ReenviarEmail
      titulo="Recuperar palavra-passe"
      endpoint="/auth/solicitar-recuperacao"
      rotuloBotao="Enviar link de recuperação"
      mensagemSucesso="Se o e-mail estiver cadastrado, você receberá o link de recuperação em breve."
    />
  );
}
