require("dotenv").config();

const mysql = require('mysql')
var db_config ={
    host:process.env.JAWS_DB_HOST,
    user:process.env.JAWS_DB_USER,
    password:process.env.JAWS_DB_PASSWORD, 
    database:process.env.JAWS_DB_DATABASE
}

var connection = mysql.createConnection(db_config)
connection.connect((err,res)=>{
  if (err) throw err

  console.log("db server connected")
})

// var connection;

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
  
//   handleDisconnect();


// // connection.connect((err,res)=>{
// //     if (err) throw err

// //     console.log("db server connected")
// // })

// module.exports = connection


// const mysql = require('mysql')
// var connection = mysql.createPool({
//   host:process.env.REMOTE_DB_HOST ||"localhost",
//   user:process.env.REMOTE_DB_USERNAME || "root",
//   password:process.env.REMOTE_DB_PASSWORD || "", 
//   database:process.env.REMOTE_DB_DATABASE || "bascom"
// })

// connection.connect((err,res)=>{
//     if (err) throw err

//     console.log("db server connected")
// })


module.exports = connection