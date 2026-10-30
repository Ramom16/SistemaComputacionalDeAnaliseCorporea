import usuariosRepository from "../repositories/usuariosRepository.js";
import { anexarIdsCriptografados } from "../middlewares/tratarIdsCriptografados.js";
import { enviarEmaildeContaDesativada, enviarEmaildeContaReativada } from "../services/emailService.js";
import { notificarUsuario } from "../services/notificacaoService.js";
import { criptografarId } from "../utils/cryptoUtils.js";

const gerarUrlFotoPerfil = (req, usuarioId) => (
  `${req.protocol}://${req.get("host")}/usuarios/${encodeURIComponent(criptografarId(usuarioId))}/foto-perfil`
);

const incluirUrlFotoPerfil = (usuario, req) => {
  if (!usuario?.perfil?.fotoPerfilMimeType) return usuario;

  const fotoPerfil = gerarUrlFotoPerfil(req, usuario.id);
  return {
    ...usuario,
    fotoPerfil,
    perfil: { ...usuario.perfil, fotoPerfil }
  };
};

const usuariosController = {
  selecionarUsuario: async (req, res) => {
    try {
      const idSolicitado = req.query.id || req.params.id;
      const isAdm = req.usuario?.role === "ADMIN";

      if (idSolicitado) {
        // Proteção contra IDOR: se não for ADMIN e tentar acessar outro usuário
        if (!isAdm && req.usuario?.id && String(idSolicitado) !== String(req.usuario.id)) {
          return res.status(403).json({ erro: "Você não possui permissão para acessar dados deste usuário." });
        }

        const resultado = await usuariosRepository.buscarPorIdComDetalhes(String(idSolicitado));
        if (!resultado) {
          return res.status(404).json({ erro: "Usuário não encontrado" });
        }
        return res.status(200).json(anexarIdsCriptografados(incluirUrlFotoPerfil(resultado, req)));
      }

      // Se for ADMIN listando sem query.id, lista todos os usuários cadastrados
      if (isAdm) {
        const resultado = await usuariosRepository.listar();
        return res.status(200).json(anexarIdsCriptografados(resultado));
      }

      // Se for USER normal, retorna apenas seu próprio perfil
      const usuarioAtual = await usuariosRepository.buscarPorIdComDetalhes(String(req.usuario.id));
      const resultado = usuarioAtual ? [incluirUrlFotoPerfil(usuarioAtual, req)] : [];
      return res.status(200).json(anexarIdsCriptografados(resultado));
    } catch (error) {
      return res.status(500).json({ erro: error.message });
    }
  },

  /**
   * Desativa a conta do usuário autenticado.
   * Dados e histórico são preservados (soft delete).
   */
  desativarConta: async (req, res) => {
    try {
      const usuarioId = req.usuario?.id;

      if (!usuarioId) {
        return res.status(401).json({ erro: "Usuário não autenticado" });
      }

      // Desativa o usuário no banco de dados
      const usuarioDesativado = await usuariosRepository.desativar(usuarioId);

      // Dispara envio de e-mail de confirmação de desativação
      if (usuarioDesativado?.email) {
        try {
          await enviarEmaildeContaDesativada(usuarioDesativado.email, usuarioDesativado.nome);
        } catch (emailError) {
          console.error("Erro ao enviar e-mail de desativação de conta:", emailError);
        }
      }

      return res.status(200).json({
        msg: "Conta desativada com sucesso. Você será desconectado.",
        usuario_desativado: true
      });
    } catch (error) {
      console.error("Erro ao desativar conta:", error);
      return res.status(500).json({ erro: error.message });
    }
  },

  alterarRole: async (req, res) => {
    try {
      const idAlvo = req.params.id || req.body.id;
      const { role } = req.body;

      if (!idAlvo) {
        return res.status(400).json({ erro: "ID do usuário não fornecido." });
      }

      if (!role) {
        return res.status(400).json({ erro: "A nova role é obrigatória ('USER' ou 'ADMIN')." });
      }

      const roleNormalizada = String(role).toUpperCase().trim();
      if (roleNormalizada !== "ADMIN" && roleNormalizada !== "USER") {
        return res.status(400).json({ erro: "Role inválida. Deve ser 'USER' ou 'ADMIN'." });
      }

      const usuarioExiste = await usuariosRepository.buscarPorId(String(idAlvo));
      if (!usuarioExiste) {
        return res.status(404).json({ erro: "Usuário não encontrado." });
      }

      const usuarioAtualizado = await usuariosRepository.atualizarRole(String(idAlvo), roleNormalizada);

      return res.status(200).json({
        mensagem: `Papel do usuário atualizado para ${roleNormalizada} com sucesso.`,
        usuario: anexarIdsCriptografados({
          id: usuarioAtualizado.id,
          nome: usuarioAtualizado.nome,
          email: usuarioAtualizado.email,
          role: usuarioAtualizado.role
        })
      });
    } catch (error) {
      return res.status(400).json({ erro: error.message });
    }
  },

  /**
   * Funcionalidade: Atualiza a foto de perfil do usuário autenticado.
   * @param {Request} req 
   * @param {Response} res 
   * @returns Response com a mensagem de sucesso e os dados do usuário atualizado, incluindo a nova foto de perfil.
   * utiliza do id de usuário autenticado para atualizar a foto de perfil no banco de dados.
   * foto deve ser enviada no corpo da requisição (req.body.fotoPerfil).
   * 
   * Atualiza a foto de perfil do usuário autenticado.
   */
  atualizarFotoPerfil: async (req, res) => {
    try {
      const usuarioId = req.usuario?.id;

      if (!usuarioId)
        return res.status(401).json({ erro: "Usuário não autenticado" });

      if (!req.file)
        return res.status(400).json({ erro: "A foto de perfil é obrigatória." });

      const { buffer, mimetype } = req.file;
      const assinaturaValida = (
        (mimetype === "image/jpeg" && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff)
        || (mimetype === "image/png" && buffer.subarray(0, 8).equals(Buffer.from("89504e470d0a1a0a", "hex")))
        || (mimetype === "image/webp" && buffer.toString("ascii", 0, 4) === "RIFF"
          && buffer.toString("ascii", 8, 12) === "WEBP")
      );

      if (!assinaturaValida)
        return res.status(400).json({ erro: "O conteúdo do arquivo não corresponde a uma imagem PNG, JPEG ou WEBP válida." });

      const usuarioAtualizado = await usuariosRepository.atualizarFotoPerfil(usuarioId, buffer, mimetype);
      const fotoPerfil = gerarUrlFotoPerfil(req, usuarioId);

      return res.status(200).json({
        mensagem: "Foto de perfil atualizada com sucesso.",
        usuario: anexarIdsCriptografados({
          id: usuarioAtualizado.id,
          nome: usuarioAtualizado.nome,
          email: usuarioAtualizado.email,
          fotoPerfil
        })
      });
    } catch (error) {
      console.error("Erro ao atualizar foto de perfil:", error);
      return res.status(500).json({ erro: "Não foi possível salvar a foto de perfil." });
    }
  },

  enviarFotoPerfil: async (req, res) => {
    try {
      const foto = await usuariosRepository.buscarFotoPerfil(req.params.id);
      if (!foto?.fotoPerfilDados || !foto.fotoPerfilMimeType) {
        return res.status(404).json({ erro: "Foto de perfil não encontrada." });
      }

      res.set("Cache-Control", "no-cache");
      return res.type(foto.fotoPerfilMimeType).send(foto.fotoPerfilDados);
    } catch (error) {
      console.error("Erro ao buscar foto de perfil:", error);
      return res.status(500).json({ erro: "Não foi possível carregar a foto de perfil." });
    }
  }
};

