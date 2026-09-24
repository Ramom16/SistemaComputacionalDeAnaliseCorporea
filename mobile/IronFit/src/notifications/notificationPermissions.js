import notifee from "@notifee/react-native";

// função que serve só pra solicitar permissão ao usuário do uso de notificações

export async function solicitarPermissaoNotificacao() {

    const settings = await notifee.requestPermission();

    return settings;
}