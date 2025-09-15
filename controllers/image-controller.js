const Image = require("../models/image");
const {uploadToCloudinary} = require("../helpers/cloudinaryHelper");
const fs = require('fs');
const cloudinary = require("../config/cloudinary")

const uploadImage = async(req,res)=>{
    try{
        // check if file is missing
        if(!req.file){
            return res.status(400).json({
                success: false,
                message: "Please upload a file"
            });
        }

        const {url,publicId} = await uploadToCloudinary(req.file.path);

        //store in db
        const newImage = new Image({
            url,
            publicId,
            uploadedBy: req.userInfo.userId,
        });

        await newImage.save();

        // to delete from localstorage
         fs.unlinkSync(req.file.path);

        res.status(200).json({
            succes: true,
            message: 'Image Uploaded Sucessfully',
            ImageUrl: url
        })
    

    } catch(err){
        console.log('the error is',err);
        res.status(500).json({
            success: false,
            message: 'Image upload failed'
        });
    }
}

const fetchImages = async(req,res)=>{
    try{
       
        const page = parseInt(req.query.page)  || 1;
        const limit = parseInt(req.params.limit) || 2;
        const skip = (page-1)*limit;
        const sortBy = req.query.sortBy || 'createdAt';
        const sortOrder = req.query.sortOrder === 'asc'? 1 : -1;
        const totalImages = await Image.countDocuments();
        const totalPages = Math.ceil(totalImages/limit);

        const sortObj = {};
        sortObj[sortBy] = sortOrder;
        const images = await Image.find({}).sort(sortObj).skip(skip).limit(limit);
       
        if(images){
            res.status(200).json({
                success: true,
             message: 'Images found successfully',
                data: images,
                pagination : {
                    currentPage: page,
                    totalPages: totalPages,
                    totalImages: totalImages,
                    limit : limit,
                },
            })
        }
        else{
            res.status(200).json({
                success: true,
                message: 'No image found'
            })
        }
    

    } catch(err){
        console.log('the error is',err);
        res.status(500).json({
            success: false,
            message: 'Image fetching failed'
        });
    }
}

const deleteImage = async(req,res)=>{
    try{
        const imageId = req.params.id;

        const userId = req.userInfo.userId;

        const findImage = await Image.findById(imageId);
        if(!findImage){
            return res.status(400).json({
                success: false,
                message: "Please send valid image id"
            });
        }

        if(findImage.uploadedBy.toString() !== userId){
            return res.status(400).json({
                success: false,
                message: "You have not uploaded the image. Those who uploaded only can delete"
            })
        }

        // delete this image from cloudinary
        await cloudinary.uploader.destroy(findImage.publicId);

        await Image.findByIdAndDelete(imageId);

        res.status(200).json({
            success: true,
            message: "Image deleted successfully"
        });

    } catch(err){
        console.log('the error is',err);
        res.status(500).json({
            success: false,
            message:'Image is not deleted'
        });
    }
}

module.exports = {uploadImage, fetchImages,deleteImage};