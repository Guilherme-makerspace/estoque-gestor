# 📋 Guia Amigável dos Endpoints da API

Olá! Bem-vindo ao guia dos endpoints da nossa API de controle de estoque. Aqui você vai encontrar tudo o que precisa saber para usar a API, como se estivesse conversando com um amigo. Vamos gerenciar produtos, controlar entradas e saídas de estoque, ver alertas e fazer login/logout de forma simples. Tudo responde em JSON, que é um formato fácil de entender.

## 🏠 Principais Endpoints (as "portas" da API)

Aqui vai uma tabela bem simples com tudo o que você precisa saber sobre cada endpoint. Pense neles como ferramentas que você usa no dia a dia:

| Método | Rota | O que faz? | O que enviar? | O que volta se der certo? | E se der errado? |
|--------|------|------------|---------------|---------------------------|------------------|
| `GET` | `/api` | Mostra todas as rotas disponíveis, tipo um mapa da API. | Nada | Um JSON simples com as rotas | Não costuma dar erro |
| `GET` | `/produtos` | Lista todos os produtos que você cadastrou. | Nada | Uma lista de produtos, como `[{ "produto_id": 1, "nome": "Sabão em Pó", ... }]` | `{ "msg": "Erro ao obter produtos." }` (500) |
| `GET` | `/alertas` | Mostra produtos que estão com pouco estoque, para você repor. | Nada | `{ "alertas": [{ "nome": "Sabão em Pó", "estoque": 5, "estoque_minimo": 10 }] }` | `{ "msg": "Erro ao obter alertas." }` (500) |
| `POST` | `/produtos` | Cadastra um novo produto no sistema. | `{ "nome": "Sabão em Pó", "marca": "Limpa Tudo", "volume": "1kg", "tipo_embalagem": "Papel", "aplicacao": "Roupa", "estoque": 50, "estoque_minimo": 10 }` | `{ "msg": "Cadastro Efetuado" }` | `{ "msg": "Todos os campos são obrigatórios." }` (400) ou `{ "msg": "Cadastro não efetuado" }` (500) |
| `PUT` | `/estoque/entrada` | Registra quando entra mais produto no estoque (tipo, comprou mais). | `{ "produto_id": 1, "tipo": "Compra", "quantidade": 20 }` | `{ "msg": "Entrada registrada com sucesso." }` | `{ "msg": "produto_id, tipo e quantidade são obrigatórios." }` (400) ou `{ "msg": "Erro ao registrar entrada." }` (500) |
| `PUT` | `/estoque/saida` | Registra quando sai produto do estoque (tipo, vendeu). | `{ "produto_id": 1, "tipo": "Venda", "quantidade": 5 }` | `{ "msg": "Saída registrada com sucesso." }` | `{ "msg": "produto_id, tipo e quantidade são obrigatórios." }` (400) ou `{ "msg": "Erro ao registrar saída." }` (500) |
| `POST` | `/login` | Faz login no sistema com usuário e senha. | `{ "usuario": "admin", "senha": "minha_senha" }` | Vai para a página inicial | Vai para a página de login |
| `POST` | `/logout` | Sai do sistema, encerrando a sessão. | Nada | Vai para a página de login | Não costuma dar erro |

## 🌐 Páginas do Site (servidas pela API)

Esses endpoints são para acessar as páginas do site, como se fossem links normais. Eles verificam se você está logado:

| Método | Rota | O que faz? | O que volta? |
|--------|------|------------|-------------|
| `GET` | `/login` | Mostra a página para fazer login. | A página `login.html` |
| `GET` | `/` | Página principal do sistema (só se estiver logado). | `index.html` ou vai para login se não estiver logado |
| `GET` | `/Cadastro` | Página para cadastrar produtos (só se estiver logado). | `cadastro.html` ou vai para login |
| `GET` | `/Alertas` | Página com alertas de estoque baixo (só se estiver logado). | `alertas.html` ou vai para login |
| `GET` | `/Estoque` | Página para gerenciar entradas/saídas de estoque (só se estiver logado). | `estoque.html` ou vai para login |

## 🔒 Como Funciona o Login

- A API usa "sessões" para saber quem está logado, tipo um crachá invisível.
- Para entrar, use `POST /login` com seu usuário e senha (que ficam guardados em um arquivo secreto chamado `.env`).
- Para sair, use `POST /logout` e a sessão acaba.
- Se tentar acessar algo sem estar logado, vai ser redirecionado para o login automaticamente.

## 📝 Dicas Gerais

- Quase todos os endpoints da API precisam que você esteja logado (exceto `/api` e `/login`).
- A API checa se você preencheu tudo certo: campos obrigatórios, números positivos, etc.
- Se algo der errado, ela avisa com códigos de erro (400 para dados ruins, 500 para problemas internos).
- A API roda na porta 3001 e aceita conexões de qualquer lugar.

Se quiser ver o código por trás disso tudo, dá uma olhada no arquivo `api/server.js`.
