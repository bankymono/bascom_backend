require("dotenv").config();
const mysql = require('mysql')
var connection = mysql.createConnection({
    host:process.env.REMOTE_DB_HOST,
    user:process.env.REMOTE_DB_USERNAME,
    password:process.env.REMOTE_DB_PASSWORD, 
    database:process.env.REMOTE_DB_DATABASE
})

connection.connect((err,res)=>{
    if (err) throw err

    console.log("db server connected")
})


module.exports = connection