const sequelize = require('sequelize')

const connect = new sequelize('guia-perguntas', 'root','1052',{
    host: 'localhost',
    dialect: 'mysql'
})

module.exports = connect