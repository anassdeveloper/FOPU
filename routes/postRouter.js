const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const upload = require('../utils/multer');
const uploadToCloud= require('../utils/cloudinary');

router.get('/', postController.getAllPosts);
router.get('/:id', postController.getOnePost);

router.post('/create-new-post', 
    upload.single('photo'),
    uploadToCloud(null, null),
    postController.createNewPost);


module.exports = router;