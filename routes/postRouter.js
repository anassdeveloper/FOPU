const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const upload = require('../utils/multer');

router.get('/', postController.getAllPosts);
router.get('/:id', postController.getOnePost);

router.post('/create-new-post', upload.single('photo'),postController.createNewPost);


module.exports = router;