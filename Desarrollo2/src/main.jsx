import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./screens/loginScreen/login";
import Register from "./screens/registerScreen/register";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/Register" element={<Register />} />
    </Routes>
  </BrowserRouter>
);
