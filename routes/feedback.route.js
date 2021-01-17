const cors = require('cors')
const express = require('express')
const router = express.Router()
const feedbackController = require('../controllers/feedbackController')
const auth = require("../controllers/authController");

router.options("*", cors())
router.post('/', feedbackController.postFeedback)
router.get('/', feedbackController.getFeedbacks)
router.get('/:feedbackId', feedbackController.getSingleFeedback)
// router.get('/',feedbackController.getProjects)

module.exports = router