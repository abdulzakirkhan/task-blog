import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";
import { useSignUpMutation } from "../redux/auth/authApi";
export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isShow,setIsShow] = useState(false)
  const [isShowConfirm,setIsShowConfirm] = useState(false)
  const navigate = useNavigate();

  // mutaion
  const [signUp, { isLoading, error }] = useSignUpMutation();
  const handleSubmit =async (e) => {
    e.preventDefault();
    const payload ={name,email,password}
    if (password !== confirmPassword) {
      toast.error("Passwords do not match")
      return;
    }
    const result = await signUp(payload).unwrap()

    console.log("result :",result)

    if(result?.token || result?.user){
      toast.success("Sign Up succesfully !")
      navigate("/login")
    }

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Create an Account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 mb-1">Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                type={isShow ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {isShow ? (
                <FaRegEyeSlash
                  className="absolute top-3 right-3 text-lg cursor-pointer"
                  onClick={() => setIsShow(false)}
                />
              ) : (
                <FaRegEye
                  className="absolute top-3 right-3 text-lg cursor-pointer"
                  onClick={() => setIsShow(true)}
                />
              )}

              
              
            </div>
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Confirm Password</label>
            <div className="relative">
              <input
                type={isShowConfirm ? "text" : "password"}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {isShowConfirm ? (
                <FaRegEyeSlash
                  className="absolute top-3 right-3 text-lg cursor-pointer"
                  onClick={() => setIsShowConfirm(false)}
                />
              ) : (
                <FaRegEye
                  className="absolute top-3 right-3 text-lg cursor-pointer"
                  onClick={() => setIsShowConfirm(true)}
                />
              )}
            </div>
          </div>
          {/* {error && <p className="text-red-500 text-sm">{error}</p>} */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
          >
            Register
          </button>
        </form>
        <p className="mt-4 text-gray-500 text-center text-sm">
          Already have an account?{" "}
          <span
            className="text-blue-600 hover:underline cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
