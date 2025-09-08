import { configureStore } from "@reduxjs/toolkit";
import authReducer from './auth-slice/index.js';
import adminProductsSlice from "./admin/products-slic/index.js";
import adminOrderSlice from "./admin/order-slice/index.js";
import shopProducts from "./shop/product-slice/index.js";
import shopCartSlice from "./shop/cart-slice/index.js";
import shopAddressSlice from "./shop/address-slice/index.js";
import shopOrderSlice from "./shop/order-slice/index.js";
import shopSearchSlice from "./shop/search-slice/index.js";

const store = configureStore({
    reducer: {
        auth: authReducer,

        adminProductsSlice: adminProductsSlice,
        adminOrder: adminOrderSlice,
        
        shopProducts: shopProducts,
        shopCart: shopCartSlice,
        shopAddress: shopAddressSlice,
        shopOrder: shopOrderSlice,
        shopSearch: shopSearchSlice,
    }
})

export { store }

