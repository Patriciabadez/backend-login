const express = require("express");
const app = express();
const User = require('./models/User');

app.use(express.json());

app.get('/', async (req, res) => {
    res.send("Pagina Inicial!");
});
app.post('/cadastrar', async (req, res) => {
    //console.log(req.body);

    await User.create(req.body)
        .then(() => {
            return res.status(200).json({
                erro: false,
                mensagem: "Usuário cadastrado com sucesso!"
            })
        }).catch(() => {
            return res.status(400).json({
                erro: true,
                mensagem: "Erro: Usuário não cadastrado!"

            })

            //res.send("Pagina cadastrar");
        });
});

app.listen(3001, () => {
    console.log("Servidor rodando na porta 3001: http://localhost:3001");
});