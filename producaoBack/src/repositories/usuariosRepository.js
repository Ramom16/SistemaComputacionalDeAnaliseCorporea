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
        role: usuario.role || "USER",

        perfil: {
          create: {
            fotoPerfil: null
          }
        }
      },
      include: {
        perfil: true
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
      where: { id: String(id) },
      include: {
        perfil: true
      }
    });
  },

  buscarPorEmail: async (email) => {
    return await prisma.usuario.findUnique({
      where: { email }
    });
  },

  buscarPorIdComDetalhes: async (id) => {
    return await prisma.usuario.findUnique({
      where: { id: String(id) },
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
      where: { id: String(id) },
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
      where: { id: String(id) },
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
      where: { id: String(id) },
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
      where: { id: String(id) },
      data: {
        tentativas_login: novasTentativas,
        bloqueado_ate
      }
    });
  },

  resetarTentativasEBloqueio: async (id) => {
    return await prisma.usuario.update({
      where: { id: String(id) },
      data: {
        tentativas_login: 0,
        bloqueado_ate: null
      }
    });
  },

  // DELETE
  deletar: async (id) => {
    return await prisma.usuario.delete({
      where: { id: String(id) }
    });
  },

  // DESATIVAR (mais seguro que deletar)
  desativar: async (id) => {
    return await prisma.usuario.update({
      where: { id: String(id) },
      data: {
        ativo: false
      }
    });
  },

  ativar: async (id) => {
    return await prisma.usuario.update({
      where: { id: String(id) },
      data: {
        ativo: true
      }
    });
  },

  // EMAIL VERIFICADO
  verificarEmail: async (id) => {
    return await prisma.usuario.update({
      where: { id: String(id) },
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
      where: { id: String(id) },
      data: { role: roleValida }
    });
  },
  /**
   * 
   * @param {string} id id de usuario para realizar a atualização da foto de perfil
   * @param {string} fotoPerfil Caminho ou URL da nova foto de perfil 
   * @returns 
   */
  atualizarFotoPerfil: async (id, fotoPerfil) => {
    return await prisma.usuario.update({
      where: { id: String(id) },
      data: {
        perfil: {
          update: {
            fotoPerfil: fotoPerfil
          }
        }
      }
    });
  },
};

export default usuariosRepository;