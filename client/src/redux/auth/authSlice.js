// authSlice.js
import { createSlice } from "@reduxjs/toolkit";


const initialState = {
  token: null,
  user: null,
  isAuthenticated: false,
  refreshToken:null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // payload: { token, user, refreshToken? }
    setCredentials: (state, action) => {
      const { token = null, user = null} = action.payload || {};
      state.token = token;
      state.refreshToken = token;
      state.user = user;
      state.isAuthenticated = !!token;
    },

    

    logOut: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.refreshToken =null
    },
  },
});

export const { setCredentials, logOut } = authSlice.actions;
export default authSlice.reducer;
