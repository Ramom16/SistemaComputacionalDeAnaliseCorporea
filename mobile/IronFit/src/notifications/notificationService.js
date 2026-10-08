import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { criarCanais } from './notificationChannels';

// Handler que define como a notificação se comporta com o app ABERTO (foreground)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

/**
 * Registra permissões e obtém tanto o Expo Push Token quanto o FCM Device Token do Firebase
 */
export async function registrarParaPushNotificationsAsync() {
  let expoPushToken = null;
  let fcmDeviceToken = null;

  try {
    // 1. Cria os canais de notificação no Android
    await criarCanais();
  } catch (channelErr) {
    console.warn('Erro ao criar canais de notificação:', channelErr.message);
  }

  // 2. Push notifications remotas requerem dispositivo real
  if (Device.isDevice) {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('Permissão para notificações não foi concedida pelo usuário.');
        return { expoPushToken: null, fcmDeviceToken: null };
      }

      // A) Obter o Expo Push Token
      try {
        const projectId =
          Constants?.expoConfig?.extra?.eas?.projectId ??
          Constants?.easConfig?.projectId ??
          '83aad122-0a96-4b7f-9558-678bbd48f7ab';

        const expoTokenObj = await Notifications.getExpoPushTokenAsync({ projectId });
        expoPushToken = expoTokenObj?.data || null;
        if (expoPushToken) {
          console.log('📱 Expo Push Token obtido:', expoPushToken);
        }
      } catch (err) {
        console.warn('Não foi possível obter Expo Push Token:', err.message);
      }

      // B) Obter o Token nativo do Firebase FCM (usando google-services.json compilado)
      try {
        const deviceTokenObj = await Notifications.getDevicePushTokenAsync();
        fcmDeviceToken = deviceTokenObj?.data || null;
        if (fcmDeviceToken) {
          console.log('🔥 Firebase FCM Device Token obtido:', fcmDeviceToken);
        }
      } catch (err) {
        // Normal em desenvolvimento / Expo Go puro onde o FCM nativo precisa de build customizada
        console.warn('FCM Token nativo disponível em builds com google-services:', err.message);
      }
    } catch (permErr) {
      console.warn('Erro ao verificar permissões de notificação:', permErr.message);
    }
  } else {
    console.log('ℹ️ Dispositivo virtual/emulador detectado: Notificações locais funcionam perfeitamente.');
  }

  return { expoPushToken, fcmDeviceToken };
}

/**
 * Disparar Notificação Local Imediata
 */
export async function exibirNotificacaoLocal({
  titulo = 'IronFit 💪',
  mensagem = 'Notificação recebida com sucesso!',
  canalId = 'lembretes',
  dados = {},
}) {
  return await Notifications.scheduleNotificationAsync({
    content: {
      title: titulo,
      body: mensagem,
      channelId: canalId,
      data: dados,
      sound: true,
    },
    trigger: null,
  });
}

/**
 * Agendar Notificação Local por tempo em segundos
 */
export async function agendarNotificacaoLocal({
  titulo = 'Hora do Treino! 🏋️‍♂️',
  mensagem = 'Não esqueça da sua rotina diária no IronFit.',
  segundos = 60,
  canalId = 'treinos',
  dados = {},
}) {
  return await Notifications.scheduleNotificationAsync({
    content: {
      title: titulo,
      body: mensagem,
      channelId: canalId,
      data: dados,
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: Math.max(1, segundos),
      repeats: false,
    },
  });
}

/**
 * Agendar Lembrete Diário de Treino em horário fixo (ex: hora e minuto)
 */
export async function agendarLembreteDiario({
  titulo = 'Lembrete de Treino IronFit ⏰',
  mensagem = 'Seu treino do dia está pronto. Bora manter a consistência!',
  hora = 18,
  minuto = 0,
  canalId = 'treinos',
  dados = {},
}) {
  return await Notifications.scheduleNotificationAsync({
    content: {
      title: titulo,
      body: mensagem,
      channelId: canalId,
      data: dados,
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: hora,
      minute: minuto,
    },
  });
}

/**
 * Cancela todas as notificações locais agendadas
 */
export async function cancelarTodasNotificacoes() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

/**
 * Cancela uma notificação agendada específica pelo identificador
 */
export async function cancelarNotificacao(idNotificacao) {
  if (idNotificacao) {
    await Notifications.cancelScheduledNotificationAsync(idNotificacao);
  }
}

/**
 * Lista todas as notificações locais agendadas pendentes
 */
export async function obterNotificacoesAgendadas() {
  return await Notifications.getAllScheduledNotificationsAsync();
}
