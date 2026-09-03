import { DadosCorporais } from "../models/DadosCorporais.js";
import DadosCorporaisService from "../services/dadosCorporaisService.js";
import DadosCorporaisRepository from "../repositories/dadosCorporaisRepository.js";
<<<<<<< HEAD
=======
import { anexarIdsCriptografados } from "../middlewares/tratarIdsCriptografados.js";
>>>>>>> producaoBack

const DadosCorporaisController = {

    criar: async (req, res) => {
        try {
<<<<<<< HEAD
            const idUsuario = req.usuario?.id || Number(req.body.idUsuario);
            const { peso_kg, altura_cm, genero, idade, nivel_atividade } = req.body;

=======
            // Prioriza o usuário autenticado no JWT
            const idUsuario = req.usuario?.id || req.body.idUsuario;

            if (!idUsuario) {
                return res.status(401).json({ erro: "Usuário não autenticado." });
            }

            const {
                peso_kg,
                altura_cm,
                genero,
                idade,
                nivel_atividade
            } = req.body;

            // Validação da model com UUID
>>>>>>> producaoBack
            DadosCorporais.criar({
                idUsuario: String(idUsuario),
                peso_kg: Number(peso_kg),
                altura_cm: Number(altura_cm),
                genero,
                idade: Number(idade),
                nivel_atividade
            });

            const dadosCorporais = {
                idUsuario: String(idUsuario),
                peso_kg: Number(peso_kg),
                altura_cm: Number(altura_cm),
                genero,
                idade: Number(idade),
                nivel_atividade
            };

            const resultado = await DadosCorporaisService.criar(dadosCorporais);

            return res.status(201).json({
                mensagem: "Dados corporais cadastrados com sucesso",
<<<<<<< HEAD
                dados: resultado
=======
                dados: anexarIdsCriptografados(resultado)
>>>>>>> producaoBack
            });
        } catch (error) {
            return res.status(400).json({ erro: error.message });
        }
    },

<<<<<<< HEAD
    listar: async (_, res) => {
        try {
            const dados = await DadosCorporaisRepository.findAll();
            return res.status(200).json(dados);
=======
    // LISTAR (Apenas dados corporais do usuário autenticado ou lista geral se aplicável)
    listar: async (req, res) => {
        try {
            if (req.usuario?.id) {
                const dados = await DadosCorporaisRepository.findByUsuario(String(req.usuario.id));
                return res.status(200).json(anexarIdsCriptografados(dados ? [dados] : []));
            }
            const dados = await DadosCorporaisRepository.findAll();
            return res.status(200).json(anexarIdsCriptografados(dados));
>>>>>>> producaoBack
        } catch (error) {
            return res.status(500).json({ erro: error.message });
        }
    },

<<<<<<< HEAD
    buscarPorId: async (req, res) => {
        try {
            const { id } = req.params;
            const dados = await DadosCorporaisRepository.findById(Number(id));

=======
    // BUSCAR POR ID
    buscarPorId: async (req, res) => {
        try {
            const { id } = req.params;
            const dados = await DadosCorporaisRepository.findById(String(id));
>>>>>>> producaoBack
            if (!dados) {
                return res.status(404).json({ erro: "Dados não encontrados" });
            }

<<<<<<< HEAD
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
=======
            // Proteção contra IDOR: verifica se o dado pertence ao usuário autenticado
            if (req.usuario?.id && dados.idUsuario !== req.usuario.id) {
                return res.status(403).json({
                    erro: "Você não possui permissão para acessar estes dados."
                });
            }

            return res.status(200).json(anexarIdsCriptografados(dados));
        } catch (error) {
            return res.status(500).json({
                erro: error.message
            });
        }
    },

    // BUSCAR POR USUÁRIO
    buscarPorUsuario: async (req, res) => {
        try {
            const targetId = req.params.id || req.usuario?.id;

            // Proteção contra IDOR
            if (req.usuario?.id && targetId !== req.usuario.id) {
                return res.status(403).json({
                    erro: "Você não possui permissão para acessar estes dados."
                });
            }

            const dados = await DadosCorporaisRepository.findByUsuario(String(targetId));
            if (!dados) {
                return res.status(404).json({
                    erro: "Dados não encontrados"
                });
            }
            return res.status(200).json(anexarIdsCriptografados(dados));
        } catch (error) {
            return res.status(500).json({
                erro: error.message
            });
>>>>>>> producaoBack
        }
    },

    atualizar: async (req, res) => {
        try {
<<<<<<< HEAD
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

=======
            const idUsuario = req.usuario?.id || req.params.idUsuario;

            // Proteção contra IDOR
            if (req.usuario?.id && req.params.idUsuario && req.params.idUsuario !== req.usuario.id) {
                return res.status(403).json({
                    erro: "Você não possui permissão para alterar dados deste usuário."
                });
            }

            const {
                peso_kg,
                altura_cm,
                genero,
                idade,
                nivel_atividade
            } = req.body;

            // Validação
>>>>>>> producaoBack
            const dadosCorporais = {
                idUsuario: String(idUsuario),
                peso_kg: Number(peso_kg),
                altura_cm: Number(altura_cm),
                genero,
                idade: Number(idade),
                nivel_atividade
            };

            const resultado = await DadosCorporaisService.atualizar(
<<<<<<< HEAD
                Number(idUsuario),
=======
                String(idUsuario),
>>>>>>> producaoBack
                dadosCorporais
            );

            return res.status(200).json({
                mensagem: "Dados atualizados com sucesso",
<<<<<<< HEAD
                dados: resultado
=======
                dados: anexarIdsCriptografados(resultado)
>>>>>>> producaoBack
            });
        } catch (error) {
            return res.status(400).json({ erro: error.message });
        }
    },

<<<<<<< HEAD
    deletar: async (req, res) => {
        try {
            const idUsuario = req.params.idUsuario ? Number(req.params.idUsuario) : req.usuario?.id;
            await DadosCorporaisRepository.delete(Number(idUsuario));

=======
    // DELETE
    deletar: async (req, res) => {
        try {
            const idUsuario = req.usuario?.id || req.params.idUsuario || req.query.idUsuario;

            if (!idUsuario) {
                return res.status(400).json({ erro: "ID do usuário não especificado." });
            }

            await DadosCorporaisRepository.delete(String(idUsuario));
>>>>>>> producaoBack
            return res.status(200).json({
                mensagem: "Dados deletados com sucesso"
            });
        } catch (error) {
            return res.status(500).json({ erro: error.message });
        }
    }
};
<<<<<<< HEAD
=======

export default DadosCorporaisController;
>>>>>>> producaoBack

export default DadosCorporaisController;