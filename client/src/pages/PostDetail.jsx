import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetBlogByIdQuery } from "../redux/blog/blogApi";

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: blog, error, isLoading } = useGetBlogByIdQuery({ id });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading blog...</p>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 text-lg">Blog not found or error occurred.</p>
      </div>
    );
  }

  // Calculate read time (approx 200 words per min)
  const readTime = Math.ceil(blog.content.split(" ").length / 200);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-blue-600 hover:underline font-medium"
        >
          &larr; Back
        </button>

        {/* Blog Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{blog.title}</h1>

        {/* Author Info */}
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
            {blog.authorId?.name?.charAt(0)}
          </div>
          <div className="ml-4">
            <p className="font-medium text-gray-800">{blog.authorId?.name}</p>
            <p className="text-sm text-gray-500">
              {new Date(blog.createdAt).toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}{" "}
              • {readTime} min read
            </p>
          </div>
        </div>

        {/* Blog Content */}
        <div
          className="prose prose-lg max-w-none text-gray-800"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        ></div>
      </div>
    </div>
  );
}
