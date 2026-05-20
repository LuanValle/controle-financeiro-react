# Controle Financeiro React

Aplicativo web de controle financeiro pessoal desenvolvido com **React** e **Firebase**.

O sistema permite que o usuário cadastre entradas e saídas, edite e exclua transações, acompanhe o saldo total, filtre movimentações, visualize relatórios por categoria, gerencie uma reserva de emergência e acompanhe seu planejamento financeiro.

## Deploy

Acesse o projeto online:

[Controle Financeiro React](COLE_AQUI_O_LINK_DA_VERCEL)

## Tecnologias utilizadas

- React
- Vite
- JavaScript
- CSS
- Firebase Authentication
- Cloud Firestore
- Vercel
- ESLint

## Funcionalidades

- Cadastro e login de usuários
- Registro de transações financeiras
- Cadastro de entradas e saídas
- Edição de transações
- Exclusão de transações
- Filtro de transações por tipo
- Cálculo automático do saldo total
- Relatório de gastos por categoria
- Cálculo percentual de gastos por categoria
- Gerenciamento de reserva de emergência
- Planejamento financeiro
- Proteção dos dados por usuário autenticado

## Conceitos praticados

Durante o desenvolvimento deste projeto, pratiquei conceitos importantes de React, como criação de componentes, uso de estados com `useState`, comunicação entre componentes por meio de props e organização da aplicação em partes menores.

Também pratiquei operações de CRUD com o Cloud Firestore, implementando cadastro, listagem, edição e exclusão de transações financeiras. Além disso, integrei autenticação com Firebase Authentication, relacionei os dados ao usuário logado e configurei regras de segurança no Firestore para proteger as informações de cada usuário.

Outro ponto importante foi a organização do código. Algumas regras e funções auxiliares foram separadas em arquivos próprios dentro da pasta `utils`, facilitando a leitura, manutenção e evolução do projeto.

## Estrutura do projeto

```txt
src/
├── components/
├── services/
├── utils/
│   ├── calcularSaldo.js
│   ├── criarDadosData.js
│   ├── filtrarTransacoes.js
│   ├── formatarDinheiro.js
│   └── obterCategoriaPadrao.js
├── App.jsx
├── firebase.js
└── main.jsx
```

## Organização das funções utilitárias

Algumas regras e operações auxiliares foram separadas em arquivos próprios para reduzir responsabilidades dentro do `App.jsx`.

Exemplos:

- `formatarDinheiro`: formata valores para moeda brasileira.
- `calcularSaldo`: calcula o saldo total com base nas entradas e saídas.
- `filtrarTransacoes`: filtra transações por tipo.
- `criarDadosData`: cria os campos de data, dia, mês e ano para uma transação.
- `obterCategoriaPadrao`: define a categoria inicial conforme o tipo da transação.

## Segurança

O projeto utiliza Firebase Authentication para autenticação de usuários e Cloud Firestore para persistência dos dados.

As regras de segurança do Firestore foram configuradas para que cada usuário autenticado acesse apenas seus próprios dados.

Lógica aplicada:

```txt
Usuário logado → acessa apenas suas próprias transações
Usuário deslogado → não acessa os dados
Reserva de emergência → vinculada ao documento do próprio usuário
```

## Variáveis de ambiente

O projeto utiliza variáveis de ambiente para armazenar as configurações do Firebase.

Crie um arquivo `.env` na raiz da pasta `treino-react`, com base no arquivo `.env.example`.

Exemplo:

```env
VITE_FIREBASE_API_KEY=sua_api_key_aqui
VITE_FIREBASE_AUTH_DOMAIN=seu_auth_domain_aqui
VITE_FIREBASE_PROJECT_ID=seu_project_id_aqui
VITE_FIREBASE_STORAGE_BUCKET=seu_storage_bucket_aqui
VITE_FIREBASE_MESSAGING_SENDER_ID=seu_messaging_sender_id_aqui
VITE_FIREBASE_APP_ID=seu_app_id_aqui
```

Observação: o arquivo `.env` não deve ser enviado para o GitHub.

## Como executar o projeto

### Pré-requisitos

Antes de começar, é necessário ter instalado:

- Node.js
- npm

### Passos

Clone o repositório:

```bash
git clone https://github.com/LuanValle/controle-financeiro-react.git
```

Acesse a pasta do projeto:

```bash
cd controle-financeiro-react/treino-react
```

Instale as dependências:

```bash
npm install
```

Execute o projeto em modo de desenvolvimento:

```bash
npm run dev
```

Depois, abra no navegador o endereço exibido no terminal.

## Scripts disponíveis

Dentro da pasta `treino-react`, você pode executar:

```bash
npm run dev
```

Executa o projeto em modo de desenvolvimento.

```bash
npm run build
```

Gera a versão de produção do projeto.

```bash
npm run preview
```

Executa localmente uma prévia da versão de produção.

```bash
npm run lint
```

Executa a verificação de padrões do código com ESLint.

## Status do projeto

Projeto em desenvolvimento e melhoria contínua.

Melhorias planejadas:

- Adicionar prints do sistema ao README
- Melhorar validações dos formulários
- Substituir `alert()` por mensagens visuais na interface
- Criar testes para funções utilitárias
- Melhorar organização interna com hooks customizados
- Implementar navegação por mês nos relatórios
- Melhorar responsividade e experiência do usuário

## Autor

Desenvolvido por **Luan Valle**.