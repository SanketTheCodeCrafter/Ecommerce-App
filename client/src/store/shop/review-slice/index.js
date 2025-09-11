import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    isLoading: false,
    reviews: [],
};

export const addReview = createAsyncThunk(
    '/order/addReview',
    async (formdata, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `http://localhost:5000/api/shop/review/add`,
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
            const response = await axios.get(`http://localhost:5000/api/shop/review/${id}`);
            return response.data;
        } catch (error) {
            const message = error?.response?.data?.message || 'Failed to fetch reviews';
            return rejectWithValue({ message });
        }
    }
);

const reviewSlie = createSlice({
    name: 'reviewSlice',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getReviews.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getReviews.fulfilled, (state, action) => {
                state.isLoading = false,
                    state.reviews = action.payload.data;
            })
            .addCase(getReviews.rejected, (state, action) => {
                state.isLoading = false,
                    state.reviews = [];
            })
    }
})

export default reviewSlie.reducer;