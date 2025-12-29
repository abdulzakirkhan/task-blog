import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logOut } from "./auth/authSlice";
import { api as apiSlice } from "./service";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:5000/",
  prepareHeaders: (headers, { getState }) => {
    const token = getState()?.auth?.token;
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});

export const baseQueryWithReauth = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);


  // 401 Unauthorized → logout user
  if (result?.error?.status === 401) {
    console.warn("Unauthorized, logging out...");
    api.dispatch(logOut());
    api.dispatch(apiSlice.util.resetApiState());
  }

  return result;
};
