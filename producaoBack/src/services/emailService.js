import nodemailer from "nodemailer";

//IMAGENS RETIRADAS DO IMGX

export const enviarEmailVerificacao = async (email, link) => {

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,

    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.verify();

  console.log("SMTP OK");

  await transporter.sendMail({

    from: `"IRONFIT" <${process.env.EMAIL_USER}>`,

    to: email,

    subject: "Verifique sua conta - IRONFIT",

    html: `
    
    <!DOCTYPE html>
    <html lang="pt-BR">

    <head>
      <meta charset="UTF-8" />

      <style>

        *{
          margin:0;
          padding:0;
          box-sizing:border-box;
        }

        body{
          background:#050505;
          font-family:Arial, Helvetica, sans-serif;
          color:white;
        }

        .container{
          width:100%;
          padding:40px 20px;
          background:#050505;
        }

        .card{

          max-width:600px;

          margin:auto;

          background:
            linear-gradient(
              rgba(0,0,0,0.85),
              rgba(0,0,0,0.92)
            ),

            url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop');

          background-size:cover;
          background-position:center;

          border:1px solid rgba(255,255,255,0.08);

          border-radius:20px;

          padding:60px 40px;

          text-align:center;

          box-shadow:
            0 0 40px rgba(0,0,0,0.6);
        }

        .logo{
          color:#ffe600;
          font-size:38px;
          font-weight:900;
          letter-spacing:2px;
          margin-bottom:35px;
        }

        .title{
          color:#ffe600;
          font-size:42px;
          font-weight:900;
          line-height:1.1;
          margin-bottom:20px;
          text-transform:uppercase;
        }

        .text{
          color:#d7d7d7;
          font-size:16px;
          line-height:1.7;
          margin-bottom:35px;
        }

        .button{

          display:inline-block;

          background:#ffe600;

          color:#000 !important;

          text-decoration:none;

          padding:18px 40px;

          border-radius:10px;

          font-weight:900;

          font-size:18px;

          text-transform:uppercase;

          letter-spacing:1px;

          box-shadow:
            0 0 25px rgba(255,230,0,0.45);

        }

        .divider{
          width:80px;
          height:4px;
          background:#ffe600;
          margin:35px auto;
          border-radius:20px;
        }

        .footer{
          margin-top:40px;
          color:#8a8a8a;
          font-size:13px;
          line-height:1.6;
        }

        .link{
          margin-top:30px;
          word-break:break-all;
          color:#999;
          font-size:12px;
        }

        @media(max-width:600px){

          .card{
            padding:40px 25px;
          }

          .title{
            font-size:32px;
          }

        }

      </style>
    </head>

    <body>

      <div class="container">

        <div class="card">

          <div class="logo">
            IRONFIT
          </div>

          <h1 class="title">
            Verifique<br>
            Sua Conta
          </h1>

          <div class="divider"></div>

          <p class="text">

            Estamos quase finalizando seu cadastro.

            Clique no botão abaixo para ativar sua conta
            e começar sua transformação na IRONFIT.

          </p>

          <a href="${link}" class="button">
            Verificar Conta
          </a>

          <div class="footer">

            Se você não criou esta conta,
            ignore este email.

          </div>

          <div class="link">
            ${link}
          </div>

        </div>

      </div>

    </body>
    </html>

    `
  });
};

