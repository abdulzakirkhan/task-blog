import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useDeleteBlogMutation, useGetAllBlogsQuery } from "../redux/blog/blogApi";
import { useState } from "react";
import toast from "react-hot-toast";
import { logOut } from "../redux/auth/authSlice";
import { api } from "../redux/service";
import Loader from "../components/Loader";

export default function Home() {
  const navigate = useNavigate();
  const user=useSelector((state) => state.auth)
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBlogId, setSelectedBlogId] = useState(null);
  let userId=user?.user?.id;

  const dispatch =useDispatch()

  const { data: blogs, error, isLoading } = useGetAllBlogsQuery();
  const [deleteBlog, { isLoading:deleteBlogLoading }] = useDeleteBlogMutation();


  const handleEditBlog = async (blog) =>{
    console.log("blog",blog)
    navigate("/edit/"+blog?._id)
  }

  const handleDeleteBlog = async (id) => {
    setSelectedBlogId(id);
    setShowDeleteModal(true);
  }

  const handleDelete =async () =>{
    const res =await deleteBlog({id:selectedBlogId})
    const {data} =res;
    if(data?.message == "Post deleted"){
      toast.success(data?.message || "Post Deleted Successfully!")
      setShowDeleteModal(false)
    }else{
      toast.error(data?.message || "Something went wrong")
    }
  }

  const handleLogout = () => {
    dispatch(logOut())
    dispatch(api.util.resetApiState())
  }


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600 cursor-pointer" onClick={() => navigate("/")}>
          BlogApp
        </h1>
        <div className="space-x-4">
          {user?.user && ( 
            <button
              onClick={() => navigate("/create")}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Create New Post
            </button>
          )}
          {!user?.user && (
            <>
              <button
                onClick={() => navigate("/register")}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Register
              </button>
              <button
                onClick={() => navigate("/login")}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Login
              </button>
            </>
          )}
          {user?.user && (
            <button
            onClick={handleLogout}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Log Out
          </button>
          )}
        </div>
      </nav>

      {/* Blog List */}
      <main className="max-w-4xl mx-auto py-8 px-4">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Recent Posts</h2>
        <div className="space-y-4">

          {isLoading && <Loader />}
          {blogs?.length === 0 && <p className="text-2xl mt-12 text-center">No Posts</p>}
          {blogs?.map((blog) => {
              // Check if current user is the author of this blog
              const isAuthor = userId && blog.authorId?._id === userId;
              
              return (
                <div
                  key={blog._id}
                  className="group relative bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-100 overflow-hidden"
                  onClick={() => navigate(`/posts/${blog._id}`)}
                >
                  {/* Author Badge - Only show if user is the author */}
                  {isAuthor && (
                    <div className="absolute top-1 left-4 z-10">
                      <span className="px-3 py-1 bg-blue-100 text-blue-600 text-xs font-semibold rounded-full border border-blue-200 flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Your Post
                      </span>
                    </div>
                  )}
                  
                  {/* Edit/Delete Action Buttons - Only show on hover and if user is author */}
                  {isAuthor && (
                    <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditBlog(blog);
                        }}
                        className="p-2 bg-blue-500 cursor-pointer text-white rounded-lg hover:bg-blue-600 transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                        title="Edit Post"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteBlog(blog._id);
                        }}
                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                        title="Delete Post"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  )}

                  {/* Blog Content */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 mr-4">
                        <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                          {blog?.title}
                        </h3>
                        <div className="flex items-center mt-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isAuthor ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'bg-gradient-to-r from-gray-400 to-gray-500'}`}>
                            <span className="text-white font-semibold">
                              {blog?.authorId?.name?.charAt(0)}
                            </span>
                          </div>
                          <div className="ml-3">
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-gray-800">{blog?.authorId?.name}</p>
                              {isAuthor && (
                                <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded-full font-medium">
                                  Author
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-500">
                              {new Date(blog.createdAt).toLocaleDateString('en-US', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="text-gray-400 group-hover:text-blue-500 transition-colors transform group-hover:translate-x-1">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <div 
                        className="text-gray-600 line-clamp-3 prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: blog?.content.substring(0, 150) + (blog?.content.length > 150 ? '...' : '') }}
                      />
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <span className="inline-flex items-center text-sm text-gray-500">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {new Date(blog?.createdAt).toLocaleDateString()}
                        </span>
                        
                        {/* Read time indicator */}
                        <span className="inline-flex items-center text-sm text-gray-500">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {Math.ceil(blog.content.split(' ')?.length / 200)} min read
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {/* Edit button in footer - only for author */}
                        {isAuthor && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditBlog(blog);
                            }}
                            className="px-3 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-full text-sm font-medium transition-colors flex items-center"
                          >
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                          </button>
                        )}
                        
                        <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors flex items-center">
                          Read More
                          <svg className="w-3 h-3 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </main>

      {/* Modal  */}
      {showDeleteModal && (
        <div className="fixed inset-0.5 flex items-center justify-center z-50 backdrop-blur-sm bg-white/30">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this post?</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
