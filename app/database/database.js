const mysql = require('mysql2');
const dbConfig = require('../../config/db');

const conn = mysql.createConnection(dbConfig);

conn.connect((err) => {
  if (err) {
    return console.error('MySQL Connection error: ' + err.message);
  }
  console.log('Successfully connected to MySQL database...');
});

module.exports = conn;
