Não alterei nenhum arquivo. Abaixo está a documentação do backend, pronta para ser copiada para um `README.md` ou arquivo de documentação.

# Sistema Computacional de Análise Corporal — Backend

API REST responsável pelo cadastro e autenticação de usuários, registro de dados corporais, cálculos físicos, acompanhamento de evolução, exercícios e treinos.

## Tecnologias

- Node.js com ES Modules
- Express 5
- Prisma ORM
- MySQL
- JWT para autenticação
- bcrypt para hash de senhas
- Nodemailer para e-mails de verificação e recuperação
- CORS

## Execução

No diretório `producaoBack`:

```bash
npm install
npm run dev
```

Ou, em produção:

```bash
npm start
```

A aplicação inicia na porta definida por `PORT` ou, se ausente, na porta `3000`.

```text
http://localhost:3000
```

## Variáveis de ambiente

Crie um arquivo `.env` no diretório `producaoBack`.

```env
PORT=3000
DATABASE_URL="mysql://USUARIO:SENHA@localhost:3306/NOME_DO_BANCO"
JWT_SECRET="uma-chave-secreta-forte"
FRONT_URL="http://localhost:5173"

EMAIL_USER="seu-email@gmail.com"
EMAIL_PASS="sua-app-password"
EMAIL_TOKEN_EXPIRATION_MINUTES=5
NODE_ENV="development"
```

> `EMAIL_PASS` deve ser uma senha de aplicativo do Gmail, e não a senha normal da conta.

## Autenticação

As rotas protegidas exigem o cabeçalho:

```http
Authorization: Bearer <token_jwt>
```

O token é retornado após um login bem-sucedido e expira em 24 horas.

## Rotas gerais

| Método | Rota | Protegida | Descrição |
|---|---|---:|---|
| GET | `/` | Não | Confirma que a API está ativa |
| GET | `/perfil` | Sim | Rota de teste que retorna o usuário presente no token |

## Autenticação e usuários

### `POST /auth/register`

Cria um usuário e envia um e-mail de verificação.

```json
{
  "nome": "João Silva",
  "email": "joao@email.com",
  "senha": "senha-segura",
  "data_nascimento": "2000-05-15"
}
```

### `POST /auth/login`

Autentica um usuário cujo e-mail já foi verificado.

```json
{
  "email": "joao@email.com",
  "senha": "senha-segura"
}
```

Após tentativas consecutivas de login inválidas, a conta pode ser bloqueada temporariamente por 15 minutos.

### `GET /auth/verificar-email?token=<token>`

Confirma o e-mail do usuário usando o token enviado no cadastro.

### `POST /auth/reenviar-email`

Reenvia o e-mail de verificação.

```json
{
  "email": "joao@email.com"
}
```

### `POST /auth/solicitar-recuperacao`

Solicita o envio de um link para redefinição de senha.

```json
{
  "email": "joao@email.com"
}
```

O token de recuperação é válido por uma hora.

### `POST /auth/redefinir-senha`

Redefine a senha usando o token enviado por e-mail.

```json
{
  "token": "token_recebido_por_email",
  "novaSenha": "nova-senha-segura"
}
```

A nova senha deve ter pelo menos seis caracteres.

### `GET /auth/me`

Retorna os detalhes do usuário autenticado.

### `POST /auth/alterar-senha`

Altera a senha do usuário autenticado.

```json
{
  "senhaAtual": "senha-antiga",
  "novaSenha": "nova-senha-segura"
}
```

### `GET /usuarios`

Lista todos os usuários.

### `GET /usuarios?id=1`

Busca um usuário específico pelo identificador.

## Dados corporais e cálculos

### `POST /dadosCorporais`

Cria os dados corporais de um usuário. Um usuário pode possuir apenas um registro atual de dados corporais.

```json
{
  "idUsuario": 1,
  "peso_kg": 75.5,
  "altura_cm": 175,
  "genero": "Masculino",
  "idade": 25,
  "nivel_atividade": "Moderado"
}
```

### `GET /dadosCorporais`

Lista todos os registros de dados corporais, incluindo cálculos e treinos associados.

### `GET /dadosCorporais/:id`

Busca dados corporais pelo identificador do registro (`idDados`).

### `GET /dadosCorporais/usuario/:id`

Busca os dados corporais atuais pelo identificador do usuário (`idUsuario`).

### `PUT /dadosCorporais/:idUsuario`

