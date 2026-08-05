const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '', 
    database: 'railway_db',
    port: 3307,
    waitForConnections: true,
    connectionLimit: 10
});

module.exports = pool.promise();