import { v2 as cloudinary } from "cloudinary"
import fs from "fs"

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_SECRET

})

const uploadOnCloudinary = async (LocalPath) => {
    try {
        if (!LocalPath){
            console.log("local filepath not found");
        }
        const response = await cloudinary.uploader.upload(LocalPath, {
            resource_type: "auto"
        })
        fs.unlinkSync(LocalPath)
        return response


    } catch (error) {
        console.log("error while uploading cloudinary");
        fs.unlinkSync(LocalPath)

    }
}

export { uploadOnCloudinary }