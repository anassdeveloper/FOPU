const express = require('express');
const router = express.Router();
const userController = require('./../controllers/userController');
const authController = require('../controllers/authController');

router.get('/',userController.getAllUsers);
router.get('/:id',authController.protectRoute, userController.getOneUser);
router.delete('/:id', 
    authController.protectRoute, 
    authController.restrictTo('admin', 'guide'),
    userController.deleteOneUser
);

module.exports = router;