export const enviarEmailRecuperacaoSenha = async (email, link) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.verify();

  await transporter.sendMail({
    from: `"IRONFIT" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Recuperação de Senha - IRONFIT",
    html: `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8" />
      <style>
        *{ margin:0; padding:0; box-sizing:border-box; }
        body{ background:#050505; font-family:Arial, Helvetica, sans-serif; color:white; }
        .container{ width:100%; padding:40px 20px; background:#050505; }
        .card{
          max-width:600px; margin:auto;
          background: linear-gradient(rgba(0,0,0,0.85), rgba(0,0,0,0.92)), url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop');
          background-size:cover; background-position:center;
          border:1px solid rgba(255,255,255,0.08); border-radius:20px;
          padding:60px 40px; text-align:center; box-shadow: 0 0 40px rgba(0,0,0,0.6);
        }
        .logo{ color:#ffe600; font-size:38px; font-weight:900; letter-spacing:2px; margin-bottom:35px; }
        .title{ color:#ffe600; font-size:38px; font-weight:900; line-height:1.1; margin-bottom:20px; text-transform:uppercase; }
        .text{ color:#d7d7d7; font-size:16px; line-height:1.7; margin-bottom:35px; }
        .button{
          display:inline-block; background:#ffe600; color:#000 !important;
          text-decoration:none; padding:18px 40px; border-radius:10px;
          font-weight:900; font-size:18px; text-transform:uppercase; letter-spacing:1px;
          box-shadow: 0 0 25px rgba(255,230,0,0.45);
        }
        .divider{ width:80px; height:4px; background:#ffe600; margin:35px auto; border-radius:20px; }
        .footer{ margin-top:40px; color:#8a8a8a; font-size:13px; line-height:1.6; }
        .link{ margin-top:30px; word-break:break-all; color:#999; font-size:12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="card">
          <div class="logo">IRONFIT</div>
          <h1 class="title">Recuperar<br>Sua Senha</h1>
          <div class="divider"></div>
          <p class="text">
            Recebemos uma solicitação para redefinir a senha da sua conta na IRONFIT.<br>
            Clique no botão abaixo para escolher uma nova senha. O link é válido por 1 hora.
          </p>
          <a href="${link}" class="button">Redefinir Senha</a>
          <div class="footer">
            Se você não solicitou a redefinição de senha, ignore este e-mail.
          </div>
          <div class="link">${link}</div>
        </div>
      </div>
    </body>
    </html>
    `
  });
};

export const enviarEmaildeContaDesativada = async (email, nome = "Atleta") => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.verify();

  await transporter.sendMail({
    from: `"IRONFIT" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Aviso de Desativação de Conta - IRONFIT",
    html: `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8" />
      <style>
        *{ margin:0; padding:0; box-sizing:border-box; }
        body{ background:#050505; font-family:Arial, Helvetica, sans-serif; color:white; }
        .container{ width:100%; padding:40px 20px; background:#050505; }
        .card{
          max-width:600px; margin:auto;
          background: linear-gradient(rgba(0,0,0,0.85), rgba(0,0,0,0.92)), url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop');
          background-size:cover; background-position:center;
          border:1px solid rgba(255,255,255,0.08); border-radius:20px;
          padding:60px 40px; text-align:center; box-shadow: 0 0 40px rgba(0,0,0,0.6);
        }
        .logo{ color:#ffe600; font-size:38px; font-weight:900; letter-spacing:2px; margin-bottom:35px; }
        .title{ color:#ffe600; font-size:36px; font-weight:900; line-height:1.1; margin-bottom:20px; text-transform:uppercase; }
        .divider{ width:80px; height:4px; background:#ffe600; margin:25px auto 35px auto; border-radius:20px; }
        .text{ color:#d7d7d7; font-size:16px; line-height:1.7; margin-bottom:25px; text-align:center; }
        .warning-box{
          background: rgba(255, 230, 0, 0.08);
          border: 1px solid rgba(255, 230, 0, 0.3);
          border-radius: 12px;
          padding: 20px;
          margin: 25px 0 35px 0;
          color: #f1f1f1;
          font-size: 14px;
          line-height: 1.6;
        }
        .button{
          display:inline-block; background:#ffe600; color:#000 !important;
          text-decoration:none; padding:16px 36px; border-radius:10px;
          font-weight:900; font-size:16px; text-transform:uppercase; letter-spacing:1px;
          box-shadow: 0 0 25px rgba(255,230,0,0.4);
        }
        .footer{ margin-top:40px; color:#8a8a8a; font-size:13px; line-height:1.6; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="card">
          <div class="logo">IRONFIT</div>
          <h1 class="title">Conta<br>Desativada</h1>
          <div class="divider"></div>
          <p class="text">
            Olá, <strong>${nome || "Atleta"}</strong>.<br><br>
            Confirmamos que sua conta vinculada ao e-mail <strong>${email}</strong> foi desativada no sistema IRONFIT.
          </p>
          <div class="warning-box">
            Seu histórico corporal, treinos e evolução foram preservados com segurança em nossa base de dados. Caso deseje reativar sua conta no futuro, basta entrar em contato com nossa equipe.
          </div>
          <p class="text" style="font-size:14px; color:#aaa;">
            Se você não solicitou esta ação ou acredita que isso foi um engano, entre em contato imediatamente com o suporte.
          </p>
          <a href="mailto:${process.env.EMAIL_USER || 'suporte@ironfit.com'}" class="button">Falar com o Suporte</a>
          <div class="footer">
            Atenciosamente,<br>
            <strong>Equipe IRONFIT</strong>
          </div>
        </div>
      </div>
    </body>
    </html>
    `
  });
};

export const enviarEmaildeContaReativada = async (email, nome = "Atleta") => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.verify();

  await transporter.sendMail({
    from: `"IRONFIT" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Sua conta foi reativada - IRONFIT",
    html: `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8" />
      <style>
        *{ margin:0; padding:0; box-sizing:border-box; }
        body{ background:#050505; font-family:Arial, Helvetica, sans-serif; color:white; }
        .container{ width:100%; padding:40px 20px; background:#050505; }
        .card{
          max-width:600px; margin:auto;
          background: linear-gradient(rgba(0,0,0,0.85), rgba(0,0,0,0.92)), url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop');
          background-size:cover; background-position:center;
          border:1px solid rgba(255,255,255,0.08); border-radius:20px;
          padding:60px 40px; text-align:center; box-shadow: 0 0 40px rgba(0,0,0,0.6);
        }
        .logo{ color:#ffe600; font-size:38px; font-weight:900; letter-spacing:2px; margin-bottom:35px; }
        .title{ color:#ffe600; font-size:36px; font-weight:900; line-height:1.1; margin-bottom:20px; text-transform:uppercase; }
        .divider{ width:80px; height:4px; background:#ffe600; margin:25px auto 35px auto; border-radius:20px; }
        .text{ color:#d7d7d7; font-size:16px; line-height:1.7; margin-bottom:25px; text-align:center; }
        .success-box{
          background: rgba(34, 197, 94, 0.10);
          border: 1px solid rgba(34, 197, 94, 0.35);
          border-radius: 12px;
          padding: 20px;
          margin: 25px 0 35px 0;
          color: #d1fae5;
          font-size: 14px;
          line-height: 1.6;
        }
        .button{
          display:inline-block; background:#ffe600; color:#000 !important;
          text-decoration:none; padding:16px 36px; border-radius:10px;
          font-weight:900; font-size:16px; text-transform:uppercase; letter-spacing:1px;
          box-shadow: 0 0 25px rgba(255,230,0,0.4);
        }
        .footer{ margin-top:40px; color:#8a8a8a; font-size:13px; line-height:1.6; }
        @media(max-width:600px){
          .card{ padding:40px 25px; }
          .title{ font-size:28px; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="card">
          <div class="logo">IRONFIT</div>
          <h1 class="title">Conta<br>Reativada!</h1>
          <div class="divider"></div>
          <p class="text">
            Olá, <strong>${nome || "Atleta"}</strong>.<br><br>
            Ótimas notícias! Sua conta vinculada ao e-mail <strong>${email}</strong> foi reativada com sucesso no sistema IRONFIT.
          </p>
          <div class="success-box">
           Seu histórico corporal, treinos e toda a sua evolução estão intactos e prontos para continuar. Basta fazer login e retomar sua jornada de onde parou!
          </div>
          <p class="text" style="font-size:14px; color:#aaa;">
            Se você não solicitou esta reativação ou acredita que isso foi um engano, entre em contato imediatamente com o suporte.
          </p>
          <a href="mailto:${process.env.EMAIL_USER || 'suporte@ironfit.com'}" class="button">Falar com o Suporte</a>
          <div class="footer">
            Bem-vindo de volta,<br>
            <strong>Equipe IRONFIT</strong>
          </div>
        </div>
      </div>
    </body>
    </html>
    `
  });
};