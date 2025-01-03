const cloudinary = require('cloudinary').v2;



cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_SECRET
    // secure: true,
});



const uploadToCloud = (height, width) => {
  return async (req, res, next) => {
    try{
      

       if(!req.file){
        req.file = {
          photo: ""
        }
        return next();
       } 
      const results = await cloudinary.uploader.upload(req.file.path);
      const url = cloudinary.url(results.public_id, {
        height: height,
        width: width,
        transformation: [
          {quality: 'auto'},
          {fetch_format:'auto'}
        ]
      });
      req.file.photo = url;
      next();
    }catch(err){
        console.log(err.message);
        res.status(500).json({
            status: 'FAIL',
            message: err.message
        })
    }
}

}
module.exports = uploadToCloud;