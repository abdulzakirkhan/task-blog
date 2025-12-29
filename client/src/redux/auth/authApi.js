
// src/redux/auth/authApi.js
import { api } from '../service';

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    signUp: builder.mutation({
      query: (body) => {
        return {
          url:`auth/register`,
          method: 'POST',
          body,
        };
      },
    }),
    login: builder.mutation({
      query: (body) => {
        return {
          url:`auth/login`,
          method: 'POST',
          body,
        };
      },
    }),
    

  }),
});

export const { 
  useSignUpMutation,
  useLoginMutation,
} = authApi;