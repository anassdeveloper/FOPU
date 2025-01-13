const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const authController = require('../controllers/authController');
const upload = require('../utils/multer');
const uploadToCloud= require('../utils/cloudinary');

// router.get('/search-posts',  postController.searchPostByQuery);
router.get('/',authController.protectRoute, postController.getAllPosts);
router.get('/:id', postController.getOnePost);


router.post('/create-new-post', 
    upload.single('photo'),
    uploadToCloud(null, null),
    postController.createNewPost);

router.delete('/del/:id', authController.protectRoute, postController.deletePost)


module.exports = router;