const cors = require('cors')
const express = require('express')
const router = express.Router()
const faqController = require('../controllers/faqController')

router.options("*", cors())
router.get('/faqs',faqController.getAllFAQ)
router.get('/:faqId',faqController.getSingleFAQ)
router.post('/create', faqController.createFAQ)
router.post('/:faqId/edit', faqController.editFAQ)
router.post('/:faqId/delete',faqController.deleteFAQ)

module.exports = router;