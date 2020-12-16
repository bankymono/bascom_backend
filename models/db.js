const mysql = require('mysql')
require("dotenv").config();

db_config = {
    connectionLimit:50,
    host:"us-cdbr-east-02.cleardb.com",
    user:"be8e2032d35dc9",
    password:"67c29f3b",
    database:"heroku_8b1f35243343924"
}

// var connection  = mysql.createPool(db_config);
  

var connection = mysql.createPool(db_config)
// var connection
// function handleDisconnect() {
//     connection = mysql.createConnection(db_config); // Recreate the connection, since
//                                                     // the old one cannot be reused.
  
//     connection.connect(function(err) {              // The server is either down
//       if(err) {                                     // or restarting (takes a while sometimes).
//         console.log('error when connecting to db:', err);
//         setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
//       }
//       console.log("db server connected")                                     // to avoid a hot loop, and to allow our node script to
//     });                                     // process asynchronous requests in the meantime.
//                                             // If you're also serving http, display a 503 error.
//     connection.on('error', function(err) {
//       console.log('db error', err);
//       if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
//         handleDisconnect();                         // lost due to either server restart, or a
//       } else {                                      // connnection idle timeout (the wait_timeout
//         throw err;                                  // server variable configures this)
//       }
//     });
//   }

connection.connect((err,res)=>{
    if (err) throw err

    console.log("db server connected")
})
// handleDisconnect();

module.exports = connection