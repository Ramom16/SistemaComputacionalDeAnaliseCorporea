import treinoService from "../services/treinoService.js";
import { anexarIdsCriptografados } from "../middlewares/tratarIdsCriptografados.js";

const treinoController = {
  async criar(req, res) {
    try {
      const idUsuario = req.usuario.id;
      const roleUsuario = req.usuario.role;
      const { is_oficial, ...dadosTreino } = req.body;

      // Impede que alunos criem treinos oficiais da plataforma
      if (is_oficial && roleUsuario !== "ADMIN") {
        return res.status(403).json({
          error: "Apenas professores podem criar treinos oficiais para a plataforma."
        });
      }

      const treino = await treinoService.criar(idUsuario, {
        ...dadosTreino,
        is_oficial: roleUsuario === "ADMIN" ? Boolean(is_oficial) : false
      });

      return res.status(201).json({
        message: "Treino criado com sucesso.",
        data: treino
      });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

<<<<<<< HEAD
  async listar(req, res) {
    try {
      const idUsuario = req.usuario.id;
      // O service deve buscar treinos onde (idUsuario === idUsuario OR is_oficial === true)
      const treinos = await treinoService.listarPorUsuario(idUsuario);

      return res.status(200).json({ data: treinos });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },
=======
            const treino = await treinoService.criar(
                String(idUsuario),
                req.body
            );

            return res.status(201).json({
                message: "Treino criado com sucesso.",
                data: anexarIdsCriptografados(treino)
            });

        } catch (error) {

            return res.status(400).json({
                error: error.message
            });
        }
    },

    async listar(req, res) {

        try {

            const idUsuario = req.usuario.id;

            const treinos =
                await treinoService.listarPorUsuario(
                    String(idUsuario)
                );

            return res.status(200).json({
                data: anexarIdsCriptografados(treinos)
            });

        } catch (error) {

            return res.status(400).json({
                error: error.message
            });
        }
    },
>>>>>>> producaoBack

    async buscar(req, res) {

        try {

            const idUsuario = req.usuario.id;
            const idTreino = String(req.params.idTreino);

            const treino =
                await treinoService.buscarPorId(
                    String(idUsuario),
                    idTreino
                );

            return res.status(200).json({
                data: anexarIdsCriptografados(treino)
            });

        } catch (error) {

            return res.status(404).json({
                error: error.message
            });
        }
    },

    async atualizar(req, res) {

        try {

            const idUsuario = req.usuario.id;
            const idTreino = String(req.params.idTreino);

            const treino =
                await treinoService.atualizar(
                    String(idUsuario),
                    idTreino,
                    req.body
                );

            return res.status(200).json({
                message: "Treino atualizado com sucesso.",
                data: anexarIdsCriptografados(treino)
            });

        } catch (error) {

            return res.status(400).json({
                error: error.message
            });
        }
    },

    async deletar(req, res) {

        try {

            const idUsuario = req.usuario.id;
            const idTreino = String(req.params.idTreino);

            await treinoService.deletar(
                String(idUsuario),
                idTreino
            );

            return res.status(200).json({
                message: "Treino removido com sucesso."
            });

        } catch (error) {

            return res.status(400).json({
                error: error.message
            });
        }
    }
};

export default treinoController;