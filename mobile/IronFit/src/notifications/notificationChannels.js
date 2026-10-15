import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

/**
 * Cria os canais de notificação no Android para categorização e comportamento sonoro/vibratório.
 */
export async function criarCanais() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('treinos', {
      name: 'Treinos',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FFD400',
      sound: 'default',
    });

    await Notifications.setNotificationChannelAsync('lembretes', {
      name: 'Lembretes',
      importance: Notifications.AndroidImportance.DEFAULT,
      sound: 'default',
    });

    await Notifications.setNotificationChannelAsync('evolucao', {
      name: 'Evolução',
      importance: Notifications.AndroidImportance.DEFAULT,
      sound: 'default',
    });

    await Notifications.setNotificationChannelAsync('agua', {
      name: 'Hidratação',
      importance: Notifications.AndroidImportance.HIGH,
      sound: 'default',
    });
  }
}
