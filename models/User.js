const Sequelize = require('sequelize');
const db = require('./db');

const User = db.define('users', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
    }
});
//Criar a tabela caso ela não exista
//User.sync();

//Verrifica se tem alguma diferença na tabela e realiza alteração
//User.sync({alter:true});

module.exports = User

