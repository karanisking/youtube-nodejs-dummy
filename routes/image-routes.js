const express = require('express');
const {uploadImage, fetchImages,deleteImage} = require("../controllers/image-controller");
const authMiddleware = require("../middleware/auth-middleware");
const adminMiddleware = require("../middleware/admin-middleware");
const uploadMiddleware = require("../middleware/upload-middleware")
const router = express.Router();

router.post('/upload',authMiddleware,adminMiddleware,uploadMiddleware.single('image'),uploadImage);
router.get('/get',authMiddleware,fetchImages);
router.delete('/delete/:id',authMiddleware,adminMiddleware,deleteImage);


module.exports = router;