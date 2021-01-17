const cors = require('cors');
const express = require('express');
const multer = require('multer');
const uuid = require('uuid').v4;
const path = require('path');


const router = express.Router();
const projectsController = require('../controllers/projectsController')
const tasksController = require('../controllers/tasksController')
const reportsController = require('../controllers/reportsController')
const auth = require("../controllers/authController");
const {nameValidationResult, nameValidator} = require('../validators/nameValidator');

// file filter
const fileFilter = (req,file,cb)=>{
    if(file.mimetype == 'application/pdf' 
      || file.mimetype == 'application/msword' 
      || file.mimetype == 'text/csv'){
        cb(null, true)
    }else{
      console.log(file)
        cb(null, false)
        req.file = null
    }
  }
  
  const storage = multer.diskStorage({
      destination:(req,file,cb)=>{
          cb(null,'uploads')
      },
      filename:(req,file,cb)=>{
                const ext = path.extname(file.originalname);
                const id= uuid();
                const fileuri = `${id}${ext}`
                const filePath = `reports/${fileuri}`;
  
                req.filePath = filePath;
  
                cb(null, `${filePath}`);
  
      }
  })
  
  
  const upload = multer({
      storage: storage,
      fileFilter:fileFilter
  })




router.options("*", cors())
router.get('/all', auth.authenticate,auth.viewAllProjects,projectsController.getAllProjects)

router.get('/userprojects/', auth.authenticate, projectsController.getProjects)
router.get('/:projectId/tasks/', auth.authenticate, tasksController.getTasks)

router.get('/userprojects/:projectId', auth.authenticate, projectsController.getSingleProject)
router.get('/:projectId/tasks/:taskId', auth.authenticate,tasksController.getSingleTask)

router.get('/:projectId/reports/', auth.authenticate, reportsController.getReports)
router.get('/:projectId/reports/reportId',  auth.authenticate, reportsController.getSingleReport)
router.post('/:projectId/reports/save', auth.authenticate, upload.single('reportfile'), reportsController.saveReport)
router.post('/:projectId/reports/reportId/edit', auth.authenticate, reportsController.editReport)
router.post('/:projectId/reports/reportId/delete', auth.authenticate, reportsController.deleteReport)

router.post('/userprojects/:projectId/addteam', auth.authenticate, projectsController.addTeam)

// router.get('/:projectId/tasks', auth.authenticate, projectsController.getProjectTasks)
// router.post('/:projectId/tasks', auth.authenticate, projectsController.createProjectTask)
router.post('/userprojects/create', auth.authenticate, nameValidator, 
    nameValidationResult, projectsController.createProject)
router.post('/userprojects/:projectId/edit', auth.authenticate, projectsController.editProject)
router.post('/userprojects/:projectId/delete', auth.authenticate, projectsController.deleteProject)


router.post('/:projectId/tasks/create', nameValidator, 
    nameValidationResult, auth.authenticate,tasksController.createTask)
router.post('/:projectId/tasks/:taskId/assign', auth.authenticate,tasksController.assignTask)
router.post('/:projectId/tasks/:taskId/edit', auth.authenticate,tasksController.editTask)
router.post('/:projectId/tasks/:taskId/delete', auth.authenticate,tasksController.deleteTask)

module.exports = router