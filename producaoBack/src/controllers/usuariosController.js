import usuariosRepository from "../repositories/usuariosRepository.js";
import { anexarIdsCriptografados } from "../middlewares/tratarIdsCriptografados.js";

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
        return res.status(200).json(anexarIdsCriptografados(resultado));
      }

      // Se for ADMIN listando sem query.id, lista todos os usuários cadastrados
      if (isAdm) {
        const resultado = await usuariosRepository.listar();
        return res.status(200).json(anexarIdsCriptografados(resultado));
      }

      // Se for USER normal, retorna apenas seu próprio perfil
      const usuarioAtual = await usuariosRepository.buscarPorIdComDetalhes(String(req.usuario.id));
      return res.status(200).json(anexarIdsCriptografados(usuarioAtual ? [usuarioAtual] : []));
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
      await usuariosRepository.desativar(usuarioId);

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
  }
};

export default usuariosController;