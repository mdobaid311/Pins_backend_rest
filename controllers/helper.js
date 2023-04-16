const cloudinary = require('cloudinary').v2;
const fs = require('fs');

const uploadImage = async (req, res) => {
    console.log(req.files.image)

    const result = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
        use_filename: true,
        folder: "skai"
    })
    fs.unlinkSync(req.files.image.tempFilePath);
    return res.status(200).json({
        image: {
            src: result.secure_url
        }
    });

}

module.exports = {
    uploadImage
}  