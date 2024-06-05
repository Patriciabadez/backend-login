require('dotenv').config(); // Carrega as variáveis de ambiente do arquivo .env

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const User = require('./models/User');

const app = express();
app.use(express.json());

// Configuração do CORS
const corsOptions = {
    origin: 'http://localhost:3000', // Certifique-se de que esta origem é a correta para o seu frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Função assíncrona para gerar a chave secreta JWT
async function generateSecretKey() {
    try {
        const secretKey = process.env.JWT_SECRET_KEY || jwt.sign({}, null, { expiresIn: '1h' });
        console.log('Chave JWT gerada:', secretKey);
        return secretKey;
    } catch (error) {
        console.error('Erro ao gerar a chave JWT:', error);
        throw error;
    }
}

// Inicialização da chave secreta JWT
let SECRET_KEY;

(async () => {
    try {
        SECRET_KEY = await generateSecretKey();
    } catch (error) {
        console.error('Erro ao inicializar a chave JWT:', error);
        process.exit(1);
    }
})();

app.get('/', async (req, res) => {
    res.send("Pagina Inicial!");
});

app.post('/auth/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ erro: true, mensagem: "Dados insuficientes para cadastro." });
        }

        // Crie um hash da senha usando bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);

        // Agora você pode armazenar 'hashedPassword' no banco de dados
        const user = await User.create({ username, password: hashedPassword });
        res.status(201).json({ user });
    } catch (error) {
        console.error(error);
        res.status(400).json({ erro: true, mensagem: "Erro: Usuário não cadastrado!" });
    }
});

// No arquivo onde você faz login (por exemplo, '/auth/login')
app.post('/auth/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(401).json({ erro: true, mensagem: "Usuário não encontrado!" });
        }
         // Compare a senha fornecida com o hash da senha armazenada no banco de dados usando bcrypt
         
        // const validPassword = await bcrypt.compare(password, user.password);
        // if (!validPassword) {
        //     return res.status(401).json({ erro: true, mensagem: "Senha inválida!" });
        // }

        const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '1h' });
        res.status(200).json({ access_token: token });
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        res.status(500).json({ erro: true, mensagem: "Erro interno no servidor" });
    }
});

app.put('/auth/disable/:id', async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ erro: true, mensagem: "Usuário não encontrado!" });
        }
        user.disabled = true;
        await user.save();
        res.status(200).json({ mensagem: "Usuário desabilitado com sucesso!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: true, mensagem: "Erro interno no servidor" });
    }
});

app.put('/auth/enable/:id', async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ erro: true, mensagem: "Usuário não encontrado!" });
        }
        user.disabled = false;
        await user.save();
        res.status(200).json({ mensagem: "Usuário habilitado com sucesso!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: true, mensagem: "Erro interno no servidor" });
    }
});

app.get('/auth', async (req, res) => {
    const { page = 1, filter = '' } = req.query;
    const limit = 10;
    const offset = (page - 1) * limit;

    try {
        const users = await User.findAndCountAll({
            where: {
                [Op.or]: [
                    { username: { [Op.like]: `%${filter}%` } },
                    { password: { [Op.like]: `%${filter}%` } }
                ]
            },
            limit,
            offset
        });
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: true, mensagem: "Erro interno no servidor" });
    }
});

User.sync().then(() => {
    app.listen(3001, () => {
        console.log("Servidor rodando na porta 3001: http://localhost:3001");
    });
}).catch(error => {
    console.error("Erro ao sincronizar com o banco de dados:", error);
});