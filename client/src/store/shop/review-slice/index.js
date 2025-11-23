import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const initialState = {
    isLoading: false,
    reviews: [],
};

export const addReview = createAsyncThunk(
    '/order/addReview',
    async (formdata, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/api/shop/review/add`,
                formdata
            );
            return response.data;
        } catch (error) {
            const message = error?.response?.data?.message || 'Failed to add review';
            return rejectWithValue({ message });
        }
    }
)

export const getReviews = createAsyncThunk(
    '/order/getReviews',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/shop/review/${id}`);
            return response.data;
        } catch (error) {
            const message = error?.response?.data?.message || 'Failed to fetch reviews';
            return rejectWithValue({ message });
        }
    }
);

const reviewSlice = createSlice({
    name: 'reviewSlice',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // getReviews cases
            .addCase(getReviews.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getReviews.fulfilled, (state, action) => {
                state.isLoading = false;
                state.reviews = action.payload?.data || [];
            })
            .addCase(getReviews.rejected, (state, action) => {
                state.isLoading = false;
                state.reviews = [];
            })
            // addReview cases
            .addCase(addReview.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(addReview.fulfilled, (state, action) => {
                state.isLoading = false;
                // Optionally add the new review to the list immediately
                if (action.payload?.data) {
                    state.reviews = [...state.reviews, action.payload.data];
                }
            })
            .addCase(addReview.rejected, (state, action) => {
                state.isLoading = false;
            })
    }
})

export default reviewSlice.reducer;