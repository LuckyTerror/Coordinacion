const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'pruebas_hash'
});

connection.connect((err) => {
  if (err) throw err;
  console.log('🟢 Conectado a MySQL');
});

module.exports = connection;
