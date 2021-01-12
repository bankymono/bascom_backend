const express = require('express')
const router = express.Router()
const faqController = require('../controllers/faqController')



router.get('/all',faqController.getAllFAQ)
router.get('/:faqId',faqController.getSingleFAQ)
router.post('/newFaq', faqController.createFAQ)
router.put('/:faqId', faqController.updateFAQ)
router.delete('/:faqId',faqController.deleteFAQ)

module.exports = router;