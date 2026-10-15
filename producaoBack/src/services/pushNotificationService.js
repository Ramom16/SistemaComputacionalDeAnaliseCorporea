/**
 * Envia notificação push para um ou mais Expo Push Tokens
 * @param {string|string[]} pushTokens - Ex: 'ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]'
 * @param {string} titulo - Título da Notificação
 * @param {string} mensagem - Corpo da mensagem
 * @param {object} dadosExtras - Dados extras para navegação (ex: { screen: 'TreinoDetalhes', treinoId: '123' })
 */
export async function enviarPushNotification(pushTokens, titulo, mensagem, dadosExtras = {}) {
  const tokens = Array.isArray(pushTokens) ? pushTokens : [pushTokens];
  
  // Filtra tokens válidos da Expo
  const tokensValidos = tokens.filter(token => typeof token === 'string' && token.startsWith('ExponentPushToken'));

  if (tokensValidos.length === 0) {
    console.warn('Nenhum token Expo válido fornecido.');
    return;
  }

  const mensagens = tokensValidos.map(token => ({
    to: token,
    sound: 'default',
    title: titulo,
    body: mensagem,
    channelId: 'treinos',
    data: dadosExtras,
  }));

  try {
    const resposta = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mensagens),
    });

    const resultado = await resposta.json();
    return resultado;
  } catch (erro) {
    console.error('Erro ao enviar push notification via Expo:', erro);
  }
}
