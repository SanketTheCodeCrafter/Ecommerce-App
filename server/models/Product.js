import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    image: String,
    title: String,
    description: String,
    category: String,
    brand: String,
    price: Number,
    salePrice: Number,
    totalStock: Number,
}, {timestamps: true});

const Product = mongoose.model('Product', productSchema);
export default Product;