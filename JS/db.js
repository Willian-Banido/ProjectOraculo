const mysql = require('mysql2');
require('dotenv').config(); // Carregar variáveis do arquivo .env

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

connection.connect((err) => {
  if (err) {
    console.error('Erro na conexão: ' + err.stack);
    return;
  }
  console.log('Conectado ao banco de dados com ID ' + connection.threadId);
});

module.exports = connection;
