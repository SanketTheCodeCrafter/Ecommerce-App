import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import apiClient from '../../lib/axios';  // Use the new axios instance

const initialState = {
    isAuthenticated: false,
    isLoading: false, // Changed to false - don't block initial render
    user: null,
    authChecked: false // Track if we've attempted to check auth
}

export const registerUser = createAsyncThunk('/auth/register',
    async (formData)=>{
        const response = await apiClient.post('/api/auth/register', formData);
        return response.data;
    }
)

export const loginUser = createAsyncThunk('/auth/login',
    async (formData)=>{
        const response = await apiClient.post('/api/auth/login', formData);
        return response.data;
    }
)

export const logOut = createAsyncThunk('/auth/logout',
    async () => {
        const response = await apiClient.post('/api/auth/logout', {});
        return response.data;
    }
)

export const checkAuth = createAsyncThunk('/auth/check-auth',
    async (_, { rejectWithValue })=>{
        // Fast-fail: Check if token cookie exists before making API call
        // This avoids unnecessary network requests when user is not logged in
        const hasToken = document.cookie.split(';').some(c => c.trim().startsWith('token='));
        
        if (!hasToken) {
            // No token cookie, user is definitely not authenticated
            return rejectWithValue({ success: false, message: 'No token found' });
        }

        try {
            // Add timeout to prevent hanging (5 seconds max)
            const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Auth check timeout')), 5000)
            );
            
            const response = await Promise.race([
                apiClient.get('/api/auth/check-auth', {
                    headers: {
                        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate"
                    },
                    timeout: 5000 // Axios timeout
                }),
                timeoutPromise
            ]);
            
            return response.data;
        } catch (error) {
            // If it's a timeout or network error, fail gracefully
            return rejectWithValue({ 
                success: false, 
                message: error.message || 'Auth check failed' 
            });
        }
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
                // Don't set isLoading to true - allow pages to render while checking
                state.authChecked = false;
            })
            .addCase(checkAuth.fulfilled, (state, action)=>{
                state.isLoading=false;
                state.authChecked = true;
                state.isAuthenticated= action.payload.success;
                state.user = action.payload.success ? action.payload.user : null;
            })
            .addCase(checkAuth.rejected, (state, action)=>{
                state.isLoading=false;
                state.authChecked = true;
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