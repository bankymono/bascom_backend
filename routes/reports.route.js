const cors = require('cors')
const express = require('express')
const multer = require('multer');
const uuid = require('uuid').v4;
const path = require('path');


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
// router.get('/:reportId', auth.authenticate, reportsController.getSingleReport)
// router.get('/:reportId/tasks', auth.authenticate, reportsController.getProjectTasks)
// router.post('/:reportId/tasks', auth.authenticate, reportsController.createProjectTask)
// router.post('/save', auth.authenticate, upload.single('reportfile'), reportsController.saveReport)
// router.post('/:reportId', auth.authenticate, reportsController.editReport)
// router.post('/:reportId', auth.authenticate, reportsController.deleteReport)

module.exports = router