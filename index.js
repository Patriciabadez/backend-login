const express = require("express");
const app = express();
const User = require('./models/User');

app.get('/', async (req, res) => {
    res.send("Pagina Inicial!");
});
app.post('/cadastrar',async(req, res) => {
    console.log(req.body)
res.send("Pagina cadastrar")
})

app.listen(3001, () => {
    console.log("Servidor rodando na porta 3001: http://localhost:3001");
});