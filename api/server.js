// Instalando e utilizando pacotes

const dotenv = require('dotenv').config();
const express = require('express');
const app = express();
const session = require('express-session');
const mysql = require('mysql2/promise');
const path = require('path');

// CREATE USER 'admin'@'%' IDENTIFIED BY 'estoqueadmin123';
// GRANT ALL PRIVILEGES ON controle_de_estoque.* TO 'admin'@'%';
// FLUSH PRIVILEGES;

const PORT = 3001;
app.listen(PORT, '0.0.0.0');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../frontend')));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));

// Criando conexão com o banco de dados

const conn = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

// Serve frontend

app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/login.html'));
});

app.get('/', (req, res) => {
    if (req.session && req.session.usuario) {
        res.sendFile(path.join(__dirname, '../frontend/index.html'));
    } else {
        res.redirect("/login");
    }
});

app.get('/Cadastro', (req, res) => {
    if (req.session && req.session.usuario) {
        res.sendFile(path.join(__dirname, '../frontend/cadastro.html'));
    } else {
        res.redirect("/login");
    }
});

app.get('/Alertas', (req, res) => {
    if (req.session && req.session.usuario) {
        res.sendFile(path.join(__dirname, '../frontend/alertas.html'));
    } else {
        res.redirect("/login");
    }
});

app.get('/Estoque', (req, res) => {
    if (req.session && req.session.usuario) {
        res.sendFile(path.join(__dirname, '../frontend/estoque.html'));
    } else {
        res.redirect("/login");
    }
});

// GETs
app.get("/api", (req, res) => {
    res.json({
        "/": "GET - Obtem todas as rotas disponiveis"
    });
});

app.get("/produtos", async (req, res) => {
    try {
        const [rows] = await conn.query("SELECT * FROM produto;");
        res.json(rows);
    } catch (error) {
        console.error("Erro ao obter produtos:", error);
        res.status(500).json({ msg: "Erro ao obter produtos." });
    }
});

app.get("/alertas", async (req, res) => {
    try {
        const [rows] = await conn.query("SELECT nome, estoque, estoque_minimo FROM produto WHERE estoque < estoque_minimo;");
        res.json({ alertas: rows });
    } catch (error) {
        console.error("Erro ao obter alertas:", error);
        res.status(500).json({ msg: "Erro ao obter alertas." });
    }
});

// POSTs

// Cadastrar produto
app.post("/produtos", async (req, res) => {
    const { nome, marca, volume, tipo_embalagem, aplicacao, estoque, estoque_minimo } = req.body;

    // Validação básica
    if (!nome || !marca || !volume || !tipo_embalagem || !aplicacao || estoque === undefined || estoque_minimo === undefined) {
        return res.status(400).json({ msg: "Todos os campos são obrigatórios." });
    }
    if (estoque < 0 || estoque_minimo < 0) {
        return res.status(400).json({ msg: "Estoque e estoque mínimo devem ser positivos." });
    }

    const cadastrar = "INSERT INTO produto (nome, marca, volume, tipo_embalagem, aplicacao, estoque, estoque_minimo) VALUES (?, ?, ?, ?, ?, ?, ?);";

    try {
        await conn.query(cadastrar, [nome, marca, volume, tipo_embalagem, aplicacao, estoque, estoque_minimo]);
        res.json({ msg: "Cadastro Efetuado" });
    } catch (error) {
        console.error("Erro ao cadastrar produto:", error);
        res.status(500).json({ msg: "Cadastro não efetuado" });
    }
});

// PUTs

// Entrada - para registrar entrada
app.put("/estoque/entrada", async (req, res) => {
    const { produto_id, tipo, quantidade } = req.body;

    // Validação básica
    if (!produto_id || !tipo || quantidade === undefined) {
        return res.status(400).json({ msg: "produto_id, tipo e quantidade são obrigatórios." });
    }
    if (quantidade <= 0) {
        return res.status(400).json({ msg: "Quantidade deve ser positiva." });
    }

    const adicionar = "UPDATE produto SET estoque = estoque + ? WHERE produto_id = ?;";
    const registrarMovimentacao = "INSERT INTO movimentacao (produto_id, tipo, quantidade) VALUES (?, ?, ?);";

    try {
        await conn.query(adicionar, [quantidade, produto_id]);
        await conn.query(registrarMovimentacao, [produto_id, tipo, quantidade]);
        res.json({ msg: "Entrada registrada com sucesso." });
    } catch (error) {
        console.error("Erro ao registrar entrada:", error);
        res.status(500).json({ msg: "Erro ao registrar entrada." });
    }
});

// Saída - para registrar saída
app.put("/estoque/saida", async (req, res) => {
    const { produto_id, tipo, quantidade } = req.body;

    // Validação básica
    if (!produto_id || !tipo || quantidade === undefined) {
        return res.status(400).json({ msg: "produto_id, tipo e quantidade são obrigatórios." });
    }
    if (quantidade <= 0) {
        return res.status(400).json({ msg: "Quantidade deve ser positiva." });
    }

    const diminuir = "UPDATE produto SET estoque = estoque - ? WHERE produto_id = ?;";
    const registrarMovimentacao = "INSERT INTO movimentacao (produto_id, tipo, quantidade) VALUES (?, ?, ?);";

    try {
        await conn.query(diminuir, [quantidade, produto_id]);
        await conn.query(registrarMovimentacao, [produto_id, tipo, quantidade]);
        res.json({ msg: "Saída registrada com sucesso." });
    } catch (error) {
        console.error("Erro ao registrar saída:", error);
        res.status(500).json({ msg: "Erro ao registrar saída." });
    }
});

// Login
app.post("/login", (req, res) => {
    const { usuario, senha } = req.body;
    if (usuario === process.env.LOGIN_USER && senha === process.env.LOGIN_PASSWORD) {
        req.session.usuario = usuario;
        res.redirect("/");
    } else {
        res.redirect("/login");
    }
});

app.post("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/login");
});
