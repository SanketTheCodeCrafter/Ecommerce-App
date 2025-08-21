import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    approvalUrl: null,
    isLoading: false,
    orderId: null,
    orderList: [],
    orderDetails: null,
};

export const createNewOrder = createAsyncThunk('order/createNewOrder', async (orderData) => {
    const response = await axios.post('http://localhost:5000/api/shop/order/create', orderData);

    return response.data;
})

export const capturePayment = createAsyncThunk('order/capturePayment', async ({ paymentId, payerId, orderId }) => {
    const response = await axios.post('http://localhost:5000/api/shop/order/capture-payment', { paymentId, payerId, orderId });

    return response.data;
});

export const getAllOrdersByUser = createAsyncThunk('/order/getAllOrderByUser',
    async (userId) => {
        const response = await axios.get(`http://localhost:5000/api/shop/order/list/${userId}`);

        return response.data;
    }
);

export const getOrderDetails = createAsyncThunk('/order/getOrderDetails',
    async (orderId) => {
        const response = await axios.get(`http://localhost:5000/api/shop/order/details/${orderId}`);

        return response.data;
    }
)

const ShoppingOrderSlice = createSlice({
    name: 'shoppingOrderSlice',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(createNewOrder.pending, (state) => {
            state.isLoading = true;
        })
        builder.addCase(createNewOrder.fulfilled, (state, action) => {
            state.isLoading = false;
            state.approvalUrl = action.payload.approvalUrl;
            state.orderId = action.payload.orderId;
            sessionStorage.setItem('currentOrderId', JSON.stringify(action.payload.orderId));
        })
        builder.addCase(createNewOrder.rejected, (state) => {
            state.isLoading = false;
            state.approvalUrl = null;
            state.orderId = null;
        })
        builder.addCase(getAllOrdersByUser.pending, (state) => {
            state.isLoading = true;
        })
        builder.addCase(getAllOrdersByUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.orderList = action.payload.data;
        })
        builder.addCase(getAllOrdersByUser.rejected, (state, action) => {
            state.isLoading = false;
            state.orderList = [];
        })
        builder.addCase(getOrderDetails.pending, (state) => {
            state.isLoading = true;
        })
        builder.addCase(getOrderDetails.fulfilled, (state, action) => {
            state.isLoading = false;
            state.orderDetails = action.payload.data;
        })
        builder.addCase(getOrderDetails.rejected, (state, action) => {
            state.isLoading = false;
            state.orderDetails = null;
        })
    },
});

export default ShoppingOrderSlice.reducer;