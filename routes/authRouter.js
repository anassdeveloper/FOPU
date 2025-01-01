const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

router.post('/login', authController.login);
router.post('/newuser', userController.newuser);
router.post('/forgetpassword', authController.forgetPassword);

module.exports = router;