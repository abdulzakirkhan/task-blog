import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../redux/auth/authApi";
import toast from "react-hot-toast";
import { setCredentials } from "../redux/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const user =useSelector((state) => state.auth)
  const dispatch=useDispatch()
  // mutation
  const [login, { isLoading, error }] = useLoginMutation();
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await login({ email, password }).unwrap();
      console.log("Login success result:", result);

      if (!result?.token || !result?.user) {
        toast.error("Invalid credentials");
      } else {
        toast.success("Login successful!");
        dispatch(setCredentials(result))
        navigate("/")
      }
    } catch (err) {
      console.error("Login failed:", err);
      toast.error(err?.data?.message || "Login failed");
    }
  };



  useEffect(() => {
    if(user?.user){
      navigate("/")
    }
  },[])
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Login to Your Account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
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
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          {/* {error && (
            <p className="text-red-500 text-sm">Invalid email or password</p>
          )} */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="mt-4 text-gray-500 text-center text-sm">
          Don't have an account?{" "}
          <span
            className="text-blue-600 hover:underline cursor-pointer"
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}
