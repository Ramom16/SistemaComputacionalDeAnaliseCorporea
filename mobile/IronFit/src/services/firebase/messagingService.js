import messaging from "@react-native-firebase/messaging";

export async function solicitarPermissaoFirebase() {

    const authorizationStatus =
        await messaging().requestPermission();

    return authorizationStatus;
}

export async function obterTokenFCM() {

    await messaging().registerDeviceForRemoteMessages();

    const token = await messaging().getToken();

    return token;
}

const token = await obterTokenFCM();

console.log("FCM TOKEN:", token);