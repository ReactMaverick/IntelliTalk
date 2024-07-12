import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { LOGIN_URL, REGISTER_URL } from '@/values/api/url';
import { postData, postFormData } from '@/values/api/apiprovider';
import { showToast } from '@/constants/constants';
import { UPDATE_USER_URL, VERIFY_OTP_URL } from '../../values/api/url';
import { UNAUTHORIZED_ERROR_CODE } from '../../values/api/statusCodes';

export const register = createAsyncThunk('auth/register', async (data, { rejectWithValue }) => {
  try {

    const { name, email, mobile, dob, password, image } = data;

    // console.log('data', data);

    const formData = new FormData();

    formData.append('name', name);
    email && formData.append('email', email);
    formData.append('mobile', mobile);
    formData.append('dob', dob);
    formData.append('password', password);
    image && formData.append('file', image);

    const response = await postFormData(REGISTER_URL, formData);

    console.log('response in async thunk', response);

    if (!response.isSuccess) {
      // console.log('response.message', response.message);
      showToast('error', response.message);
      return rejectWithValue(response.message);
    } else {
      showToast('success', response.message);

      return response.data;
    }


  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const login = createAsyncThunk('auth/login', async (data, { rejectWithValue }) => {
  try {

    const { email, password } = data;

    const response = await postData(LOGIN_URL, { email, password });

    if (!response.isSuccess) {
      // console.log('response.message', response.message);
      showToast('error', response.message);
      return rejectWithValue(response.message);
    } else {
      showToast('success', response.message);

      return response.data;
    }

  } catch (err) {

    return rejectWithValue(err.message);
  }
});

export const updateProfile = createAsyncThunk('auth/updateProfile', async (data, { rejectWithValue, dispatch }) => {
  try {

    console.log('Profile update data in async thunk ==> ', data);

    const { name, email, mobile, dob, image, token, userId } = data;

    const formData = new FormData();

    name && formData.append('name', name);
    email && formData.append('email', email);
    mobile && formData.append('mobile', mobile);
    dob && formData.append('dob', dob);
    image && formData.append('file', image);

    const response = await postFormData(UPDATE_USER_URL(userId), formData, token);

    console.log('profile update response in async thunk', response);

    if (response.isSuccess) {
      showToast('success', response.message);
      return response.data;
    } else if (response.code === UNAUTHORIZED_ERROR_CODE) {
      dispatch(logout());
      return rejectWithValue(response.message);
    } else {
      showToast('error', response.message);
      return rejectWithValue(response.message);
    }

  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const verifyOTP = createAsyncThunk('auth/verifyOTP', async (data, { rejectWithValue }) => {
  try {

    const { mobile, otp } = data;

    const response = await postData(VERIFY_OTP_URL, { otp, mobile });

    if (!response.isSuccess) {
      showToast('error', response.message);
      return rejectWithValue(response);
    } else {
      showToast('success', response.message);

      return response.data;
    }

  } catch (err) {
    return rejectWithValue(err.message);
  }
});


const initialState = {
  user: null,
  token: null,
  openAIKey: null, // OpenAI API Key
  isLoggedIn: false,
  next: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.isLoggedIn = false;
      state.next = null;
      state.openAIKey = null;
    },
  },

  extraReducers: builder => {

    builder.addCase(register.pending, (state, action) => {
      state.next = null;
    });

    builder.addCase(register.fulfilled, (state, action) => {
      // console.log('action.payload', action.payload);
      state.user = action.payload.user;
      state.next = action.payload.next;
    });

    builder.addCase(register.rejected, (state, action) => {
      state.next = null;
    });

    builder.addCase(login.pending, (state, action) => {
      state.next = null;
    });

    builder.addCase(login.fulfilled, (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.openAIKey = action.payload.openAIKey;
      state.next = action.payload.next;
      if (action.payload.token) {
        state.isLoggedIn = true;
      }
    });
    builder.addCase(login.rejected, (state, action) => {
      state.next = null;
    });

    builder.addCase(verifyOTP.pending, (state, action) => {
      state.next = null;
    });
    builder.addCase(verifyOTP.fulfilled, (state, action) => {
      console.log('action.payload fulfilled ==> ', action.payload);
      state.user = action.payload.user;
      state.next = action.payload.next;
      if (action.payload.token) {
        state.isLoggedIn = true;
      }
    });
    builder.addCase(verifyOTP.rejected, (state, action) => {
      console.log('action.payload rejected ==> ', action.payload);
      state.next = action.payload.data.next;
    });

    builder.addCase(updateProfile.pending, (state, action) => {
      state.next = null;
    });
    builder.addCase(updateProfile.fulfilled, (state, action) => {
      state.user = action.payload.user;
      state.next = action.payload.next;
      if (action.payload.next === 'verifyOTP') {
        state.isLoggedIn = false;
      }
    });
    builder.addCase(updateProfile.rejected, (state, action) => {
      state.next = null;
    });
  }

});

export const selectUser = state => state.authReducer.user;
export const selectToken = state => state.authReducer.token;
export const selectOpenAIKey = state => state.authReducer.openAIKey;
export const selectNext = state => state.authReducer.next;
export const { logout } = authSlice.actions;
export const isLoggedIn = state => state.authReducer.isLoggedIn;
export default authSlice.reducer;
