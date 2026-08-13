/***************************************************************
 * Importa a biblioteca Nodemailer.
 * -------------------------------------------------------------
 * O Nodemailer é uma biblioteca do Node.js utilizada para
 * realizar envio de e-mails através de servidores SMTP.
 * 
 * Neste projeto, ele será responsável por:
 * - Criar a conexão com o servidor de e-mail;
 * - Autenticar usando as credenciais do Gmail;
 * - Enviar mensagens como:
 *    • Verificação de conta;
 *    • Recuperação de senha;
 *    • Notificações;
 *    • Tokens JWT por e-mail;
 *    • Confirmações de cadastro.
 * 
 * Documentação oficial:
 * https://nodemailer.com/
 ***************************************************************/
import nodemailer from "nodemailer";


/***************************************************************
 * Cria e exporta um "transporter" do Nodemailer.
 * -------------------------------------------------------------
 * O transporter é o objeto principal responsável por:
 * - Configurar a conexão SMTP;
 * - Autenticar no servidor de e-mail;
 * - Realizar o envio das mensagens.
 * 
 * Esse objeto será reutilizado em outras partes do sistema,
 * normalmente em services como:
 * 
 * services/emailService.js
 * 
 * Exemplo de uso:
 * transporter.sendMail({...})
 ***************************************************************/
export const transporter = nodemailer.createTransport({

  /*************************************************************
   * Define o serviço de e-mail utilizado.
   * -----------------------------------------------------------
   * "gmail" informa ao Nodemailer para utilizar automaticamente
   * as configurações SMTP do Gmail.
   * 
   * SMTP do Gmail:
   * - Host: smtp.gmail.com
   * - Porta TLS: 587
   * - Porta SSL: 465
   * 
   * O Nodemailer configura isso automaticamente quando
   * utilizamos "service: gmail".
   *************************************************************/
  service: "gmail",

  /*************************************************************
   * Configuração de autenticação SMTP.
   * -----------------------------------------------------------
   * Aqui informamos as credenciais que serão usadas para
   * autenticar no servidor do Gmail.
   * 
   * IMPORTANTE:
   * Nunca coloque dados sensíveis diretamente no código.
   * 
   * Por isso utilizamos variáveis de ambiente (.env).
   *************************************************************/
  auth: {

    /***********************************************************
     * E-mail responsável pelos envios.
     * ---------------------------------------------------------
     * process.env.EMAIL_USER
     * 
     * Essa variável é carregada do arquivo .env.
     * 
     * Exemplo:
     * EMAIL_USER=meuemail@gmail.com
     * 
     * Esse será o remetente das mensagens enviadas.
     ***********************************************************/
    user: process.env.EMAIL_USER,

    /***********************************************************
     * Senha ou App Password do Gmail.
     * ---------------------------------------------------------
     * process.env.EMAIL_PASS
     * 
     * Essa variável também vem do arquivo .env.
     * 
     * Exemplo:
     * EMAIL_PASS=abcd1234senha
     * 
     * IMPORTANTE:
     * Atualmente o Gmail NÃO permite login SMTP usando
     * senha comum da conta em muitos casos.
     * 
     * O recomendado é:
     * - Ativar autenticação em 2 fatores;
     * - Criar uma App Password do Google.
     * 
     * A App Password é utilizada no lugar da senha real.
     ***********************************************************/
    pass: process.env.EMAIL_PASS
  }
});