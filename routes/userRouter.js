const express = require('express');
const router = express.Router();
const userController = require('./../controllers/userController');
const authController = require('../controllers/authController');
const upload = require('../utils/multer');
const uploadToCloud = require('../utils/cloudinary');

router.get('/',userController.getAllUsers);
router.get('/:id',authController.protectRoute, userController.getOneUser);
router.patch('/update-currentuser',
    authController.protectRoute,
    upload.single('photo'),
    uploadToCloud('400', '400'),
    userController.updateUserInfo
);

router.delete('/:id', 
    authController.protectRoute, 
    authController.restrictTo('admin', 'guide'),
    userController.deleteOneUser
);

module.exports = router;
