import * as Notifications from 'expo-notifications';

/**
 * Agenda uma notificação para um determinado timestamp ou objeto Date
 * @param {string} titulo
 * @param {string} mensagem
 * @param {Date|number} data - Date ou timestamp em milissegundos
 * @param {string} canal - Nome do canal ('treinos', 'lembretes', 'evolucao', 'agua')
 * @param {object} dados - Metadados adicionais
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
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: diferencaSegundos,
      repeats: false,
    },
  });

  return id;
}

export default agendarNotificacao;
