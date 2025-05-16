const mysql = require("mysql2/promise");

const pool = mysql.createPool({
    host: 'localhost',
    user: "dbeaver",
    password: 'dbeaver',
    database: 'Test',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
  
  module.exports = pool; // Use `.promise()` to enable async/await
