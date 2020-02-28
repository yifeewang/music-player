const db = require('./db');


module.exports = {
    addMusic: async singInformation => await db.q('insert into musics (title, singer, time, filerc, file, uid) values (?, ?, ?, ?, ?, ?)', Object.values(singInformation)),
    updateMusic: async singInformation => await db.q('update musics set title=?,singer=?,time=?,filerc=?,file=?,uid=? where id=?',Object.values(singInformation))
}