const express = require('express')
const router = express.Router()
const feedbackController = require('../controllers/feedbackController')
const auth = require("../controllers/authController");


router.post('/', auth.authenticate, feedbackController.getAllProjects)
router.get('/', auth.authenticate, feedbackController.getProjects)

module.exports = router