Atualiza os dados corporais do usuário e gera um novo cálculo e novo item no histórico corporal.

```json
{
  "peso_kg": 73,
  "altura_cm": 175,
  "genero": "Masculino",
  "idade": 25,
  "nivel_atividade": "Intenso"
}
```

### `DELETE /dadosCorporais`

Rota declarada para remoção dos dados corporais. A intenção é remover o registro pelo `idUsuario`.

## Cálculos realizados

A API gera automaticamente:

- IMC: `peso / altura²`
- TMB: fórmula que calcula quantas calurias a pessoa gasta em repouso
- NDC: TMB multiplicada pelo nível de atividade
- Classificação do IMC
- Meta diária de água: `35 ml × peso`
- Distribuição de macronutrientes:
  - Proteínas: 30% das calorias
  - Carboidratos: 40% das calorias
  - Gorduras: 30% das calorias

Valores aceitos:

| Campo | Valores |
|---|---|
| `genero` | `Masculino`, `Feminino`, `Outro` |
| `nivel_atividade` | `Sedentario`, `Leve`, `Moderado`, `Intenso`, `MuitoIntenso` |

Validações:

- Peso: maior que 0 e até 500 kg
- Altura: maior que 0 e até 300 cm
- Idade: de 1 a 130 anos

## Histórico e evolução

### `GET /historico/usuario/:id`

Retorna o histórico corporal de um usuário, usado para acompanhar alterações de peso, altura, IMC, TMB e NDC.

### `GET /evolucao/:id`

Retorna os dados de evolução corporal de um usuário, preparados para exibição em gráficos.

## Exercícios

Todas as rotas de exercícios exigem autenticação JWT.

| Método | Rota | Descrição |
|---|---|---|
| POST | `/exercicios` | Cria um exercício |
| GET | `/exercicios` | Lista exercícios por nome |
| GET | `/exercicios/:idExercicio` | Busca exercício por ID |
| PUT | `/exercicios/:idExercicio` | Atualiza exercício |
| DELETE | `/exercicios/:idExercicio` | Remove exercício |

Validações:

- `nome`: entre 2 e 150 caracteres
- `descricao`: opcional, até 255 caracteres
- `caminho_video`: opcional, até 255 caracteres

## Treinos

Todas as rotas de treinos exigem autenticação JWT. A API utiliza o usuário extraído do token para garantir que cada pessoa acesse apenas os próprios treinos.

| Método | Rota | Descrição |
|---|---|---|
| POST | `/treinos` | Cria um treino |
| GET | `/treinos` | Lista os treinos do usuário autenticado |
| GET | `/treinos/:idTreino` | Busca um treino |
| PUT | `/treinos/:idTreino` | Atualiza um treino |
| DELETE | `/treinos/:idTreino` | Remove um treino |

Valores aceitos:

| Campo | Valores |
|---|---|
| `objetivo` | `Hipertrofia`, `Emagrecimento`, `Resistencia`, `Condicionamento` |
| `nivel` | `Iniciante`, `Intermediario`, `Avancado` |

O `idCalculo` informado deve pertencer ao usuário autenticado.

## Exercícios de um treino

Todas as rotas exigem autenticação JWT.

| Método | Rota | Descrição |
|---|---|---|
| POST | `/treinoExercicio/:idTreino/exercicios` | Adiciona um ou mais exercícios ao treino |
| GET | `/treinoExercicio/:idTreino/exercicios` | Lista exercícios de um treino |
| PUT | `/treinoExercicio/:idTreino/exercicios/:idExercicio` | Atualiza a configuração de um exercício |
| DELETE | `/treinoExercicio/:idTreino/exercicios/:idExercicio` | Remove um exercício do treino |

Também é possível enviar um array com vários exercícios no `POST`.

Valores aceitos para `tipo`:

```text
Forca
Cardio
Alongamento
Mobilidade
```

Um exercício não pode ser associado mais de uma vez ao mesmo treino.

## Códigos de resposta mais comuns

| Código | Significado |
|---:|---|
| `200` | Operação realizada com sucesso |
| `201` | Recurso criado |
| `400` | Dados inválidos ou erro de regra de negócio |
| `401` | Token ausente ou usuário não autenticado |
| `403` | Token inválido, expirado ou acesso negado |
| `404` | Recurso não encontrado |
| `429` | Conta bloqueada temporariamente por tentativas inválidas |
| `500` | Erro interno do servidor |
