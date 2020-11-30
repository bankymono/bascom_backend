const express = require('express')
const bodyParser = require('body-parser')
const { json } = require('body-parser')

const users = require('./controllers/usersController');
const projects = require('./controllers/projectsController');
const tasks = require('./controllers/tasksController');



const app = express()

app.use(json()) 

users(app)
projects(app)
tasks(app)



app.listen(5000)

console.log('listening at port 5000');