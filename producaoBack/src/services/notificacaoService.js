import usuariosRepository from '../repositories/usuariosRepository.js';
import { enviarPushNotification } from './pushNotificationService.js';
import { enviarNotificacaoFirebase } from './firebaseMessagingService.js';

/**
 * Notifica um usuário automaticamente utilizando o token disponível (Expo ou Firebase FCM)
 * @param {string} usuarioId - ID do usuário no banco de dados
 * @param {string} titulo - Título da Notificação
 * @param {string} mensagem - Texto da mensagem
 * @param {object} dadosExtras - Metadados para redirecionamento no app (ex: { screen: 'Treinos' })
 */
export async function notificarUsuario(usuarioId, titulo, mensagem, dadosExtras = {}) {
  try {
    const usuario = await usuariosRepository.buscarPorId(usuarioId);
    if (!usuario) {
      console.warn(`[Notificações] Usuário ${usuarioId} não encontrado.`);
      return { sucesso: false, erro: 'Usuário não encontrado' };
    }

    // 1. Tentar envio via Expo Push Token (padrão Expo Go e standalone)
    if (usuario.push_token) {
      console.log(`[Notificações] Enviando via Expo Push para usuário ${usuario.nome}...`);
      await enviarPushNotification(usuario.push_token, titulo, mensagem, dadosExtras);
      return { sucesso: true, canal: 'expo' };
    }

    // 2. Tentar envio direto via Firebase FCM
    if (usuario.fcm_token) {
      console.log(`[Notificações] Enviando via Firebase FCM para usuário ${usuario.nome}...`);
      await enviarNotificacaoFirebase(usuario.fcm_token, titulo, mensagem, dadosExtras);
      return { sucesso: true, canal: 'firebase' };
    }

    console.log(`[Notificações] O usuário ${usuario.nome} não possui tokens de notificação registrados.`);
    return { sucesso: false, erro: 'Usuário sem tokens registrados' };
  } catch (erro) {
    console.error(`[Notificações] Falha ao enviar notificação para usuário ${usuarioId}:`, erro.message);
    return { sucesso: false, erro: erro.message };
  }
}
