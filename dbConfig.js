const mysql = require('mysql2');

//Environment variable
/* const mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'caol'
}); */

const mysqlConnection = mysql.createConnection({
    host: 'sql3.freesqldatabase.com',
    user: 'sql3507753',
    password: 'CAzTGwhT5Q',
    database: 'sql3507753',
    port: 3306
}); 

mysqlConnection.connect(function (err) {
    if (err) {
        console.log('An error occurred while connecting', err);
        return;
    }

    console.log('Database is connected');

});


module.exports = mysqlConnection;