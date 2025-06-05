import express from 'express';
import { upload } from '../../helper/cloudinary.js';
import { handleImageUpload } from '../../controllers/admin/product-controller.js';

const router=express.Router();

router.post('/upload-image', upload.single('my_file'), handleImageUpload)

export default router;