import { 
  criptografar, 
  descriptografar, 
  criptografarId, 
  descriptografarId, 
  validarUUID, 
  gerarHashSHA256 
} from "./src/utils/cryptoUtils.js";
import { Usuario } from "./src/models/Usuarios.js";
import { DadosCorporais } from "./src/models/DadosCorporais.js";
import { Treino } from "./src/models/Treino.js";
import { Calculo } from "./src/models/Calculo.js";
import { Exercicio } from "./src/models/Exercicios.js";
import { anexarIdsCriptografados } from "./src/middlewares/tratarIdsCriptografados.js";
import crypto from "crypto";

console.log("=== INICIANDO TESTES DE SEGURANÇA, UUID E CRIPTOGRAFIA ===");

let erros = 0;

function assert(condicao, nomeTeste) {
  if (condicao) {
    console.log(`[PASS] ${nomeTeste}`);
  } else {
    console.error(`[FAIL] ${nomeTeste}`);
    erros++;
  }
}

// 1. TESTES DE CRIPTOGRAFIA AES-256-GCM
console.log("\n--- Testes de Criptografia AES-256-GCM ---");
const textoOriginal = "dado_ultra_secreto_de_saude_corporal_2026";
const cifrado = criptografar(textoOriginal);
const decifrado = descriptografar(cifrado);

assert(cifrado !== textoOriginal, "Texto cifrado deve ser diferente do original");
assert(decifrado === textoOriginal, "Texto decifrado deve ser exatamente igual ao original");
assert(descriptografar("dado_invalido_adulterado") === null, "Dados adulterados devem retornar null com falha de autenticação");

// 2. TESTES DE UUID E CIFRA DE ID
console.log("\n--- Testes de UUID e Cifra de IDs ---");
const uuidTeste = crypto.randomUUID();
assert(validarUUID(uuidTeste), "validarUUID deve aceitar UUID v4 válido");
assert(!validarUUID("12345"), "validarUUID deve rejeitar inteiro simples");
assert(!validarUUID("admin' OR '1'='1"), "validarUUID deve rejeitar SQL injection");

const idCifrado = criptografarId(uuidTeste);
assert(idCifrado !== uuidTeste, "ID cifrado não deve expor o UUID original");
const idRestaurado = descriptografarId(idCifrado);
assert(idRestaurado === uuidTeste, "ID decifrado deve retornar o UUID original intacto");
assert(descriptografarId(uuidTeste) === uuidTeste, "descriptografarId deve aceitar UUID puro como fallback transparente");

// 3. TESTES DOS MODELS DE DOMÍNIO COM UUID
console.log("\n--- Testes de Validação de Models com UUID ---");

try {
  const usuario = new Usuario("Maria Silva", "maria@email.com", "$2b$10$abcdefghijklmnopqrstuvwxyz12345678901234567890123456", "1995-05-10", true, true, null, null, null, 0, uuidTeste);
  assert(usuario.id === uuidTeste, "Usuario deve aceitar UUID válido");
} catch (e) {
  assert(false, `Falha ao instanciar Usuario: ${e.message}`);
}

try {
  new Usuario("Erro", "erro@email.com", "$2b$10$abcdefghijklmnopqrstuvwxyz12345678901234567890123456", "1995-05-10", true, true, null, null, null, 0, "123");
  assert(false, "Usuario deve rejeitar ID não-UUID");
} catch (e) {
  assert(true, "Usuario rejeitou ID inválido corretamente");
}

try {
  const dados = DadosCorporais.criar({
    idUsuario: uuidTeste,
    peso_kg: 70.5,
    altura_cm: 175,
    genero: "Feminino",
    idade: 28,
    nivel_atividade: "Moderado"
  });
  assert(dados.idUsuario === uuidTeste, "DadosCorporais deve aceitar idUsuario como UUID");
} catch (e) {
  assert(false, `Falha em DadosCorporais.criar: ${e.message}`);
}

try {
  const exercicio = Exercicio.criar({
    nome: "Supino Reto",
    descricao: "Peitoral",
    caminho_video: null
  });
  assert(exercicio.nome === "Supino Reto", "Exercicio criado com sucesso");
} catch (e) {
  assert(false, `Falha em Exercicio.criar: ${e.message}`);
}

// 4. TESTES DE ANEXAR IDS CRIPTOGRAFADOS
console.log("\n--- Teste de Anexar IDs Criptografados ---");
const payloadResposta = {
  id: uuidTeste,
  idUsuario: crypto.randomUUID(),
  nome: "Exemplo",
  dados: {
    idTreino: crypto.randomUUID()
  }
};

const payloadSeguro = anexarIdsCriptografados(payloadResposta);
assert(payloadSeguro.id_criptografado !== undefined, "Deve gerar id_criptografado na resposta");
assert(payloadSeguro.idUsuario_criptografado !== undefined, "Deve gerar idUsuario_criptografado na resposta");
assert(descriptografarId(payloadSeguro.id_criptografado) === uuidTeste, "id_criptografado deve ser decifrável para o UUID original");

// 5. RESUMO FINAL
console.log("\n=================================================");
if (erros === 0) {
  console.log(" TODOS OS TESTES PASSARAM COM SUCESSO! MÁXIMA SEGURANÇA GARANTIDA.");
} else {
  console.error(`❌ ${erros} TESTE(S) FALHARAM.`);
}
console.log("=================================================");
