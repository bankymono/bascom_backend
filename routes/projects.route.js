const express = require('express')
const router = express.Router()
const projectsController = require('../controllers/projectsController')
const auth = require("../controllers/authController");

router.get('/', auth.authenticate, auth.viewUser, projectsController.getProjects)
router.get('/:id', auth.authenticate, auth.viewUser, projectsController.getSingleProject)
router.post('/', auth.authenticate, auth.viewUser, projectsController.createProject)
router.put('/:id', auth.authenticate, auth.viewUser, projectsController.updateProject)
router.delete('/:id', auth.authenticate, auth.viewUser, projectsController.deleteProject)

module.exports = router