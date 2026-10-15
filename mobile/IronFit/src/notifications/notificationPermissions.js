import * as Notifications from 'expo-notifications';

/**
 * Solicita permissão ao usuário para exibição de notificações locais e push
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

/**
 * Verifica o status atual da permissão de notificações sem disparar prompt se já decidido
 */
export async function obterStatusPermissaoNotificacao() {
  const settings = await Notifications.getPermissionsAsync();
  return settings;
}
