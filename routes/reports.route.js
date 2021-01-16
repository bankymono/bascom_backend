const cors = require('cors')
const express = require('express')
const multer = require('multer');
const uuid = require('uuid').v4;
const path = require('path');
const aws = require('aws-sdk');
const multerS3 = require('multer-s3')

const router = express.Router()
const reportsController = require('../controllers/reportsController')
const auth = require("../controllers/authController");

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

// s3 config
const s3 = new aws.S3({
  apiVersion:'2006-03-01'
});

// aws storage config
aws.config.loadFromPath('./config.json')

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'bascom-projects',
        metadata:(req,file,cb)=>{
            cb(null,{fieldName:file.fieldname});
        },
        key: (req,file,cb) =>{

            const ext = path.extname(file.originalname);
            const id= uuid();
            const fileuri = `${id}${ext}`
            const filePath = `https://bascom-projects.s3.amazonaws.com/${fileuri}`;

            req.filePath = filePath;

            cb(null, `${fileuri}`);
        }
    }),
    fileFilter:fileFilter
})

// var storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, 'reportsFolder/')
//     },
//     filename: function (req, file, cb) {
//       cb(null, file.originalname)
//     }
// })

// var upload = multer({ storage:storage})

router.options("*", cors())
router.get('/all', auth.authenticate,reportsController.getAllReports)
router.get('/userreports', auth.authenticate, reportsController.getReports)
router.get('/:reportId', auth.authenticate, reportsController.getSingleReport)
// router.get('/:reportId/tasks', auth.authenticate, reportsController.getProjectTasks)
// router.post('/:reportId/tasks', auth.authenticate, reportsController.createProjectTask)
router.post('/save', upload.single('reportfile'), reportsController.saveReport)
router.post('/:reportId', auth.authenticate, reportsController.editReport)
router.post('/:reportId', auth.authenticate, reportsController.deleteReport)

module.exports = router