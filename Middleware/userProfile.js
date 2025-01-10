const fs=require('fs')
const path=require('path')
const multer=require('multer')

const uploadDir=path.join(__dirname,'profilePics')

if(!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir,{recursive:true})
}

const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,uploadDir)
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
})

const fileFilter=(req, file, cb)=>{
if(file.mimetype.startsWith('image/')){
    cb(null, true)
}else{
    cb(new Error('Only Image files are allowed'),false)
}
}

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 50 // Increase to 10MB
    }
});

module.exports = upload;