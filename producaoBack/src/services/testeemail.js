
const apiKey = process.env.BREVO_API_KEY;
const remetente = process.env.EMAIL_FROM;

// Troque pelo e-mail que você quer receber o teste.
const destinatario = "seu-email@gmail.com";

async function testarEmail() {
  const resposta = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
      "accept": "application/json",
    },
    body: JSON.stringify({
      sender: {
        name: "IRONFIT",
        email: remetente,
      },
      to: [{ email: destinatario }],
      subject: "Teste de e-mail - IRONFIT",
      htmlContent: "<h1>Funcionou!</h1><p>O envio pelo Brevo foi testado.</p>",
    }),
  });

  const resultado = await resposta.text();

  console.log("Status:", resposta.status);
  console.log("Resposta:", resultado);
}

testarEmail().catch(console.error);
