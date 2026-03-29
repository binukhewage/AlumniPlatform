//this file is establishing database connection with backend 

//import sql library and load .env variables 
import mysql from "mysql2";  
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({   //created a connection pool (better than a single connection)
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,  //wait if no connecttion abailable 
  connectionLimit: 10,  //max number of connection in pool
});

export default pool.promise();
