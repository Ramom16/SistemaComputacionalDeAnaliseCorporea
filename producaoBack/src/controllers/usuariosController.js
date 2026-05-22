import usuariosRepository from "../repositories/usuariosRepository.js";

const usuariosController = {
  selecionarUsuario: async (req, res) => {
    try {
      const id = req.query.id;
      if (id) {
        const resultado = await usuariosRepository.buscarPorId(id);
        if (!resultado) {
          return res.status(404).json({ erro: "Usuário não encontrado" });
        }
        return res.status(200).json(resultado);
      }
      const resultado = await usuariosRepository.listar();
      return res.status(200).json(resultado);
    } catch (error) {
      return res.status(500).json({ erro: error.message });
    }
  }
};

export default usuariosController;