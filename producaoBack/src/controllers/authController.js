import usuariosRepository from "../repositories/usuariosRepository.js";
import emailTokenRepository from "../repositories/emailTokenRepository.js";

import { gerarHashSenha, compararSenha } from "../utils/senhaHash.js";
import { gerarEmailTokenJWT, gerarTokenLogin } from "../utils/gerarTokens.js";

import { enviarEmailVerificacao } from "../services/emailService.js";

import { Usuario } from "../models/Usuarios.js";

import { envTokenExpiraMinutos } from "../config/env.js";
/**
 * Controlador de autenticação e verificação de email.
 */
const authController = {
  /**
   * Cria um usuário, gera token de verificação e envia e-mail.
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  criar: async (req, res) => {
    try {

      const { nome, email, senha, data_nascimento } = req.body;

      // validações básicas
      if (!senha || senha.trim() === "") {
        return res.status(400).json({
          erro: "Adicione uma senha válida"
        });
      }

      if (!nome || !email || !data_nascimento) {
        return res.status(400).json({
          erro: "Nome, email e data de nascimento são obrigatórios"
        });
      }

      // verifica email existente
      const existe = await usuariosRepository.buscarPorEmail(
        email.trim().toLowerCase()
      );

      if (existe) {
        return res.status(400).json({
          erro: "Email já cadastrado"
        });
      }

      // gera hash
      const senha_hash = await gerarHashSenha(senha);

      // cria objeto usuário
      const usuario = Usuario.criar({
        nome,
        email: email.trim().toLowerCase(),
        senha_hash,
        data_nascimento
      });

      // salva usuário
      const novoUsuario = await usuariosRepository.criar(usuario);

      // remove tokens antigos
      await emailTokenRepository.deletarPorUsuario(
        novoUsuario.id
      );

      // gera token
      const token = gerarEmailTokenJWT(
        novoUsuario.id
      );

      // calcula expiração
      const conversorMinutos = 60 * 1000;

      const expira_em = new Date(
        Date.now() +
        envTokenExpiraMinutos.ValidadeTokenMinutos *
        conversorMinutos
      );

      // DEBUG (opcional)
      console.log("Tempo token:",
        envTokenExpiraMinutos.ValidadeTokenMinutos
      );

      console.log("Data expiração:",
        expira_em
      );

      // salva token
      await emailTokenRepository.criar(
        novoUsuario.id,
        token,
        expira_em
      );

      // gera link
      const link =
        `${process.env.FRONT_URL}?token=${token}`;

      // envia email
      await enviarEmailVerificacao(
        novoUsuario.email,
        link
      );

      return res.status(201).json({
        msg: "Usuário criado! Verifique seu email para ativar a conta."
      });

    } catch (error) {

      console.error(error);

      return res.status(400).json({
        erro: error.message
      });
    }
  },

  /**
   * Login do usuário.
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  login: async (req, res) => {
    try {

      const { email, senha } = req.body;

      if (!email || !senha) {
        return res.status(400).json({
          erro: "Email e senha são obrigatórios"
        });
      }

      const usuario =
        await usuariosRepository.buscarPorEmail(
          email.trim().toLowerCase()
        );

      if (!usuario) {
        return res.status(401).json({
          erro: "Credenciais inválidas"
        });
      }

      if (!usuario.ativo) {
        return res.status(403).json({
          erro: "Conta desativada. Entre em contato com o administrador."
        });
      }

      if (!usuario.email_verificado) {
        return res.status(403).json({
          erro: "Email não verificado. Verifique seu email primeiro."
        });
      }

      const senhaValida =
        await compararSenha(
          senha,
          usuario.senha_hash
        );

      if (!senhaValida) {
        return res.status(401).json({
          erro: "Credenciais inválidas"
        });
      }

      // atualiza último login
      await usuariosRepository.atualizarUltimoLogin(
        usuario.id
      );

      // gera token login
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

      console.error(error);

      return res.status(400).json({
        erro: error.message
      });
    }
  },

  /**
   * Verifica email.
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  verificarEmail: async (req, res) => {
    try {

      const { token } = req.query;

      if (!token) {
        return res.status(400).json({
          erro: "Token não informado"
        });
      }

      const tokenEncontrado =
        await emailTokenRepository.buscarPorToken(
          token
        );

      if (!tokenEncontrado) {
        return res.status(400).json({
          erro: "Token inválido ou já utilizado"
        });
      }

      // verifica expiração
      if (
        new Date(tokenEncontrado.expira_em)
        < new Date()
      ) {

        // remove tokens
        await emailTokenRepository.deletarPorUsuario(
          tokenEncontrado.usuarioId
        );

        // remove usuário não verificado
        await usuariosRepository.deletar(
          tokenEncontrado.usuarioId
        );

        return res.status(400).json({
          erro: "Token expirado. Usuário removido."
        });
      }

      // verifica email
      await usuariosRepository.verificarEmail(
        tokenEncontrado.usuarioId
      );

      // remove token usado
      await emailTokenRepository.deletar(
        tokenEncontrado.id
      );

      return res.status(200).json({
        msg: "Email verificado com sucesso!"
      });

    } catch (error) {

      console.error(error);

      return res.status(400).json({
        erro: error.message
      });
    }
  },

  /**
   * Reenvia email de verificação.
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  reenviarEmail: async (req, res) => {
    try {

      const { email } = req.body;

      if (
        !email ||
        typeof email !== "string" ||
        email.trim() === ""
      ) {
        return res.status(400).json({
          erro: "Informe o email"
        });
      }

      const usuario =
        await usuariosRepository.buscarPorEmail(
          email.trim().toLowerCase()
        );

      // evita enumeração de emails
      if (!usuario) {
        return res.status(200).json({
          msg: "Se o email existir, enviaremos um novo link de verificação."
        });
      }

      // remove tokens antigos
      await emailTokenRepository.deletarPorUsuario(
        usuario.id
      );

      // gera novo token
      const token =
        gerarEmailTokenJWT(usuario.id);

      // nova expiração
      const conversorMinutos = 60 * 1000;

      const expira_em = new Date(
        Date.now() +
        envTokenExpiraMinutos.ValidadeTokenMinutos *
        conversorMinutos
      );

      // salva token
      await emailTokenRepository.criar(
        usuario.id,
        token,
        expira_em
      );

      // link
      const link =
        `${process.env.FRONT_URL}?token=${token}`;

      // envia email
      await enviarEmailVerificacao(
        usuario.email,
        link
      );

      return res.status(200).json({
        msg: "Novo link de verificação enviado para seu email."
      });

    } catch (error) {

      console.error(error);

      return res.status(400).json({
        erro: error.message
      });
    }
  }
};

export default authController;