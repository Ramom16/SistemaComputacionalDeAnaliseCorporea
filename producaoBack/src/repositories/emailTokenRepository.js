import prisma from "../database/prismaClient.js";

const emailTokenRepository = {
  criar: async (usuarioId, token_hash, expira_em) => {
    return await prisma.emailVerificationToken.create({
      data: {
        usuarioId,
        token_hash,
        expira_em
      }
    });
  },

  buscarPorTokenHash: async (token_hash) => {
    return await prisma.emailVerificationToken.findUnique({
      where: { token_hash }
    });
  },

  marcarComoUsado: async (id) => {
    return await prisma.emailVerificationToken.update({
      where: { id },
      data: {
        usado_em: new Date()
      }
    });
  },

  deletar: async (id) => {
    return await prisma.emailVerificationToken.delete({
      where: { id }
    });
  },

  deletarPorUsuario: async (usuarioId) => {
    return await prisma.emailVerificationToken.deleteMany({
      where: { usuarioId }
    });
  }
};

export default emailTokenRepository;