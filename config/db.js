const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    charset: 'utf8mb4'
});

// 🔍 Prueba de conexión explícita
pool.getConnection((err, connection) => {
    if (err) {
        console.error('❌ Error al conectar con la base de datos:', err.message);
    } else {
        console.log('✅ Conexión a la base de datos exitosa.');
        connection.release();
    }
});

module.exports = pool.promise();
