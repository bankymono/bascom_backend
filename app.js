const express = require('express')
const bodyParser = require('body-parser')


// const projects = require('./controllers/projectsController');
// const tasks = require('./controllers/tasksController');


const app = express()

app.use(bodyParser.json())

app.use('/users',require('./routes/users.route'))
app.use('/projects',require('./routes/projects.route'))
app.use('projects/:projectId/tasks',require('./routes/tasks.route'))
app.use('/tasks',require('./routes/tasks.route'))
app.use('/teams',require('./routes/teams.route'))
// app.use('/feedback',require('./routes/feedback.route'))


app.listen(process.env.PORT || 5000, ()=>{
    console.log('listening at port 5000');
})

