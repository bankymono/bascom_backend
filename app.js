const express = require('express')
const cors = require('cors')
const path = require('path')
const bodyParser = require('body-parser')


// const projects = require('./controllers/projectsController');
// const tasks = require('./controllers/tasksController');


const app = express()


app.use(bodyParser.json(),cors())
app.use(express.static(path.join(__dirname,'public')))
app.use(express.static(path.join(__dirname,'uploads')))
app.use('/users',require('./routes/users.route'))
app.use('/projects',require('./routes/projects.route'))
app.use('/tasks',require('./routes/tasks.route'))
app.use('/teams',require('./routes/teams.route'))
app.use('/feedback',require('./routes/feedback.route'))
app.use('/reports',require('./routes/reports.route'))


app.listen(process.env.PORT || 5000, ()=>{
    console.log('listening at port 5000');
})
