const mysql = require('mysql2');

//Environment variable
/* servidor-win-remoto */
const mysqlConnection = mysql.createConnection({
    host: 'bjy65fmikhjvqmzmt2sh-mysql.services.clever-cloud.com',
    user: 'ule1scwlbxqev7hn',
    password: 'wAc8ly65QV5YP8A4EhBZ',
    database: 'bjy65fmikhjvqmzmt2sh'
});
/* servidor-win-remoto */
/* const mysqlConnection = mysql.createConnection({
    host: 'buhigz693lipvlr9tnns-mysql.services.clever-cloud.com',
    user: 'u4vme26uukafdfdg',
    password: 'cwy9EYCGlJURuW9oobUe',
    database: 'buhigz693lipvlr9tnns'
});  */

/* servidor-linux-remoto */
/* const mysqlConnection = mysql.createConnection({
    host: 'sql3.freesqldatabase.com',
    user: 'sql3507753',
    password: 'CAzTGwhT5Q',
    database: 'sql3507753'
}); */

/* servidor-local */
/* const mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'caol2'
}); */

mysqlConnection.connect(function (err) {
    if (err) {
        console.log('An error occurred while connecting', err);
        return;
    }

    console.log('Database is connected');

});


module.exports = mysqlConnection;