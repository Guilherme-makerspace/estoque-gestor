# 📋 O Que o Sistema de Controle de Estoque Faz (Requisitos Funcionais)

Olá! Este documento explica de forma simples o que o nosso sistema de controle de estoque precisa fazer. É como uma lista de tarefas que o sistema deve cumprir para funcionar bem. Baseado no código que já temos, vamos ver cada parte do sistema, como se estivesse explicando para um amigo.

## 🎯 O Que É Esse Sistema?

Imagine um sistema web onde você pode controlar o estoque de produtos, como em uma loja ou depósito. Ele tem uma parte visual (páginas web) e uma parte invisível (API) que conversa com um banco de dados MySQL. Você pode cadastrar produtos, ver quando entra ou sai mercadoria, receber alertas quando falta produto e tudo isso de forma segura, com login.

## 📋 Lista de Coisas Que o Sistema Deve Fazer

### 1. **Login e Segurança (Autenticação)**
   - **RF01**: Deixe as pessoas entrarem no sistema com usuário e senha fixos.
   - **RF02**: Mantenha a pessoa logada enquanto ela usa o sistema (tipo uma sessão ativa).
   - **RF03**: Permita sair do sistema, acabando com a sessão.
   - **RF04**: Se alguém tentar acessar páginas sem estar logado, mande para a tela de login.

### 2. **Cuidar dos Produtos**
   - **RF05**: Permita cadastrar novos produtos com todas as informações: nome, marca, volume, tipo de embalagem, para que serve, quanto tem em estoque agora e qual é o mínimo que deve ter.
   - **RF06**: Verifique se tudo foi preenchido no cadastro, não deixe campos vazios.
   - **RF07**: Garanta que os números de estoque sejam positivos (não pode ter -5 sabões).
   - **RF08**: Mostre uma lista de todos os produtos cadastrados.

### 3. **Controlar Entradas e Saídas de Estoque**
   - **RF09**: Permita registrar quando entra mais produto no estoque (tipo, comprou mais).
   - **RF10**: Permita registrar quando sai produto do estoque (tipo, vendeu).
   - **RF11**: Atualize automaticamente o estoque atual quando entra ou sai produto.
   - **RF12**: Guarde um histórico de todas as entradas e saídas em uma tabela separada.
   - **RF13**: Verifique se as quantidades são positivas (não pode sair -10 unidades).

### 4. **Alertas Inteligentes**
   - **RF14**: Avise automaticamente quando um produto está com estoque abaixo do mínimo.
   - **RF15**: Mostre uma lista dos produtos em alerta, com nome, estoque atual e mínimo.

### 5. **Páginas Web (Interface)**
   - **RF16**: Tenha páginas HTML para login, tela inicial, cadastrar produtos, ver alertas e gerenciar estoque.
   - **RF17**: Sirva os arquivos de estilo (CSS), scripts (JS) e imagens para o site funcionar bonito.
   - **RF18**: Redirecione as pessoas corretamente entre as páginas, dependendo se estão logadas ou não.

### 6. **API (a Parte Técnica Invisível)**
   - **RF19**: Tenha "portas" (endpoints) para todas as operações principais, como pegar dados (GET), criar (POST) e atualizar (PUT).
   - **RF20**: Todas as respostas da API sejam em JSON, um formato fácil de entender.
   - **RF21**: Trate erros direito, dizendo o que deu errado com códigos e mensagens claras.
   - **RF22**: Verifique se os dados enviados estão corretos antes de processar.

## 🏗️ Como o Sistema É Feito (Arquitetura)

- **Parte de Trás (Backend)**: Usa Node.js com Express.js para criar a API.
- **Banco de Dados**: MySQL para guardar tudo de forma organizada.
- **Parte da Frente (Frontend)**: Páginas HTML simples, com CSS para deixar bonito e JavaScript para interagir.
- **Segurança**: Sessões com express-session para controlar quem está logado.
- **Configurações Secretas**: Um arquivo `.env` para guardar senhas e dados sensíveis.

## 📊 Como os Dados São Guardados

O sistema usa duas "caixas" principais no banco:
- **produto**: Guarda tudo sobre os produtos (código, nome, marca, volume, embalagem, uso, estoque atual, estoque mínimo).
- **movimentacao**: Registra cada entrada ou saída (qual produto, tipo de movimento, quantidade, quando aconteceu).

## 🔄 Como as Pessoas Usam o Sistema

1. **Cadastrar Produto**: Pessoa loga → Vai para página de cadastro → Preenche os dados → Clica em salvar → Produto fica guardado no banco.
2. **Mover Estoque**: Pessoa loga → Vai para página de estoque → Escolhe produto → Registra entrada ou saída → Estoque muda e fica registrado no histórico.
3. **Ver Alertas**: Pessoa loga → Vai para página de alertas → Vê lista de produtos que precisam ser repostos.

## ✅ Como Saber Se Está Tudo Certo

- Todos os endpoints da API devem funcionar e dar as respostas certas.
- Validações devem impedir cadastros ou movimentos errados.
- Sessões devem durar enquanto a pessoa navega.
- Alertas devem aparecer automaticamente quando o estoque fica baixo.
- O site deve funcionar bem em navegadores modernos e se adaptar ao tamanho da tela.

Se quiser ver como isso tudo foi implementado, olhe os arquivos `api/server.js` e as páginas em `frontend/`.
u
