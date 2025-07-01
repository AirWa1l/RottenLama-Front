import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./API/authContext";
import Login from "./screens/loginScreen/login";
import Register from "./screens/registerScreen/register";
import Recovery from "./screens/recoveryScreen/recovery";
import Principal from "./screens/mainScreen/principal";
import CarrouselScreen from "./screens/carrouselScreen/carrouselScreen";
import CategoriesScreen from "./screens/categoriesScreen/categoriesScreen";
import MyReviewsScreen from "./screens/myReviewsScreen/myReviewsScreen";
import PremieresScreen from "./screens/premieresScreen/PremieresScreen";


ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Principal />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/recovery" element={<Recovery />} />
        <Route path="/carrousel_principal" element={<CarrouselScreen />} />
        <Route path="/categories" element={<CategoriesScreen />} />
        <Route path="/my-reviews" element={<MyReviewsScreen />} />
        <Route path="/premieres" element={<PremieresScreen />} />
        
      </Routes>
    </AuthProvider>
  </BrowserRouter>
);