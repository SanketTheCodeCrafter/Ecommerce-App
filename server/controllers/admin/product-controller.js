import { imageUploadUtil } from "../../helper/cloudinary.js";
import Product from "../../models/Product.js";



export const handleImageUpload = async (req, res) => {
    try {
        const b64 = Buffer.from(req.file.buffer).toString('base64');
        const url = 'data:' + req.file.mimetype + ';base64,' + b64;
        const result = await imageUploadUtil(url);

        res.json({
            success: true,
            url: result.url,
            message: "Image uploaded successfully!",
            result
        })
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: "Error occured",
        })
    }
}

export const addProduct = async (req, res) => {
    try {
        const {
            image,
            title,
            description,
            category,
            brand,
            price,
            salePrice,
            totalStock
        } = req.body;

        const newlyCreatedProduct = new Product({
            image,
            title,
            description,
            category,
            brand,
            price,
            salePrice,
            totalStock
        });

        await newlyCreatedProduct.save();
        res.status(201).json({
            success: true,
            data: newlyCreatedProduct,
            message: "Product added successfully!"
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error occurred!"
        });
    }
}

export const fetchAllProducts = async (req, res) => {
    try {
        const listOfProducts = await Product.find({}).sort({ createdAt: -1 })
        res.status(200).json({
            success: true,
            data: listOfProducts,
            message: "Products fetched successfully!"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error occurred!"
        });
    }
}

export const editProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            image,
            title,
            description,
            category,
            brand,
            price,
            salePrice,
            totalStock
        } = req.body;

        let findProduct = await Product.findById(id);
        if (!findProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found!"
            })
        }

        findProduct.title = title || findProduct.title;
        findProduct.description = description || findProduct.description;
        findProduct.category = category || findProduct.category;
        findProduct.brand = brand || findProduct.brand;
        findProduct.price = price === "" ? 0 : price || findProduct.price;
        findProduct.salePrice =
            salePrice === "" ? 0 : salePrice || findProduct.salePrice;
        findProduct.totalStock = totalStock || findProduct.totalStock;
        findProduct.image = image || findProduct.image;


        await findProduct.save();
        res.status(200).json({
            success: true,
            data: findProduct,
            message: "Product updated successfully!"
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error occurred!"
        });
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const findProduct = await Product.findByIdAndDelete(id);

        if (!findProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found!"
            })
        }

        res.status(200).json({
            success: true,
            message: "Product deleted successfully!"
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error occurred!"
        });
    }
}


// 4.10.13