 
const multer= require('multer')
const   path        = require("path");

 const storage= multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../public/images"))
    }, 
    filename:function (req,file , cb) {
        cb(null, file.originalname)
    }
})

// File format restrictions
const fileFilter = (req, file, cb) => {
    if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png' || file.mimetype == 'image/jpg') {
      cb(null, false);
      console.log(file.mimetype, 'fff')
    } else {
      cb(null, false);
    }
  };
const uploadImg= multer({storage:storage})
module.exports= uploadImg