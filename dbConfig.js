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
        console.log('An error occurred while connecting', err);
        return;
    }

    console.log('Database is connected');

});


module.exports = mysqlConnection;