import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';
import path from 'path';
import fs from 'fs';

// Caminho para a sua chave privada do Firebase Console
const serviceAccountPath = path.resolve(process.cwd(), 'serviceAccountKey.json');

let firebaseInicializado = false;

if (fs.existsSync(serviceAccountPath)) {
  try {
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

    if (!getApps().length) {
      initializeApp({
        credential: cert(serviceAccount),
      });
    }
    firebaseInicializado = true;
    console.log('✅ Firebase Admin inicializado com sucesso.');
  } catch (err) {
    console.error('❌ Erro ao inicializar Firebase Admin:', err.message);
  }
} else {
  console.warn('⚠️ Arquivo serviceAccountKey.json não encontrado na raiz de producaoBack.');
}

/**
 * Envia notificação push diretamente via Firebase Cloud Messaging (FCM)
 * @param {string} fcmToken - Token nativo do dispositivo
 * @param {string} titulo - Título da Notificação
 * @param {string} mensagem - Conteúdo da Mensagem
 * @param {object} dadosExtras - Dados extras para payload
 */
export async function enviarNotificacaoFirebase(fcmToken, titulo, mensagem, dadosExtras = {}) {
  if (!firebaseInicializado) {
    throw new Error('Firebase Admin não está inicializado. Verifique o arquivo serviceAccountKey.json.');
  }

  const payload = {
    token: fcmToken,
    notification: {
      title: titulo,
      body: mensagem,
    },
    data: Object.fromEntries(
      Object.entries(dadosExtras).map(([k, v]) => [k, String(v)])
    ),
    android: {
      priority: 'high',
      notification: {
        channelId: 'treinos',
        sound: 'default',
      },
    },
  };

  try {
    const messaging = getMessaging();
    const response = await messaging.send(payload);
    console.log('Push enviado com sucesso via Firebase:', response);
    return response;
  } catch (error) {
    console.error('Erro ao enviar mensagem pelo Firebase FCM:', error);
    throw error;
  }
}

export { firebaseInicializado };
