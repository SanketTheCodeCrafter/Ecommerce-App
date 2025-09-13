import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const initialState={
    isLoading: false,
    addressList: [],
};

export const addNewAddress = createAsyncThunk('/address/addNewAddress',
    async(formData)=>{
        const response = await axios.post(
            `${API_BASE_URL}/api/shop/address/add`,
            formData,
        );

        return response.data;
    }
);

export const fetchAllAddress = createAsyncThunk('/address/fetchAllAddress',
    async(userId)=>{
        const response= await axios.get(
            `${API_BASE_URL}/api/shop/address/get/${userId}`
        );

        return response.data;
    }
);

export const editanAddress=createAsyncThunk('/address/editanAddress',
    async({userId, addressId, formData})=>{
        const response=await axios.put(
            `${API_BASE_URL}/api/shop/address/update/${userId}/${addressId}`, 
            formData
        );

        return response.data;
    }
);

export const deleteAddress=createAsyncThunk('/address/deleteAddress',
    async({userId, addressId})=>{
        const response = await axios.delete(
            `${API_BASE_URL}/api/shop/address/delete/${userId}/${addressId}`
        );

        return response.data
    }
);

const addressSlice=createSlice({
    name: 'address',
    initialState,
    reducers: {},
    extraReducers: (builder)=>{
        builder
            .addCase(addNewAddress.pending, (state)=>{
                state.isLoading=true;
            })
            .addCase(addNewAddress.fulfilled, (state, action)=>{
                state.isLoading=false;
            })
            .addCase(addNewAddress.rejected, (state)=>{
                state.isLoading=false;
            })
            .addCase(fetchAllAddress.pending, (state)=>{
                state.isLoading=true;
            })
            .addCase(fetchAllAddress.fulfilled, (state, action)=>{
                state.isLoading=false;
                state.addressList=action.payload.data;
            })
            .addCase(fetchAllAddress.rejected, (state)=>{
                state.isLoading=false;
                state.addressList=[];
            })
    }
})

export default addressSlice.reducer;