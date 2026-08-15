import usuariosRepository from "../repositories/usuariosRepository.js";
import emailTokenRepository from "../repositories/emailTokenRepository.js";
import passwordResetTokenRepository from "../repositories/passwordResetTokenRepository.js";

import { gerarHashSenha, compararSenha } from "../utils/senhaHash.js";
import { gerarTokenLogin } from "../utils/gerarTokens.js";
import { gerarTokenAleatorio, gerarHashSHA256 } from "../utils/tokenUtils.js";

import { enviarEmailVerificacao, enviarEmailRecuperacaoSenha } from "../services/emailService.js";
import { Usuario } from "../models/Usuarios.js";
import { envTokenExpiraMinutos } from "../config/env.js";

const conversorMinutos = 60 * 1000;

const authController = {
  /**
   * Registra um novo usuário, gera token de verificação e envia o e-mail.
   */
  criar: async (req, res) => {
    try {
      const { nome, email, senha, data_nascimento } = req.body;

      if (!senha || senha.trim() === "") {
        return res.status(400).json({ erro: "Adicione uma senha válida" });
      }

      if (!nome || !email || !data_nascimento) {
        return res.status(400).json({ erro: "Nome, e-mail e data de nascimento são obrigatórios" });
      }

      const emailFormatado = email.trim().toLowerCase();
      const existe = await usuariosRepository.buscarPorEmail(emailFormatado);

      if (existe) {
        return res.status(400).json({ erro: "E-mail já cadastrado" });
      }

      const senha_hash = await gerarHashSenha(senha);

      const usuarioObj = Usuario.criar({
        nome,
        email: emailFormatado,
        senha_hash,
        data_nascimento
      });

      const novoUsuario = await usuariosRepository.criar(usuarioObj);

      // Limpa tokens antigos
      await emailTokenRepository.deletarPorUsuario(novoUsuario.id);

      // Gera token bruto aleatório e seu hash SHA-256 (64 chars)
      const tokenBruto = gerarTokenAleatorio();
      const tokenHash = gerarHashSHA256(tokenBruto);

      const minutosValidade = envTokenExpiraMinutos.ValidadeTokenMinutos || 15;
      const expira_em = new Date(Date.now() + minutosValidade * conversorMinutos);

      await emailTokenRepository.criar(novoUsuario.id, tokenHash, expira_em);

      const link = `${process.env.FRONT_URL || "http://localhost:5173"}/verificar-email?token=${tokenBruto}`;
      await enviarEmailVerificacao(novoUsuario.email, link);

      return res.status(201).json({
        msg: "Usuário criado com sucesso! Verifique seu e-mail para ativar a conta."
      });
    } catch (error) {
      console.error("Erro no cadastro:", error);
      return res.status(400).json({ erro: error.message });
    }
  },

  /**
   * Autentica o usuário com verificação de bloqueio por força bruta e ativação de e-mail.
   */
  login: async (req, res) => {
    try {
      const { email, senha } = req.body;

      if (!email || !senha) {
        return res.status(400).json({ erro: "E-mail e senha são obrigatórios" });
      }

      const usuario = await usuariosRepository.buscarPorEmail(email.trim().toLowerCase());

      if (!usuario) {
        return res.status(401).json({ erro: "Credenciais inválidas" });
      }

      // 1. Verifica se a conta está desativada
      if (!usuario.ativo) {
        return res.status(403).json({ erro: "Conta desativada. Entre em contato com o suporte." });
      }

      // 2. Verifica se a conta está temporariamente bloqueada por tentativas mal-sucedidas
      if (usuario.bloqueado_ate && new Date(usuario.bloqueado_ate) > new Date()) {
        const minutosRestantes = Math.ceil((new Date(usuario.bloqueado_ate) - new Date()) / conversorMinutos);
        return res.status(429).json({
          erro: `Conta temporariamente bloqueada devido a múltiplas tentativas incorretas. Tente novamente em ${minutosRestantes} minuto(s).`
        });
      }

      // 3. Verifica confirmação de e-mail
      if (!usuario.email_verificado) {
        return res.status(403).json({ erro: "E-mail não verificado. Por favor, confirme seu e-mail antes de fazer login." });
      }

      // 4. Valida a senha
      const senhaValida = await compararSenha(senha, usuario.senha_hash);

      if (!senhaValida) {
        // Incrementar contagem de falhas
        const usuarioAtualizado = await usuariosRepository.incrementarTentativasLogin(
          usuario.id,
          usuario.tentativas_login
        );

        if (usuarioAtualizado.bloqueado_ate) {
          return res.status(429).json({
            erro: "Número máximo de tentativas excedido. Sua conta foi bloqueada por 15 minutos."
          });
        }

        return res.status(401).json({ erro: "Credenciais inválidas" });
      }

      // 5. Sucesso - atualiza último login e reseta contadores de falhas
      await usuariosRepository.atualizarUltimoLogin(usuario.id);

      const token = gerarTokenLogin(usuario);

      return res.status(200).json({
        msg: "Login realizado com sucesso",
        token,
        usuario: {
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email
        }
      });
    } catch (error) {
      console.error("Erro no login:", error);
      return res.status(400).json({ erro: error.message });
    }
  },

  /**
   * Confirma o e-mail do usuário via token.
   */
  verificarEmail: async (req, res) => {
    try {
      const tokenBruto = req.query.token || req.body.token;

      if (!tokenBruto) {
        return res.status(400).json({ erro: "Token de verificação não fornecido" });
      }

      const tokenHash = gerarHashSHA256(tokenBruto);
      const tokenEncontrado = await emailTokenRepository.buscarPorTokenHash(tokenHash);

      if (!tokenEncontrado) {
        return res.status(400).json({ erro: "Token inválido ou já utilizado" });
      }

      if (tokenEncontrado.usado_em) {
        return res.status(400).json({ erro: "Este token de verificação já foi utilizado" });
      }

      if (new Date(tokenEncontrado.expira_em) < new Date()) {
        return res.status(400).json({ erro: "Token expirado. Solicite um novo e-mail de verificação." });
      }

      // Ativa o e-mail do usuário
      await usuariosRepository.verificarEmail(tokenEncontrado.usuarioId);

      // Marcar token como utilizado
      await emailTokenRepository.marcarComoUsado(tokenEncontrado.id);

      return res.status(200).json({ msg: "E-mail verificado com sucesso! Você já pode fazer login." });
    } catch (error) {
      console.error("Erro na verificação de e-mail:", error);
      return res.status(400).json({ erro: error.message });
    }
  },

  /**
   * Reenvia o e-mail de verificação para o usuário.
   */
  reenviarEmail: async (req, res) => {
    try {
      const { email } = req.body;

      if (!email || typeof email !== "string" || email.trim() === "") {
        return res.status(400).json({ erro: "Informe um e-mail válido" });
      }

      const usuario = await usuariosRepository.buscarPorEmail(email.trim().toLowerCase());

      // Retorno genérico de segurança para evitar enumeração de contas
      if (!usuario) {
        return res.status(200).json({
          msg: "Se o e-mail estiver cadastrado e pendente de verificação, enviaremos um novo link."
        });
      }

      if (usuario.email_verificado) {
        return res.status(400).json({ erro: "Este e-mail já está verificado." });
      }

      await emailTokenRepository.deletarPorUsuario(usuario.id);

      const tokenBruto = gerarTokenAleatorio();
      const tokenHash = gerarHashSHA256(tokenBruto);

      const minutosValidade = envTokenExpiraMinutos.ValidadeTokenMinutos || 15;
      const expira_em = new Date(Date.now() + minutosValidade * conversorMinutos);

      await emailTokenRepository.criar(usuario.id, tokenHash, expira_em);

      const link = `${process.env.FRONT_URL || "http://localhost:5173"}/verificar-email?token=${tokenBruto}`;
      await enviarEmailVerificacao(usuario.email, link);

      return res.status(200).json({
        msg: "Novo link de verificação enviado para o seu e-mail."
      });
    } catch (error) {
      console.error("Erro ao reenviar e-mail:", error);
      return res.status(400).json({ erro: error.message });
    }
  },

  /**
   * Solicita a recuperação de senha enviando um e-mail com token.
   */
  solicitarRecuperacaoSenha: async (req, res) => {
    try {
      const { email } = req.body;

      if (!email || email.trim() === "") {
        return res.status(400).json({ erro: "Informe o seu e-mail" });
      }

      const usuario = await usuariosRepository.buscarPorEmail(email.trim().toLowerCase());

      // Retorno padrão por privacidade
      if (!usuario) {
        return res.status(200).json({
          msg: "Se o e-mail estiver cadastrado em nosso sistema, você receberá o link de recuperação em breve."
        });
      }

      // Limpa tokens de redefinição anteriores do usuário
      await passwordResetTokenRepository.deletarPorUsuario(usuario.id);

      const tokenBruto = gerarTokenAleatorio();
      const tokenHash = gerarHashSHA256(tokenBruto);
      const expira_em = new Date(Date.now() + 60 * conversorMinutos); // Válido por 1 hora

      await passwordResetTokenRepository.criar(usuario.id, tokenHash, expira_em);

      const link = `${process.env.FRONT_URL || "http://localhost:5173"}/redefinir-senha?token=${tokenBruto}`;
      await enviarEmailRecuperacaoSenha(usuario.email, link);

      return res.status(200).json({
        msg: "Se o e-mail estiver cadastrado em nosso sistema, você receberá o link de recuperação em breve."
      });
    } catch (error) {
      console.error("Erro na solicitação de recuperação de senha:", error);
      return res.status(400).json({ erro: error.message });
    }
  },

  /**
   * Redefine a senha do usuário através do token recebido por e-mail.
   */
  redefinirSenha: async (req, res) => {
    try {
      const { token, novaSenha } = req.body;

      if (!token || !novaSenha) {
        return res.status(400).json({ erro: "Token e nova senha são obrigatórios" });
      }

      if (novaSenha.length < 6) {
        return res.status(400).json({ erro: "A nova senha deve ter no mínimo 6 caracteres" });
      }

      const tokenHash = gerarHashSHA256(token);
      const tokenEncontrado = await passwordResetTokenRepository.buscarPorTokenHash(tokenHash);

      if (!tokenEncontrado) {
        return res.status(400).json({ erro: "Token de redefinição inválido ou não encontrado" });
      }

      if (tokenEncontrado.usado_em) {
        return res.status(400).json({ erro: "Este link de redefinição já foi utilizado" });
      }

      if (new Date(tokenEncontrado.expira_em) < new Date()) {
        return res.status(400).json({ erro: "Token expirado. Por favor, solicite uma nova redefinição." });
      }

      const novaSenhaHash = await gerarHashSenha(novaSenha);
      await usuariosRepository.atualizarSenha(tokenEncontrado.usuarioId, novaSenhaHash);

      await passwordResetTokenRepository.marcarComoUsado(tokenEncontrado.id);

      return res.status(200).json({ msg: "Senha alterada com sucesso! Você já pode realizar o login." });
    } catch (error) {
      console.error("Erro ao redefinir senha:", error);
      return res.status(400).json({ erro: error.message });
    }
  },

  /**
   * Retorna os detalhes completos do usuário autenticado.
   */
  me: async (req, res) => {
    try {
      const usuarioId = req.usuario?.id;

      if (!usuarioId) {
        return res.status(401).json({ erro: "Usuário não autenticado" });
      }

      const usuarioDetalhes = await usuariosRepository.buscarPorIdComDetalhes(usuarioId);

      if (!usuarioDetalhes) {
        return res.status(404).json({ erro: "Usuário não encontrado" });
      }

      return res.status(200).json({ usuario: usuarioDetalhes });
    } catch (error) {
      console.error("Erro ao buscar detalhes do usuário logado:", error);
      return res.status(500).json({ erro: error.message });
    }
  },

  /**
   * Permite ao usuário autenticado alterar sua senha.
   */
  alterarSenha: async (req, res) => {
    try {
      const usuarioId = req.usuario?.id;
      const { senhaAtual, novaSenha } = req.body;

      if (!usuarioId) {
        return res.status(401).json({ erro: "Usuário não autenticado" });
      }

      if (!senhaAtual || !novaSenha) {
        return res.status(400).json({ erro: "Senha atual e nova senha são obrigatórias" });
      }

      if (novaSenha.length < 6) {
        return res.status(400).json({ erro: "A nova senha deve ter no mínimo 6 caracteres" });
      }

      const usuario = await usuariosRepository.buscarPorId(usuarioId);
      if (!usuario) {
        return res.status(404).json({ erro: "Usuário não encontrado" });
      }

      const senhaValida = await compararSenha(senhaAtual, usuario.senha_hash);
      if (!senhaValida) {
        return res.status(400).json({ erro: "Senha atual incorreta" });
      }

      const novaSenhaHash = await gerarHashSenha(novaSenha);
      await usuariosRepository.atualizarSenha(usuarioId, novaSenhaHash);

      return res.status(200).json({ msg: "Senha atualizada com sucesso!" });
    } catch (error) {
      console.error("Erro ao alterar senha:", error);
      return res.status(400).json({ erro: error.message });
    }
  }
};

export default authController;