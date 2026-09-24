import { Platform } from 'react-native';

/**
 * CONFIGURAÇÃO DE REDE DA API IRONFIT
 * 
 * - Emulador Android: utiliza 10.0.2.2 (alias do Android para o localhost do host).
 * - iOS Simulator / Web: utiliza localhost:3000.
 * - Dispositivo físico (Expo Go via Wi-Fi): preencha MANUAL_API_URL com o IP local da sua máquina,
 *   por exemplo: 'http://192.168.1.50:3000'
 */

// Se você estiver rodando no celular físico via Expo Go, insira o IP do seu computador na rede abaixo:
export const MANUAL_API_URL = ''; 

function getBaseUrl() {
  if (MANUAL_API_URL && MANUAL_API_URL.trim() !== '') {
    return MANUAL_API_URL.trim().replace(/\/+$/, '');
  }

  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3000';
  }

  return 'http://localhost:3000';
}

export const API_BASE_URL = getBaseUrl();
