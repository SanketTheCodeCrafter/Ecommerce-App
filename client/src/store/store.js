import { configureStore } from "@reduxjs/toolkit";
import authReducer from './auth-slice/index.js';
import adminProductsSlice from "./admin/products-slic/index.js";

const store = configureStore({
    reducer: {
        auth: authReducer,
        adminProductsSlice: adminProductsSlice
    }
})

export { store }

