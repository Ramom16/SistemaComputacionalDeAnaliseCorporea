import notifee, {
    AndroidImportance,
    TriggerType,
} from "@notifee/react-native";

export async function exibirNotificacao({
    titulo,
    mensagem,
    canal = "lembretes",
}) {

    await notifee.displayNotification({
        title: titulo,

        body: mensagem,

        android: {
            channelId: canal,
            importance: AndroidImportance.HIGH,
            pressAction: {
                id: "default",
            },
        },
    });
}