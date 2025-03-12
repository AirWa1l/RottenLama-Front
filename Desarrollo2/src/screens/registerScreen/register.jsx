import React from "react";
import { FaGoogle, FaGithub, FaTwitter } from "react-icons/fa";
import "./register.css"; 
import { Link } from "react-router-dom";
import AnimatedBackground from "../../components/particles/particles";

const Register = () => {
  return (
    <div className="register-wrapper">
      <AnimatedBackground />
      <header id="header">
        <div id="header-content">
          <div className="logo">
            <img src="../../public/logo.png" alt="Logo" />
          </div>
          <h2>Become a Cinephile</h2>
          <p className="subtitle">
            Look for the best-reviewed movies and save your favorites for later!
          </p>
        </div>
      </header>
      
      <div className="register-container">
        <form className="register-form">
          <input type="text" placeholder="Username" required />
          <input type="email" placeholder="Email Address" required />
          <input type="password" placeholder="Password" required />
          <input type="password" placeholder="Confirm password" required />
          <button type="submit" className="btn-gradient">Continue</button>
        </form>

        <div className="social-login-register">
          <p>Or sign up with</p>
          <div className="social-icons-register">
            <button className="icon-btn google"><FaGoogle /></button>
            <button className="icon-btn github"><FaGithub /></button>
            <button className="icon-btn twitter"><FaTwitter /></button>
          </div>
        </div>

        <p className="login-link">
          Have an account? <Link to="/">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;