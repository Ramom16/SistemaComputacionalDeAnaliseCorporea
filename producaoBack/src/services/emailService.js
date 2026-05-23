import nodemailer from "nodemailer";

export const enviarEmailVerificacao = async (email, link) => {

  console.log(process.env.EMAIL_USER);
  console.log(process.env.EMAIL_PASS);

  const transporter = nodemailer.createTransport({

    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.verify();
  console.log("SMTP OK");
  await transporter.sendMail({
    from: `"Sistema" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verificação de Email",
    html: `
      <h1>Verifique seu email</h1>
      <a href="${link}">
        Verificar Email
      </a>
    `
  });
};