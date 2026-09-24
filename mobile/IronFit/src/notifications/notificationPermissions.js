import * as Notifications from 'expo-notifications';

/**
 * Solicita permissão ao usuário para exibição de notificações
 */
export async function solicitarPermissaoNotificacao() {
  const settings = await Notifications.requestPermissionsAsync({
    ios: {
      allowAlert: true,
      allowBadge: true,
      allowSound: true,
    },
  });

  return settings;
}