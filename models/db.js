const mysql = require('mysql')
var connection = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"bascom"
})

connection.connect((err,res)=>{
    if (err) throw err

    console.log("db server connected")
})


module.exports = connection