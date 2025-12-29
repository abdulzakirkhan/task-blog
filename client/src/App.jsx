import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home";
import Register from "./pages/Register";
import CreatePost from "./pages/CreatePost";
import PostDetail from "./pages/PostDetail";
import Login from "./pages/Login";
import { Provider } from "react-redux";
import store from "./redux/store";
import Protected from "./pages/Protected";

function App() {
  return (
    <Provider store={store}>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/create"
            element={
              <Protected>
                <CreatePost />
              </Protected>
            }
          />
          <Route
            path="/edit/:id"
            element={
              <Protected>
                <CreatePost />
              </Protected>
            }
          />
          <Route path="/posts/:id" element={<PostDetail />} />
          
        </Routes>
        <Toaster position="top-right" reverseOrder={false} />

        
    </Provider>
  );
}

export default App;
