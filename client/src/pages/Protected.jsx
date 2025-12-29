import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function Protected({ children }) {
  const user = useSelector((state) => state.auth.user);

  if (!user) {
    // no login
    return <Navigate to="/login" replace />;
  }

  // if user loggedin
  return <>{children}</>;
}
