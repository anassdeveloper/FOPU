const multer = require('multer');


const multerStorage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './public/photos/users');
    },
    filename: function(req, file, cb){
        const indexPoint = file.originalname.lastIndexOf('.');
        const shortName = file.originalname.slice(indexPoint);
        let num = Math.floor(Math.random() * 4324);
        
        file.originalname = file.originalname.slice(0, file.originalname.indexOf('.')) + num + shortName;
        file.originalname = file.originalname.split(' ').join('');
        cb(null, file.originalname);
    }
});

// const upload = multer({ multerStorage });
const upload = multer({ storage: multerStorage});

module.exports = upload;