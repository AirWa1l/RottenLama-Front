import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./API/authContext";
import Login from "./screens/loginScreen/login";
import Register from "./screens/registerScreen/register";
import Recovery from "./screens/recoveryScreen/recovery";
import Principal from "./screens/mainScreen/principal";
import CarrouselScreen from "./screens/carrouselScreen/carrouselScreen";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
  <AuthProvider>
  <Routes>
    <Route path="/" element={<Principal />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} /> 
    <Route path="/recovery" element={<Recovery />} />
    <Route path="/carrousel_principal" element={<CarrouselScreen/>}/>
  </Routes>
  </AuthProvider>
</BrowserRouter>

);