const multer = require('multer');
module.exports.files={
    storage:function(){
        var storageFile = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, 'public/images/')
            },
            filename: function (req, file, cb) {
                cb(null, Date.now() + file.originalname);
            },
        })
        return storageFile;
    },
    allowedFile:function(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG)$/)) {
            req.fileValidationError = 'Only  files are allowed!';
            return cb(new Error('Only  files are allowed!'), false);
        }
        cb(null, true);
    }
}