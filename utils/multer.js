const multer = require('multer');

const multerStorage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './public/photos/posts');
    },
    filename: function(req, file, cb){
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
});

// const upload = multer({ multerStorage });
const upload = multer({ storage: multerStorage});

module.exports = upload;