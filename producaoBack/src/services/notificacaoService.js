import usuariosRepository from '../repositories/usuariosRepository.js';
import { enviarPushNotification } from './pushNotificationService.js';
import { enviarNotificacaoFirebase, enviarNotificacaoMulticast } from './firebaseMessagingService.js';

/**
 * Notifica um usuário automaticamente utilizando o token disponível (Expo ou Firebase FCM)
 * Com limpeza automática de token inválido/obsoleto.
 * 
 * @param {string} usuarioId - ID do usuário no banco de dados
 * @param {string} titulo - Título da Notificação
 * @param {string} mensagem - Texto da mensagem
 * @param {object} dadosExtras - Metadados para redirecionamento no app (ex: { screen: 'Treinos' })
 * @param {object} opcoes - Opções extras (prioridade, canal, collapseKey, ttlSegundos)
 */
export async function notificarUsuario(usuarioId, titulo, mensagem, dadosExtras = {}, opcoes = {}) {
  try {
    const usuario = await usuariosRepository.buscarPorId(usuarioId);
    if (!usuario) {
      console.warn(`[Notificações] Usuário ${usuarioId} não encontrado.`);
      return { sucesso: false, erro: 'Usuário não encontrado' };
    }

    // 1. Tentar envio direto via Firebase FCM (se configurado)
    if (usuario.fcm_token) {
      console.log(`[Notificações] Enviando via Firebase FCM para usuário ${usuario.nome}...`);
      const res = await enviarNotificacaoFirebase(usuario.fcm_token, titulo, mensagem, dadosExtras, opcoes);
      
      // Higiene de Tokens: se o token foi revogado pelo aparelho, removemos do banco
      if (res?.tokenInvalido) {
        console.warn(`[Notificações] Token FCM inválido detectado para usuário ${usuario.nome}. Limpando do banco...`);
        await usuariosRepository.atualizarPushTokens(usuarioId, { fcmToken: null });
      }

      if (res?.sucesso) {
        return { sucesso: true, canal: 'firebase' };
      }
    }

    // 2. Fallback / Alternativa via Expo Push Token (padrão Expo Go e standalone)
    if (usuario.push_token) {
      console.log(`[Notificações] Enviando via Expo Push para usuário ${usuario.nome}...`);
      await enviarPushNotification(usuario.push_token, titulo, mensagem, dadosExtras);
      return { sucesso: true, canal: 'expo' };
    }

    console.log(`[Notificações] O usuário ${usuario.nome} não possui tokens de notificação registrados.`);
    return { sucesso: false, erro: 'Usuário sem tokens registrados' };
  } catch (erro) {
    console.error(`[Notificações] Falha ao enviar notificação para usuário ${usuarioId}:`, erro.message);
    return { sucesso: false, erro: erro.message };
  }
}

/**
 * OTIMIZAÇÃO: Notifica múltiplos usuários simultaneamente usando Multicast FCM
 * @param {string[]} listaUsuariosIds - Array com os IDs dos usuários
 * @param {string} titulo - Título
 * @param {string} mensagem - Mensagem
 * @param {object} dadosExtras - Metadados
 * @param {object} opcoes - Opções
 */
export async function notificarUsuariosEmMassa(listaUsuariosIds, titulo, mensagem, dadosExtras = {}, opcoes = {}) {
  try {
    if (!Array.isArray(listaUsuariosIds) || listaUsuariosIds.length === 0) {
      return { sucesso: false, erro: 'Nenhum usuário fornecido.' };
    }

    // Busca os usuários com seus respectivos tokens
    const tokensFCM = [];
    for (const id of listaUsuariosIds) {
      const u = await usuariosRepository.buscarPorId(id);
      if (u?.fcm_token) {
        tokensFCM.push(u.fcm_token);
      }
    }

    if (tokensFCM.length > 0) {
      const resultadoMulticast = await enviarNotificacaoMulticast(tokensFCM, titulo, mensagem, dadosExtras, opcoes);
      return resultadoMulticast;
    }

    return { sucesso: false, erro: 'Nenhum token FCM encontrado para os usuários informados.' };
  } catch (error) {
    console.error('[Notificações] Erro ao disparar notificações em massa:', error);
    return { sucesso: false, erro: error.message };
  }
}

