import mysql from 'mysql2'

// create the connection to database
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'th2_nodejs',
  password: ''
});
const connection = pool.promise();
export default connection
