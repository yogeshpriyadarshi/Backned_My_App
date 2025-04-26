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

// const connection =  mysql.createConnection( {  
// host: "localhost",
// user: "dbeaver",
// password: "dbeaver",
//  database: "Test",

// });

// connection.connect ( err=> {  
// if(err) {
//     console.log("err",err);
// } else{
// console.log("conection successful");
// }
// } );

// module.exports = connection;