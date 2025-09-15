const multer = require('multer');
const path = require("path");

// set our disk storage
const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,"upload/")
    },
    filename : function(req,file,cb){
    cb(null,
        file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    )
    },
});

//file filter function
const checkFileFIlter = (req,file,cb)=>{
    if(file.mimetype.startsWith('image')){
        cb(null,true)
    }
    else{
        cb(new Error('This is not an image'))
    }
}

module.exports = multer({
    storage: storage,
    fileFilter:checkFileFIlter,
    limits: {
        fileSize: 5*1024*1024  // 5mb
    }
});