import cloudinaryModule from "cloudinary";
import multer from "multer";
const cloudinary = cloudinaryModule.v2;

cloudinary.config({
  cloud_name: "dvhifzvri",
  api_key: "493895111257537",
  api_secret: "mVad5jZ95pd-amMoHYYkpK4K-8Q",
});

const storage = multer.memoryStorage();

export async function imageUploadUtil(file){
    const result = await cloudinary.uploader.upload(file, {
        resource_type: "auto",
    });
    return result;
}

export const upload = multer({storage});