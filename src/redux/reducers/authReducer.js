import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const login = createAsyncThunk('auth/login', async (data, { rejectWithValue }) => {
  try {

    const user = {
      id: 1,
      name: 'John Doe',
      email: 'johnDoe@gmail.com'
    };
    const token = 'fake-jwt-token';

    return { user, token };
  } catch (err) {

    return rejectWithValue(err.message);
  }
});

const initialState = {
  user: null,
  token: null,
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
    },
  },

  extraReducers: builder => {
    builder.addCase(login.pending, (state, action) => {
      state.next = null;
    });

    builder.addCase(login.fulfilled, (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isLoggedIn = true;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.next = action.payload;
    });
  }

});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
