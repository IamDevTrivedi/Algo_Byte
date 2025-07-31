import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosClient from './utils/axiosClient'

export const registerVerifiedUser = createAsyncThunk(
  'auth/registerVerifiedUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await axiosClient.post("/user/register", {
        credentials
      });
      return res.data.user;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Verification failed" });
    }
  }
);


export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post('/user/login', credentials);
      return response.data.user;
    } catch (error) {
      return rejectWithValue({
        message: error?.response?.data?.message || error.message || 'Login failed',
        status: error?.response?.status || 500,
      });
    }
  }
);



export const checkAuth = createAsyncThunk(
  'auth/check',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosClient.get('/user/check-auth');
      //token has been sent by browser.......
      return data.user;
    } catch (error) {
      return rejectWithValue({
        message: error?.response?.data?.message || error.message || 'Auth failed',
        status: error?.response?.status || 500,
      });
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await axiosClient.post('/user/logout');
      return null;
    } catch (error) {
      return rejectWithValue({
        message: error?.response?.data?.message || error.message || 'Logout failed',
        status: error?.response?.status || 500,
      });
    }
  }
);


export const getUserImage = createAsyncThunk(
  'auth/getUserImage',
  async (_, { rejectWithValue }) => {
    try {
      const img=await axiosClient.get('/image/getImage');
      return img.data;
    } catch (error) {
      return rejectWithValue({
        message: error?.response?.data?.message || error.message || 'Logout failed',
        status: error?.response?.status || 500,
      });
    }
  }
);

export const allProblemsFetch = createAsyncThunk(
  'auth/allfetch',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosClient.get('/problem/getAllProblem');
      
      return data;
    } catch (error) {
      return rejectWithValue({
        message: error?.response?.data?.message || error.message || 'Error in fetching',
        status: error?.response?.status || 500,
      });
    }
  }
);


const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: undefined,
    loading: false,
    error: null,
    problemsBySlice:null,
    userImage:null
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    setAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register User Cases
      .addCase(registerVerifiedUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerVerifiedUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = !!action.payload;
        state.user = action.payload;
      })
      .addCase(registerVerifiedUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Something went wrong';
        state.isAuthenticated = false;
        state.user = null;
      })
  
      // Login User Cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = !!action.payload;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Something went wrong';
        state.isAuthenticated = false;
        state.user = null;
      })
  
      // Check Auth Cases
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
        state.isAuthenticated = undefined;
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = !!action.payload;
        state.user = action.payload;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Something went wrong';
        state.isAuthenticated = false;
        state.user = null;
      })

      // allProblemFetch cases
      .addCase(allProblemsFetch.pending, (state) => {
        
        state.error = null;
      })
      .addCase(allProblemsFetch.fulfilled, (state, action) => {
        
        state.problemsBySlice = action.payload;
      })
      .addCase(allProblemsFetch.rejected, (state, action) => {
        
        state.error = action.payload?.message || 'Something went wrong';
        state.problemsBySlice = false;
        
      })

      .addCase(getUserImage.pending, (state) => {
        
        state.error = null;
      })
      .addCase(getUserImage.fulfilled, (state, action) => {
        
        state.userImage = action.payload;
      })
      .addCase(getUserImage.rejected, (state, action) => {
        
        state.error = action.payload?.message || 'Something went wrong';
        state.userImage = false;
        
      })
  
      // Logout User Cases
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Something went wrong';
        state.isAuthenticated = false;
        state.user = null;
      });
  }
});

export const { setUser, setAuthenticated } = authSlice.actions;
export default authSlice.reducer;