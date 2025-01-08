const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const upload = require('../utils/multer');
const uploadToCloud = require('../utils/cloudinary');

router.get('/logout', authController.logout);
router.post('/login', authController.login);

router.post('/newuser',upload.single('photo'),
    uploadToCloud('400', '400'),
    userController.newuser
);

router.post('/forgetpassword', authController.forgetPassword);
router.patch('/update-password',authController.protectRoute, authController.updatePassword);

module.exports = router;


// userController.upDateUserPhoto,
// userController.resizeUserPhoto,