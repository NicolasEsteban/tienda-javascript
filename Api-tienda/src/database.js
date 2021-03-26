const mysql = require('mysql');
const {promisify} = require('util');

const { database } = require('./keys');

const pool = mysql.createPool(database);

pool.getConnection((err,connection)=>{
    if(err){
        if(err.code === 'PROTOCOL_CONNECTION_LOST'){
            console.log('conexion perdida');
        }
        if(err.code === 'ER_CON_COUNT_ERROR'){
            console.log('cuantas conexion de bases de datos tiene');
        }
        if(err.code === 'ECONNREFUSED'){
            console.log('la conexion de base de datos fue rechazada');
        }        
    }
    if(connection) connection.release(); // empieza la conexion
    console.log('conexion a base de datos exitosa');
    return;
});
// para poder hacer consultas a la bd
pool.query = promisify(pool.query);

module.exports = pool;