import { DadosCorporais } from "../models/DadosCorporais.js";
import DadosCorporaisService from "../services/dadosCorporaisService.js";
import DadosCorporaisRepository from "../repositories/dadosCorporaisRepository.js";

const DadosCorporaisController = {

    criar: async (req, res) => {
        try {
            const idUsuario = req.usuario?.id || Number(req.body.idUsuario);
            const { peso_kg, altura_cm, genero, idade, nivel_atividade } = req.body;

            DadosCorporais.criar({
                idUsuario: Number(idUsuario),
                peso_kg: Number(peso_kg),
                altura_cm: Number(altura_cm),
                genero,
                idade: Number(idade),
                nivel_atividade
            });

            const dadosCorporais = {
                idUsuario: Number(idUsuario),
                peso_kg: Number(peso_kg),
                altura_cm: Number(altura_cm),
                genero,
                idade: Number(idade),
                nivel_atividade
            };

            const resultado = await DadosCorporaisService.criar(dadosCorporais);

            return res.status(201).json({
                mensagem: "Dados corporais cadastrados com sucesso",
                dados: resultado
            });
        } catch (error) {
            return res.status(400).json({ erro: error.message });
        }
    },

    listar: async (_, res) => {
        try {
            const dados = await DadosCorporaisRepository.findAll();
            return res.status(200).json(dados);
        } catch (error) {
            return res.status(500).json({ erro: error.message });
        }
    },

    buscarPorId: async (req, res) => {
        try {
            const { id } = req.params;
            const dados = await DadosCorporaisRepository.findById(Number(id));

            if (!dados) {
                return res.status(404).json({ erro: "Dados não encontrados" });
            }

            return res.status(200).json(dados);
        } catch (error) {
            return res.status(500).json({ erro: error.message });
        }
    },

    buscarPorUsuario: async (req, res) => {
        try {
            const idUsuario = req.params.id ? Number(req.params.id) : req.usuario?.id;
            const dados = await DadosCorporaisRepository.findByUsuario(Number(idUsuario));

            if (!dados) {
                return res.status(404).json({ erro: "Dados não encontrados" });
            }

            return res.status(200).json(dados);
        } catch (error) {
            return res.status(500).json({ erro: error.message });
        }
    },

    atualizar: async (req, res) => {
        try {
            const idUsuario = req.params.idUsuario ? Number(req.params.idUsuario) : req.usuario?.id;
            const { peso_kg, altura_cm, genero, idade, nivel_atividade } = req.body;

            DadosCorporais.editar({
                idUsuario: Number(idUsuario),
                peso_kg: Number(peso_kg),
                altura_cm: Number(altura_cm),
                genero,
                idade: Number(idade),
                nivel_atividade
            });

            const dadosCorporais = {
                idUsuario: Number(idUsuario),
                peso_kg: Number(peso_kg),
                altura_cm: Number(altura_cm),
                genero,
                idade: Number(idade),
                nivel_atividade
            };

            const resultado = await DadosCorporaisService.atualizar(
                Number(idUsuario),
                dadosCorporais
            );

            return res.status(200).json({
                mensagem: "Dados atualizados com sucesso",
                dados: resultado
            });
        } catch (error) {
            return res.status(400).json({ erro: error.message });
        }
    },

    deletar: async (req, res) => {
        try {
            const idUsuario = req.params.idUsuario ? Number(req.params.idUsuario) : req.usuario?.id;
            await DadosCorporaisRepository.delete(Number(idUsuario));

            return res.status(200).json({
                mensagem: "Dados deletados com sucesso"
            });
        } catch (error) {
            return res.status(500).json({ erro: error.message });
        }
    }
};

export default DadosCorporaisController;