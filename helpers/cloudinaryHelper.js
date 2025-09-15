const cloudinary = require("../config/cloudinary");


const uploadToCloudinary = async(filepath) => {
    try{

        const result = await cloudinary.uploader.upload(filepath);

        return {
            url: result.secure_url,
            publicId: result.public_id,
        };

    } catch(err){
        console.log("The error is", err);
        throw new Error("Error while  uploading")
    }
}

module.exports = {uploadToCloudinary}