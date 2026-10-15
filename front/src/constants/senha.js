/**
 * Regras de força de senha partilhadas pelo Cadastro e pelas Configurações.
 * Cada regra tem um rótulo e um teste que devolve `true` quando é cumprida.
 */
export const REGRAS_SENHA = [
  { id: 'minimo', label: 'Mínimo de 6 carateres', testar: (senha) => senha.length >= 6 },
  { id: 'especial', label: 'Pelo menos um caractere especial (!@#$%...)', testar: (senha) => /[\W_]/.test(senha) },
  { id: 'numero', label: 'Pelo menos um número', testar: (senha) => /\d/.test(senha) },
];

export const senhaValida = (senha) => REGRAS_SENHA.every((regra) => regra.testar(senha));
