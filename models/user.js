const db = require('./db');

module.exports = {
    getUsers: async () =>  await db.q('select * from users', []),
    findUserByUsername: async username => await db.q('select username from users where username = ?', username),
    doRegister: async (...userInformation) => await db.q('INSERT INTO users (username, password, email) values (?,?,?)', userInformation)
}