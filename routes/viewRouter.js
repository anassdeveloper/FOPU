const express = require('express');
const router = express.Router();
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');

router.get('/',authController.protectRoute, viewController.getSite);
router.get('/me', authController.protectRoute, viewController.me);
router.get('/login',  viewController.login);


module.exports = router;