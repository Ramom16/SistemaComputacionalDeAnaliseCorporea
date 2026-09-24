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

  // 1. Cria canais Android
  await criarCanais();

  // 2. Notificações físicas requerem dispositivo real
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Permissão para notificações não foi concedida!');
      return { expoPushToken: null, fcmDeviceToken: null };
    }

    // A) Obter o Expo Push Token
    try {
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ??
        Constants?.easConfig?.projectId ??
        '83aad122-0a96-4b7f-9558-678bbd48f7ab';

      const expoTokenObj = await Notifications.getExpoPushTokenAsync({ projectId });
      expoPushToken = expoTokenObj.data;
      console.log('📱 Expo Push Token:', expoPushToken);
    } catch (err) {
      console.warn('Não foi possível obter Expo Push Token:', err.message);
    }

    // B) Obter o Token nativo do Firebase FCM (usando google-services.json)
    try {
      const deviceTokenObj = await Notifications.getDevicePushTokenAsync();
      fcmDeviceToken = deviceTokenObj.data;
      console.log('🔥 Firebase FCM Device Token:', fcmDeviceToken);
    } catch (err) {
      console.warn('FCM Token nativo disponível em builds com google-services:', err.message);
    }
  } else {
    console.log('Aviso: Push notification requer celular físico, mas notificações locais funcionam no emulador.');
  }

  return { expoPushToken, fcmDeviceToken };
}

/**
 * Disparar Notificação Local Imediata
 */
export async function exibirNotificacaoLocal({ titulo, mensagem, canalId = 'lembretes', dados = {} }) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: titulo,
      body: mensagem,
      channelId: canalId,
      data: dados,
    },
    trigger: null,
  });
}

/**
 * Agendar Notificação Local (Ex: lembrete em segundos ou horário)
 */
export async function agendarNotificacaoLocal({ titulo, mensagem, segundos = 60, canalId = 'treinos', dados = {} }) {
  return await Notifications.scheduleNotificationAsync({
    content: {
      title: titulo,
      body: mensagem,
      channelId: canalId,
      data: dados,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: segundos,
      repeats: false,
    },
  });
}
