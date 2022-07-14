const mysql = require('mysql2');

//Environment variable
const mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'caol'
});

mysqlConnection.connect(function (err) {
    if (err) {
        console.log('Ha ocurrido un error al conectarse', err);
        return;
    }

    console.log('La base de datos está conectada');

});


module.exports = mysqlConnection;