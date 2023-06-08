// File Upload API configuration with Multer
const multer = require('multer');
const imageFilter = (req, file, cb) => {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
      cb(null, true);
    } else {
      req.fileValidationError = "Forbidden extension";
      cb(null,false,req.fileValidationError);
    }
  };
// Filters to Image Only
const imageHandler = multer({storage:multer.memoryStorage(),fileFilter:imageFilter});
module.exports = imageHandler; // limit image upload to 2MB

