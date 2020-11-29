const express = require('express')
const bodyParser = require('body-parser')
const { json } = require('body-parser')

const app = express()

app.use(json()) 


app.listen(5000)

console.log('listening at port 5000');