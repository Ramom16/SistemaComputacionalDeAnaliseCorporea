import * as Notifications from 'expo-notifications';

/**
 * Solicita permissão de notificações usando expo-notifications
 */
export async function solicitarPermissaoFirebase() {
  const { status } = await Notifications.requestPermissionsAsync();
  return status;
}

/**
 * Obtém o Device Push Token nativo do Firebase FCM (se disponível)
 */
export async function obterTokenFCM() {
  try {
    const tokenData = await Notifications.getDevicePushTokenAsync();
    return tokenData.data;
  } catch (error) {
    console.warn('FCM Token nativo só fica disponível em builds com google-services.json compilado:', error.message);
    return null;
  }
}