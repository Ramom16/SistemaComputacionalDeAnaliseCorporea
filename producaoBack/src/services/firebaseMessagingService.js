import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';
import path from 'path';
import fs from 'fs';

// Caminho para a sua chave privada do Firebase Console ou variável de ambiente
const serviceAccountPath = path.resolve(process.cwd(), 'serviceAccountKey.json');

let firebaseInicializado = false;

try {
  let credentialData = null;

  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    // Permite carregar credenciais diretamente de variável de ambiente (ótimo para CI/CD e produção)
    credentialData = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  } else if (fs.existsSync(serviceAccountPath)) {
    credentialData = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
  }

  if (credentialData && !getApps().length) {
    initializeApp({
      credential: cert(credentialData),
    });
    firebaseInicializado = true;
    console.log('✅ Firebase Admin inicializado com sucesso (conexões HTTP/2 multiplexadas ativas).');
  } else if (getApps().length) {
    firebaseInicializado = true;
  } else {
    console.warn('⚠️ Arquivo serviceAccountKey.json não encontrado nem FIREBASE_SERVICE_ACCOUNT definida.');
  }
} catch (err) {
  console.error('❌ Erro ao inicializar Firebase Admin:', err.message);
}

/**
 * Códigos de erro que indicam que o token do dispositivo expirou ou é inválido.
 */
const ERROS_TOKEN_INVALIDO = [
  'messaging/invalid-registration-token',
  'messaging/registration-token-not-registered',
  'messaging/mismatched-credential',
];

/**
 * Envia notificação push individual diretamente via Firebase Cloud Messaging (FCM)
 * @param {string} fcmToken - Token nativo do dispositivo
 * @param {string} titulo - Título da Notificação
 * @param {string} mensagem - Conteúdo da Mensagem
 * @param {object} dadosExtras - Metadados para payload
 * @param {object} opcoes - Configurações extras de entrega (prioridade, canal, ttl, collapseKey)
 */
export async function enviarNotificacaoFirebase(
  fcmToken,
  titulo,
  mensagem,
  dadosExtras = {},
  opcoes = {}
) {
  if (!firebaseInicializado) {
    throw new Error('Firebase Admin não está inicializado. Verifique as credenciais.');
  }

  const {
    canalId = 'treinos',
    prioridade = 'high', // 'high' para alertas imediatos ou 'normal' para lembretes normais economizando bateria
    som = 'default',
    collapseKey = undefined, // Agrupa notificações repetidas (ex: lembretes de treino)
    ttlSegundos = 86400, // 24 horas de tempo limite se o celular estiver desligado
  } = opcoes;

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
      priority: prioridade,
      collapseKey,
      ttl: ttlSegundos,
      notification: {
        channelId: canalId,
        sound: som,
        clickAction: 'FLUTTER_NOTIFICATION_CLICK',
      },
    },
  };

  try {
    const messaging = getMessaging();
    const response = await messaging.send(payload);
    console.log('Push enviado com sucesso via Firebase:', response);
    return { sucesso: true, messageId: response };
  } catch (error) {
    const isTokenInvalido = ERROS_TOKEN_INVALIDO.includes(error.code);
    console.error('Erro ao enviar mensagem pelo Firebase FCM:', error.message, error.code);
    return {
      sucesso: false,
      erro: error.message,
      codigoErro: error.code,
      tokenInvalido: isTokenInvalido,
    };
  }
}

/**
 * OTIMIZAÇÃO: Envia notificações em massa (Multicast) para até 500 dispositivos em UMA ÚNICA chamada HTTP.
 * Reduz a latência, overhead de conexão e uso de CPU drasticamente.
 * 
 * @param {string[]} fcmTokens - Lista de tokens dos dispositivos
 * @param {string} titulo - Título da Notificação
 * @param {string} mensagem - Mensagem
 * @param {object} dadosExtras - Dados extras
 * @param {object} opcoes - Opções de entrega
 * @returns {Promise<{ sucesso: boolean, enviados: number, falhas: number, tokensInvalidos: string[] }>}
 */
export async function enviarNotificacaoMulticast(
  fcmTokens,
  titulo,
  mensagem,
  dadosExtras = {},
  opcoes = {}
) {
  if (!firebaseInicializado) {
    throw new Error('Firebase Admin não está inicializado.');
  }

  if (!Array.isArray(fcmTokens) || fcmTokens.length === 0) {
    return { sucesso: false, enviados: 0, falhas: 0, tokensInvalidos: [] };
  }

  // O limite do FCM por chamada multicast é 500 tokens
  const tokensValidos = [...new Set(fcmTokens.filter((t) => typeof t === 'string' && t.trim().length > 0))];
  if (tokensValidos.length === 0) {
    return { sucesso: false, enviados: 0, falhas: 0, tokensInvalidos: [] };
  }

  const {
    canalId = 'treinos',
    prioridade = 'high',
    som = 'default',
    collapseKey = undefined,
    ttlSegundos = 86400,
  } = opcoes;

  const payload = {
    tokens: tokensValidos,
    notification: {
      title: titulo,
      body: mensagem,
    },
    data: Object.fromEntries(
      Object.entries(dadosExtras).map(([k, v]) => [k, String(v)])
    ),
    android: {
      priority: prioridade,
      collapseKey,
      ttl: ttlSegundos,
      notification: {
        channelId: canalId,
        sound: som,
      },
    },
  };

  try {
    const messaging = getMessaging();
    const batchResponse = await messaging.sendEachForMulticast(payload);

    const tokensInvalidos = [];
    batchResponse.responses.forEach((resp, idx) => {
      if (!resp.success && resp.error) {
        if (ERROS_TOKEN_INVALIDO.includes(resp.error.code)) {
          tokensInvalidos.push(tokensValidos[idx]);
        }
      }
    });

    console.log(
      `[FCM Multicast] Sucessos: ${batchResponse.successCount}, Falhas: ${batchResponse.failureCount}`
    );

    return {
      sucesso: true,
      enviados: batchResponse.successCount,
      falhas: batchResponse.failureCount,
      tokensInvalidos,
    };
  } catch (error) {
    console.error('Erro ao enviar multicast pelo Firebase FCM:', error.message);
    throw error;
  }
}

export { firebaseInicializado };

