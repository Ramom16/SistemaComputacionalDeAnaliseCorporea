import usuariosRepository from "../repositories/usuariosRepository.js";
import { anexarIdsCriptografados } from "../middlewares/tratarIdsCriptografados.js";

const usuariosController = {
  selecionarUsuario: async (req, res) => {
    try {
      const idSolicitado = req.query.id || req.usuario?.id;

      if (idSolicitado) {
        // Proteção contra IDOR: verifica se o usuário autenticado está requisitando seu próprio perfil
        if (req.usuario?.id && idSolicitado !== req.usuario.id) {
          return res.status(403).json({ erro: "Você não possui permissão para acessar dados deste usuário." });
        }

        const resultado = await usuariosRepository.buscarPorIdComDetalhes(String(idSolicitado));
        if (!resultado) {
          return res.status(404).json({ erro: "Usuário não encontrado" });
        }
        return res.status(200).json(anexarIdsCriptografados(resultado));
      }

      // Se for listar todos, apenas se tiver permissão administrativa ou retorna seu próprio usuário
      if (req.usuario?.id) {
        const usuarioAtual = await usuariosRepository.buscarPorIdComDetalhes(String(req.usuario.id));
        return res.status(200).json(anexarIdsCriptografados(usuarioAtual ? [usuarioAtual] : []));
      }

      const resultado = await usuariosRepository.listar();
      return res.status(200).json(anexarIdsCriptografados(resultado));
    } catch (error) {
      return res.status(500).json({ erro: error.message });
    }
  }
};

export default usuariosController;