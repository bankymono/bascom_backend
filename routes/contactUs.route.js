const cors = require('cors')
const express = require('express')
const router = express.Router()
const contactUsController = require('../controllers/contactUsController')

router.options("*", cors())
router.post('/', contactUsController.postContactUs)
router.get('/all',contactUsController.getAllContactUs)
router.get('/:contactUsId',contactUsController.getSingleContactUs)

module.exports = router