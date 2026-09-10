import prisma from "../database/prismaClient.js";
const usuariosRepository = {

  // CREATE
  criar: async (usuario) => {
    const novoUsuario = await prisma.usuario.create({
      data: {
        nome: usuario.nome,
        email: usuario.email,
        senha_hash: usuario.senha_hash,
        data_nascimento: usuario.data_nascimento,
        ativo: usuario.ativo,
        email_verificado: usuario.email_verificado,
        role: usuario.role || "USER"
      }
    });

    return novoUsuario;
  },

  // READ
  listar: async () => {
    return await prisma.usuario.findMany({
      orderBy: {
        criado_em: "desc"
      }
    });
  },

  buscarPorId: async (id) => {
    return await prisma.usuario.findUnique({
      where: { id: Number(id) }
    });
  },

  buscarPorEmail: async (email) => {
    return await prisma.usuario.findUnique({
      where: { email }
    });
  },

  buscarPorIdComDetalhes: async (id) => {
    return await prisma.usuario.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        nome: true,
        email: true,
        data_nascimento: true,
        ativo: true,
        email_verificado: true,
        role: true,
        ultimo_login: true,
        criado_em: true,
        dadosCorporais: {
          include: {
            calculos: true,
            historicos: {
              take: 5,
              orderBy: { criado_em: "desc" }
            }
          }
        },
        usuariosPerfil: {
          include: {
            perfil: true
          }
        }
      }
    });
  },

  // UPDATE
  atualizar: async (id, usuario) => {
    const usuarioAtualizado = await prisma.usuario.update({
      where: { id: Number(id) },
      data: {
        nome: usuario.nome,
        email: usuario.email,
        senha_hash: usuario.senha_hash,
        data_nascimento: usuario.data_nascimento,
        ativo: usuario.ativo,
        email_verificado: usuario.email_verificado
      }
    });

    return usuarioAtualizado;
  },

  atualizarSenha: async (id, senha_hash) => {
    return await prisma.usuario.update({
      where: { id: Number(id) },
      data: {
        senha_hash,
        tentativas_login: 0,
        bloqueado_ate: null
      }
    });
  },

  // Atualizar apenas ultimo_login (muito usado no login)
  atualizarUltimoLogin: async (id) => {
    return await prisma.usuario.update({
      where: { id: Number(id) },
      data: {
        ultimo_login: new Date(),
        tentativas_login: 0,
        bloqueado_ate: null
      }
    });
  },

  // SEGURANÇA CONTRA FORÇA BRUTA
  incrementarTentativasLogin: async (id, tentativasAtuais) => {
    const novasTentativas = tentativasAtuais + 1;
    const limiteTentativas = 5;
    const minutosBloqueio = 15;

    let bloqueado_ate = null;
    if (novasTentativas >= limiteTentativas) {
      bloqueado_ate = new Date(Date.now() + minutosBloqueio * 60 * 1000);
    }

    return await prisma.usuario.update({
      where: { id: Number(id) },
      data: {
        tentativas_login: novasTentativas,
        bloqueado_ate
      }
    });
  },

  resetarTentativasEBloqueio: async (id) => {
    return await prisma.usuario.update({
      where: { id: Number(id) },
      data: {
        tentativas_login: 0,
        bloqueado_ate: null
      }
    });
  },

  // DELETE
  deletar: async (id) => {
    return await prisma.usuario.delete({
      where: { id: Number(id) }
    });
  },

  // DESATIVAR (mais seguro que deletar)
  desativar: async (id) => {
    return await prisma.usuario.update({
      where: { id: Number(id) },
      data: {
        ativo: false
      }
    });
  },

  ativar: async (id) => {
    return await prisma.usuario.update({
      where: { id: Number(id) },
      data: {
        ativo: true
      }
    });
  },

  // EMAIL VERIFICADO
  verificarEmail: async (id) => {
    return await prisma.usuario.update({
      where: { id: Number(id) },
      data: {
        email_verificado: true
      }
    });
  },

  // ATUALIZAR ROLE (ADMIN / USER)
  atualizarRole: async (id, role) => {
    const roleValida = String(role).toUpperCase().trim();
    if (roleValida !== "ADMIN" && roleValida !== "USER") {
      throw new Error("Role inválida. Deve ser 'USER' ou 'ADMIN'");
    }
    return await prisma.usuario.update({
      where: { id: Number(id) },
      data: { role: roleValida }
    });
  }
};

export default usuariosRepository;