const Sequelize = require('sequelize');

const sequelize = new Sequelize('banco', 'root', '123456', {
    host: 'localhost',
    dialect: 'mysql'
}); 
sequelize.authenticate()
.then(function(){
    console.log("Conexão com o banco de dados realizada com sucesso!");
}).catch(function(){
    console.log("Erro: Conexão com o banco de dados não realizada!")
})
module.exports = sequelize;