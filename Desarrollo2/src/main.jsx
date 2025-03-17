import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Login from "./screens/loginScreen/login";
import Register from "./screens/registerScreen/register";
import Principal from "./screens/mainScreen/principal";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
  <ToastContainer position="top-right" autoClose={3000} />
  <Routes>
    <Route path="/" element={<Principal />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} /> 
  </Routes>
</BrowserRouter>

);