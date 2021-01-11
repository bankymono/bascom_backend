const express = require('express')
const router = express.Router()
const feedbackController = require('../controllers/feedbackController')
const auth = require("../controllers/authController");


router.post('/', feedbackController.postFeedback)
// router.get('/',feedbackController.getProjects)

module.exports = router