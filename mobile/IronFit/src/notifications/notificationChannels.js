import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export async function criarCanais() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('treinos', {
      name: 'Treinos',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });

    await Notifications.setNotificationChannelAsync('lembretes', {
      name: 'Lembretes',
      importance: Notifications.AndroidImportance.DEFAULT,
    });

    await Notifications.setNotificationChannelAsync('evolucao', {
      name: 'Evolução',
      importance: Notifications.AndroidImportance.DEFAULT,
    });

    await Notifications.setNotificationChannelAsync('agua', {
      name: 'Hidratação',
      importance: Notifications.AndroidImportance.HIGH,
    });
  }
}
