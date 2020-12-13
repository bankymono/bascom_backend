const express = require('express')
const bodyParser = require('body-parser')


// const projects = require('./controllers/projectsController');
// const tasks = require('./controllers/tasksController');



const app = express()

app.use(bodyParser.json())

app.use('/users',require('./routes/users.route'))
app.use('/projects',require('./routes/projects.route'))
<<<<<<< HEAD
app.use('/tasks',require('./routes/tasks.route'))
app.use('/teams',require('./routes/teams.route'))
=======
app.use('/projects/:projectId/tasks',require('./routes/tasks.route'))
app.use('/projects/:projectId/reports',require('./routes/reports.route'))
app.use('/teams', require('./routes/users.route'))
>>>>>>> 79dbb74f0614cb49a4f18f066c2f92c0f11c70fd



app.listen(process.env.port || 5000, ()=>{
    console.log('listening at port 5000');
})

