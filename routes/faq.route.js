const cors = require('cors')
const express = require('express')
const router = express.Router()
const faqController = require('../controllers/faqController')

router.options("*", cors())
router.get('/faqs',faqController.getAllFAQ)
router.get('/:faqId',faqController.getSingleFAQ)
router.post('/create', faqController.createFAQ)
router.put('/:faqId', faqController.editFAQ)
router.delete('/:faqId',faqController.deleteFAQ)

module.exports = router;