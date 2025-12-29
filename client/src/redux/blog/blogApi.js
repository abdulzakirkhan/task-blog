// src/redux/auth/authApi.js
import { api } from "../service";

export const blogModuleApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllBlogs: builder.query({
      query: () => {
        return {
          url: "posts/",
          method: "GET",
        };
      },
      providesTags: ["GetAllBlogs"],
    }),

    getBlogById: builder.query({
      query: (body) => {
        return {
          url: `posts/${body.id}`,
          method: "GET",
        };
      },
      providesTags: ["GetAllBlogs"],
    }),



    createNewPost: builder.mutation({
      query: (body) => {
        return {
          url: "posts/",
          method: "POST",
          body
        };
      },
      invalidatesTags: ["GetAllBlogs"],
    }),

    deleteBlog: builder.mutation({
      query: (body) => {
        const id=body?.id;
        return {
          url: `posts/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["GetAllBlogs"],
    }),

    
    // Add more auth endpoints as needed
  }),
});

export const {
    useGetAllBlogsQuery,
    useCreateNewPostMutation,
    useDeleteBlogMutation,
    useGetBlogByIdQuery
} = blogModuleApi;
