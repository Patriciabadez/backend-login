const Sequelize = require('sequelize');
const db = require('./db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = db.define('users', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    username: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    // email: {
    //     type: Sequelize.STRING,
    //     allowNull: false,
    //     unique: true
    // },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    // disabled: {
    //     type: Sequelize.BOOLEAN,
    //     defaultValue: false
    // }
});

// Hook para hashear a senha antes de criar o usuário
User.addHook('beforeCreate', async (user) => {
    if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
    }
});

// Método para comparar a senha fornecida com a senha armazenada
User.prototype.validPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

// Método para gerar um token JWT
User.prototype.generateAuthToken = function() {
    const token = jwt.sign({ id: this.id, username: this.username }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
    return token;
};

module.exports = User;