import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQueryWithReauth'; // ✅ Correct import

export const api = createApi({
  reducerPath: 'api',
  tagTypes: [
    'GetAllBlogs',
  ],
  baseQuery: baseQueryWithReauth,
  refetchOnReconnect: true,
  endpoints: () => ({}),
});
