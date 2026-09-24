import * as Notifications from 'expo-notifications';

/**
 * Agenda uma notificação para um determinado timestamp / data
 */
export async function agendarNotificacao({
  titulo,
  mensagem,
  data,
  canal = 'lembretes',
  dados = {},
}) {
  const agora = Date.now();
  const triggerTimestamp = data instanceof Date ? data.getTime() : Number(data);
  const diferencaSegundos = Math.max(1, Math.round((triggerTimestamp - agora) / 1000));

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: titulo,
      body: mensagem,
      channelId: canal,
      data: dados,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: diferencaSegundos,
      repeats: false,
    },
  });

  return id;
}