import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home";

import React from "react";
import Login from "./pages/Login";

function App() {
  return (

    <React.Fragment>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        
      </Routes>
      <Toaster position="top-right" reverseOrder={false} />
    </React.Fragment>

        
  );
}

export default App;
