import notifee, {
    AndroidImportance,
} from "@notifee/react-native";

export async function criarCanais() {

    await notifee.createChannel({
        id: "treinos",
        name: "Treinos",
        importance: AndroidImportance.HIGH,
        sound: "default",
    });

    await notifee.createChannel({
        id: "lembretes",
        name: "Lembretes",
        importance: AndroidImportance.DEFAULT,
        sound: "default",
    });

    await notifee.createChannel({
        id: "evolucao",
        name: "Evolução",
        importance: AndroidImportance.DEFAULT,
        sound: "default",
    });

    await notifee.createChannel({
        id: "agua",
        name: "Hidratação",
        importance: AndroidImportance.HIGH,
        sound: "none",
    })
}