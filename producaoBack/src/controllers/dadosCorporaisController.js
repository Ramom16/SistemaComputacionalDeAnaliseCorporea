import { DadosCorporais } from "../models/DadosCorporais.js";
import DadosCorporaisRepository from "../repositories/dadosCorporaisRepository.js";

const DadosCorporaisController = {

    criar: async (req, res) => {
        try {

            const {
                idUsuario,
                peso_kg,
                altura_cm,
                genero,
                idade
            } = req.body;

            if (
                !idUsuario ||
                peso_kg === undefined ||
                altura_cm === undefined ||
                !genero ||
                idade === undefined
            ) {
                return res.status(400).json({
                    erro: "Todos os campos são obrigatórios"
                });
            }
            const dadosCorporais = DadosCorporais.criar({
                idUsuario,
                peso_kg,
                altura_cm,
                genero,
                idade
            });

            const resultado = await DadosCorporaisRepository.create(dadosCorporais);

            return res.status(201).json({
                mensagem: "Dados corporais cadastrados com sucesso",
                dados: resultado
            });

        } catch (error) {

            return res.status(400).json({
                erro: error.message
            });

        }
    },

    listar: async (req, res) => {
        try {

            const dados = await DadosCorporaisRepository.findAll();

            return res.status(200).json(dados);

        } catch (error) {

            return res.status(500).json({
                erro: error.message
            });

        }
    },

    buscarPorId: async (req, res) => {
        try {

            const { idDados } = req.params;

            const dados = await DadosCorporaisRepository.findById(Number(idDados));

            if (!dados) {
                return res.status(404).json({
                    erro: "Dados corporais não encontrados"
                });
            }

            return res.status(200).json(dados);

        } catch (error) {

            return res.status(500).json({
                erro: error.message
            });

        }
    },

    buscarPorUsuario: async (req, res) => {
        try {

            const { idUsuario } = req.params;

            const dados = await DadosCorporaisRepository.findByUsuario(Number(idUsuario));

            if (!dados) {
                return res.status(404).json({
                    erro: "Dados do usuário não encontrados"
                });
            }

            return res.status(200).json(dados);

        } catch (error) {

            return res.status(500).json({
                erro: error.message
            });

        }
    },

    atualizar: async (req, res) => {
        try {

            const { idUsuario } = req.params;

            const {
                peso_kg,
                altura_cm,
                genero,
                idade
            } = req.body;

            const dadosCorporais = DadosCorporais.editar({
                idUsuario: Number(idUsuario),
                peso_kg,
                altura_cm,
                genero,
                idade
            }, idUsuario);

            const resultado = await DadosCorporaisRepository.atualizarDados(
                Number(idUsuario),
                dadosCorporais
            );

            return res.status(200).json({
                mensagem: "Dados atualizados com sucesso",
                dados: resultado
            });

        } catch (error) {

            return res.status(400).json({
                erro: error.message
            });

        }
    },

    deletar: async (req, res) => {
        try {

            const { idUsuario } = req.params;

            const existe = await DadosCorporaisRepository.findByUsuario(
                Number(idUsuario)
            );

            if (!existe) {
                return res.status(404).json({
                    erro: "Dados não encontrados"
                });
            }

            await DadosCorporaisRepository.delete(Number(idUsuario));

            return res.status(200).json({
                mensagem: "Dados deletados com sucesso"
            });

        } catch (error) {

            return res.status(500).json({
                erro: error.message
            });

        }
    }

};

export default DadosCorporaisController;