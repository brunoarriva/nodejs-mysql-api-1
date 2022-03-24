module.exports = {

  findAll: 'SELECT ' +
    ' t.id,' +
    ' t.description,' +
    ' t.creation,' +
    ' t.last_update as lastUpdate,' +
    ' u.username' +
    ' FROM APP_TASK t' +
    ' INNER JOIN APP_USER u ON (u.ID = t.user_id)' +
    ' WHERE u.id = COALESCE(?, u.id)',

  insert: 'INSERT INTO APP_TASK (DESCRIPTION, CREATION, LAST_UPDATE, USER_ID)' +
    ' VALUES (?, ?, ?, ?)',

  update: 'UPDATE APP_TASK SET' +
    ' DESCRIPTION = ?,' +
    ' LAST_UPDATE = ?' +
    ' WHERE ID = ?' +
    ' AND USER_ID = ?',

  delete: 'DELETE FROM APP_TASK WHERE ID = ?' +
    ' AND (SELECT TYPE FROM APP_USER WHERE ID = ?) = \'M\'',

};
