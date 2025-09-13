import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const initialState = {
    isLoading: false,
    productList: [],
    productDetails: null,
}

export const fetchAllFilteredProducts = createAsyncThunk('/products/fetchAllProducts', 
    async ({filterParams, sortParams })=>{
        
        const query = new URLSearchParams({
            ...filterParams,
            sortBy: sortParams,
        })
    const result = await axios.get(
        `${API_BASE_URL}/api/shop/products/get?${query}`
    )


    return result?.data;
})

export const fetchProductDetails = createAsyncThunk('/products/fetchProductDetails', 
    async (productId)=>{
        
    const result = await axios.get(
        `${API_BASE_URL}/api/shop/products/get/${productId}`
    )


    return result?.data;
})

const shoppingProductSlice = createSlice({
    name: 'shoppingProducts',
    initialState,
    reducers: {
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setProductList: (state, action) => {
            state.productList = action.payload;
        },
        setProductDetails: (state, action)=>{
            state.productDetails = null;
        }
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchAllFilteredProducts.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(fetchAllFilteredProducts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.productList = action.payload.data;
            })
            .addCase(fetchAllFilteredProducts.rejected, (state, action) => {
                state.isLoading = false;
                state.productList = [];
            })
            .addCase(fetchProductDetails.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(fetchProductDetails.fulfilled, (state, action) => {
                state.isLoading = false;
                state.productDetails = action.payload.data;
            })
            .addCase(fetchProductDetails.rejected, (state, action) => {
                state.isLoading = false;
                state.productDetails = null;
            })
    }
})

export const { setLoading, setProductList, setProductDetails } = shoppingProductSlice.actions;
export default shoppingProductSlice.reducer;