// Admin: desativar usuário por id
usuariosController.desativarUsuarioPorId = async (req, res) => {
  try {
    const idAlvo = req.params.id;
    const isAdm = req.usuario?.role === 'ADMIN';
    if (!isAdm) return res.status(403).json({ erro: 'Permissão negada.' });
    const usuarioExiste = await usuariosRepository.buscarPorId(String(idAlvo));
    if (!usuarioExiste) return res.status(404).json({ erro: 'Usuário não encontrado.' });
    
    const usuarioDesativado = await usuariosRepository.desativar(String(idAlvo));

    if (usuarioDesativado?.email) {
      try {
        await enviarEmaildeContaDesativada(usuarioDesativado.email, usuarioDesativado.nome);
      } catch (emailError) {
        console.error("Erro ao enviar e-mail de desativação (Admin):", emailError);
      }
    }

    return res.status(200).json({ msg: 'Usuário desativado com sucesso.' });
  } catch (error) {
    return res.status(500).json({ erro: error.message });
  }
};

// Admin: reativar usuário por id
usuariosController.reativarUsuarioPorId = async (req, res) => {
  try {
    const idAlvo = req.params.id;
    const isAdm = req.usuario?.role === 'ADMIN';
    if (!isAdm) return res.status(403).json({ erro: 'Permissão negada.' });

    const usuarioExiste = await usuariosRepository.buscarPorId(String(idAlvo));
    if (!usuarioExiste) return res.status(404).json({ erro: 'Usuário não encontrado.' });

    if (usuarioExiste.ativo) {
      return res.status(400).json({ erro: 'A conta deste usuário já está ativa.' });
    }

    const usuarioReativado = await usuariosRepository.ativar(String(idAlvo));

    // Dispara e-mail de confirmação de reativação
    if (usuarioReativado?.email) {
      try {
        await enviarEmaildeContaReativada(usuarioReativado.email, usuarioReativado.nome);
      } catch (emailError) {
        console.error("Erro ao enviar e-mail de reativação (Admin):", emailError);
      }
    }

    return res.status(200).json({ msg: 'Usuário reativado com sucesso.' });
  } catch (error) {
    return res.status(500).json({ erro: error.message });
  }
};

// Salvar / atualizar Push Token e FCM Token da conta autenticada
usuariosController.salvarPushToken = async (req, res) => {
  try {
    const usuarioId = req.usuario?.id;
    if (!usuarioId) {
      return res.status(401).json({ erro: "Usuário não autenticado." });
    }

    const { pushToken, fcmToken } = req.body;

    if (pushToken === undefined && fcmToken === undefined) {
      return res.status(400).json({ erro: "Ao menos um token (pushToken ou fcmToken) deve ser fornecido." });
    }

    const usuarioAtualizado = await usuariosRepository.atualizarPushTokens(usuarioId, {
      pushToken,
      fcmToken,
    });

    return res.status(200).json({
      msg: "Tokens de notificação salvos com sucesso.",
      push_token: usuarioAtualizado.push_token,
      fcm_token: usuarioAtualizado.fcm_token,
    });
  } catch (error) {
    console.error("Erro ao salvar push token:", error);
    return res.status(500).json({ erro: error.message });
  }
};

// Testar envio de notificação para o usuário autenticado
usuariosController.testarNotificacao = async (req, res) => {
  try {
    const usuarioId = req.usuario?.id;
    const { titulo = "Treino IronFit 💪", mensagem = "Sua notificação de teste foi entregue com sucesso!" } = req.body || {};

    const resultado = await notificarUsuario(usuarioId, titulo, mensagem, { screen: "Treinos" });
    return res.status(200).json({ msg: "Disparo processado com sucesso.", resultado });
  } catch (error) {
    return res.status(500).json({ erro: error.message });
  }
};

export default usuariosController;