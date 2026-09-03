import prisma from "../database/prismaClient.js";

const passwordResetTokenRepository = {
  criar: async (usuarioId, token_hash, expira_em) => {
    return await prisma.passwordResetToken.create({
      data: {
        usuarioId: String(usuarioId),
        token_hash,
        expira_em
      }
    });
  },

  buscarPorTokenHash: async (token_hash) => {
    return await prisma.passwordResetToken.findUnique({
      where: { token_hash },
      include: {
        usuario: true
      }
    });
  },

  marcarComoUsado: async (id) => {
    return await prisma.passwordResetToken.update({
      where: { id: String(id) },
      data: {
        usado_em: new Date()
      }
    });
  },

  deletar: async (id) => {
    return await prisma.passwordResetToken.delete({
      where: { id: String(id) }
    });
  },

  deletarPorUsuario: async (usuarioId) => {
    return await prisma.passwordResetToken.deleteMany({
      where: { usuarioId: String(usuarioId) }
    });
  }
};

export default passwordResetTokenRepository;
