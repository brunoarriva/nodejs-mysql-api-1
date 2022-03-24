module.exports = {

  findAll: 'SELECT id, username, type, active FROM APP_USER',

  findByUsername: 'SELECT id, username, password, type, active' +
   ' FROM APP_USER' +
   ' WHERE USERNAME = ?',

  insertUser: 'INSERT INTO APP_USER (ACTIVE, USERNAME, PASSWORD, TYPE)' +
   ' VALUES (?, ?, ?, ?)',

};
