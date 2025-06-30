import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    isLoading: false,
    productList: [],
}

export const fetchAllFilteredProducts = createAsyncThunk('/products/fetchAllProducts', async (formData)=>{
    const result = await axios.get("http://localhost:5000/api/shop/products/get")

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
    }
})

export const { setLoading, setProductList } = shoppingProductSlice.actions;
export default shoppingProductSlice.reducer;