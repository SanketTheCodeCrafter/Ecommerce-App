import { configureStore } from "@reduxjs/toolkit";
import authReducer from './auth-slice/index.js';
import adminProductsSlice from "./admin/products-slic/index.js";
import shopProducts from "./shop/product-slice/index.js";
import shopCartSlice from "./shop/cart-slice/index.js";

const store = configureStore({
    reducer: {
        auth: authReducer,
        adminProductsSlice: adminProductsSlice,
        shopProducts: shopProducts,
        shopCart: shopCartSlice,
    }
})

export { store }

