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