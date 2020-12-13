const express = require('express')
const router = express.Router()
const reportsController = require('../controllers/reportsController')
const auth = require("../controllers/authController");

var multer  = require('multer')

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'reportsFolder/')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
})

var upload = multer({ storage:storage})


router.get('/all', auth.authenticate,reportsController.getAllReports)
router.get('/usrreports', auth.authenticate, reportsController.getReports)
router.get('/:reportId', auth.authenticate, reportsController.getSingleReport)
// router.get('/:reportId/tasks', auth.authenticate, reportsController.getProjectTasks)
// router.post('/:reportId/tasks', auth.authenticate, reportsController.createProjectTask)
router.post('/', auth.authenticate, upload.single('reportPdf'), reportsController.createReport)
router.put('/:reportId', auth.authenticate, reportsController.updateReport)
router.delete('/:reportId', auth.authenticate, reportsController.deleteReport)

module.exports = router