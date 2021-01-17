const cors = require('cors')
const express = require('express')
const multer = require('multer');
const uuid = require('uuid').v4;
const path = require('path');

const router = express.Router()
const usersController = require('../controllers/usersController')
const auth = require("../controllers/authController");
const {userValidationResult, userValidator} = require('../validators/userValidator');

// file filter
const fileFilter = (req,file,cb)=>{
    if(file.mimetype == 'image/jpeg' 
      || file.mimetype == 'image/png'){
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
                const filePath = `images/${fileuri}`;
  
                req.filePath = filePath;
  
                cb(null, `${filePath}`);
  
      }
    })

const upload = multer({
    storage: storage,
    fileFilter:fileFilter
})


router.options("*", cors())
router.get('/root', usersController.root);
router.get('/all', auth.authenticate, auth.viewAllUsers, usersController.getUsers);
router.get('/:userId', auth.authenticate, usersController.getSingleUser);
router.post('/',  userValidator, userValidationResult,usersController.internalUserSignup);

// user sign up and activation
router.post('/signup', userValidator, userValidationResult, usersController.signUp);
router.get('/auth/activation/:userId/:otpCode', usersController.activateAccount);

router.post('/profilepicture', auth.authenticate, upload.single('profilepicture'), usersController.addProfilePicture);


//login route
router.post('/auth/login', usersController.login);

// forgot password
router.post("/auth/forgotpassword", usersController.forgotPassword);
router.post("/auth/resetpassword/:resetToken",  usersController.resetPassword);


router.put('/:id', auth.authenticate, usersController.updateUser);
router.delete('/:id', auth.authenticate, auth.deleteUser, usersController.deleteUser);

module.exports = router