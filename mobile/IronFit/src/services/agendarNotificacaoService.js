export async function agendarNotificacao({
    titulo,
    mensagem,
    data,
    canal = "lembretes",
}) {

    const id = await notifee.createTriggerNotification(
        {
            title: titulo,

            body: mensagem,

            android: {
                channelId: canal,

                pressAction: {
                    id: "default",
                },
            },
        },

        {
            type: TriggerType.TIMESTAMP,
            timestamp: data.getTime(),
        }
    );

    return id;
}