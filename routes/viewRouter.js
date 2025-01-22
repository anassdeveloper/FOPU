const express = require('express');
const router = express.Router();
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');

router.get('/',authController.protectRoute, viewController.getSite);
router.get('/me', authController.protectRoute, viewController.me);
router.get('/login',  viewController.login);
router.get('/register', viewController.register);
router.get('/global-chat', authController.protectRoute, viewController.getChat)
router.get('/update-post/:id', viewController.updatePost);
router.get('/user-profil/:id', authController.protectRoute, viewController.getUserprofile)


module.exports = router;