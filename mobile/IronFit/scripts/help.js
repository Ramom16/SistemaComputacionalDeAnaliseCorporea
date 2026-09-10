/**
 * Script de Ajuda e Tutorial - IronFit Mobile
 * Executado via: npm run help
 */

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  red: '\x1b[31m',
};

const divider = `${colors.cyan}═════════════════════════════════════════════════════════════════════${colors.reset}`;
const subDivider = `${colors.dim}---------------------------------------------------------------------${colors.reset}`;

console.log(`\n${divider}`);
console.log(`${colors.bright}${colors.green}                 IRONFIT MOBILE - GUIA DE COMANDOS                ${colors.reset}`);
console.log(`${divider}\n`);

console.log(`${colors.bright}${colors.yellow}1.  COMO RODAR E TESTAR O APLICATIVO (DESENVOLVIMENTO)${colors.reset}`);
console.log(`${subDivider}`);
console.log(`   ${colors.green}npm start${colors.reset}       Inicia o servidor Expo.`);
console.log(`   ${colors.green}npm run android${colors.reset} Inicia e tenta abrir no emulador Android.`);
console.log(`   ${colors.green}npm run ios${colors.reset}     Inicia e tenta abrir no simulador iOS (somente macOS).`);
console.log(`   ${colors.green}npm run web${colors.reset}     Inicia a versão Web no navegador.`);
console.log(`\n   ${colors.bright} Como testar no celular físico:${colors.reset}`);
console.log(`   1. Instale o app ${colors.cyan}Expo Go${colors.reset} na Play Store ou App Store.`);
console.log(`   2. Conecte o celular na ${colors.yellow}mesma rede Wi-Fi${colors.reset} do computador.`);
console.log(`   3. Execute ${colors.green}npm start${colors.reset} e escaneie o QR Code com a câmera ou Expo Go.`);
console.log(`   4. Atalhos no terminal: [r] Recarrega o app | [m] Abre menu de desenvolvedor.\n`);

console.log(`${colors.bright}${colors.yellow}2.   CONFIGURAÇÃO PARA GERAR O APK (EAS BUILD)${colors.reset}`);
console.log(`${subDivider}`);
console.log(`   O projeto utiliza o serviço EAS (Expo Application Services) para builds.`);
console.log(`\n   ${colors.bright}Passo a Passo inicial (necessário apenas na primeira vez):${colors.reset}`);
console.log(`   ${colors.green}npm run apk_config_install${colors.reset}`);
console.log(`   ${colors.dim}↳ Instala o EAS CLI globalmente e solicita o login da conta Expo.${colors.reset}`);
console.log(`\n   ${colors.dim}Ou faça manualmente:${colors.reset}`);
console.log(`   • Criar conta gratuita em: ${colors.cyan}https://expo.dev${colors.reset}`);
console.log(`   • Instalar CLI: ${colors.cyan}npm install -g eas-cli${colors.reset}`);
console.log(`   • Fazer login:  ${colors.cyan}eas login${colors.reset}`);
console.log(`   • Vincular projeto: ${colors.cyan}eas project:init${colors.reset} (se for a primeira vez)\n`);

console.log(`${colors.bright}${colors.yellow}3.  COMO GERAR O APK (BUILD DE PRODUÇÃO/TESTE)${colors.reset}`);
console.log(`${subDivider}`);
console.log(`   Para gerar o arquivo instalável (.apk) para Android:`);
console.log(`\n   ${colors.bright}${colors.green}npm run apk${colors.reset}`);
console.log(`   ${colors.dim}↳ Executa: eas build --platform android --profile preview${colors.reset}`);
console.log(`\n   ${colors.bright}O que acontece após rodar o comando:${colors.reset}`);
console.log(`   1. O EAS compila o app nos servidores da Expo.`);
console.log(`   2. Um link com o progresso será exibido no terminal.`);
console.log(`   3. Ao finalizar, você receberá um ${colors.cyan}link direto e um QR Code${colors.reset} para`);
console.log(`      baixar e instalar o .apk diretamente no celular Android!\n`);

console.log(`${divider}\n`);
