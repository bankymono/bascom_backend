const express = require('express')
const bodyParser = require('body-parser')


// const projects = require('./controllers/projectsController');
// const tasks = require('./controllers/tasksController');



const app = express()

app.use(bodyParser.json())

app.use('/users', require('./routes/users.route'))
app.use('/projects',require('./routes/projects.route'))
app.use('/tasks',require('./routes/tasks.route'))



app.listen(process.env.port || 5000, ()=>{
    console.log('listening at port 5000');
})

