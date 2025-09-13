import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const initialState = {
    isAuthenticated: false,
    isLoading: true,
    user: null
}

export const registerUser = createAsyncThunk('/auth/register',
    async (formData)=>{
        const response = await axios.post(`${API_BASE_URL}/api/auth/register`, formData, {
            withCredentials: true,
        });
        return response.data;
    }
)

export const loginUser = createAsyncThunk('/auth/login',
    async (formData)=>{
        const response = await axios.post(`${API_BASE_URL}/api/auth/login`, formData, {
            withCredentials: true,
        });
        return response.data;
    }
)

export const logOut = createAsyncThunk('/auth/logout',
    async () => {
        const response = await axios.post(
            `${API_BASE_URL}/api/auth/logout`,
            {}, 
            { withCredentials: true }
        );
        return response.data;
    }
)

export const checkAuth = createAsyncThunk('/auth/check-auth',
    async ()=>{
        const response = await axios.get(`${API_BASE_URL}/api/auth/check-auth`, {
            withCredentials: true,
            headers: {
                "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate"
            }
        });
        return response.data;
    }
)

const authSlice= createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action)=>{

        }
    },
    extraReducers: (builder)=>{
        builder
            .addCase(registerUser.pending, (state)=>{
                state.isLoading=true;
            })
            .addCase(registerUser.fulfilled, (state, action)=>{
                state.isLoading=false;
                state.isAuthenticated= false;
                state.user = null;
            })
            .addCase(registerUser.rejected, (state, action)=>{
                state.isLoading=false;
                state.isAuthenticated=false;
                state.user=null;
            })
            .addCase(loginUser.pending, (state)=>{
                state.isLoading=true;
            })
            .addCase(loginUser.fulfilled, (state, action)=>{
                state.isLoading=false;
                state.isAuthenticated= action.payload.success;
                state.user = action.payload.success ? action.payload.user : null;
            })
            .addCase(loginUser.rejected, (state, action)=>{
                state.isLoading=false;
                state.isAuthenticated=false;
                state.user=null;
            })
            .addCase(checkAuth.pending, (state)=>{
                state.isLoading=true;
            })
            .addCase(checkAuth.fulfilled, (state, action)=>{
                state.isLoading=false;
                state.isAuthenticated= action.payload.success;
                state.user = action.payload.success ? action.payload.user : null;
            })
            .addCase(checkAuth.rejected, (state, action)=>{
                state.isLoading=false;
                state.isAuthenticated=false;
                state.user=null;
            })
            .addCase(logOut.pending, (state)=>{
                state.isLoading=true;
            })
            .addCase(logOut.fulfilled, (state, action)=>{
                state.isLoading=false;
                state.isAuthenticated= false;
                state.user = null;
            })
            .addCase(logOut.rejected, (state, action)=>{
                state.isLoading=false;
                state.isAuthenticated=false;
                state.user=null;
            })
    }
})

export const { setUser} = authSlice.actions;
export default authSlice.reducer;