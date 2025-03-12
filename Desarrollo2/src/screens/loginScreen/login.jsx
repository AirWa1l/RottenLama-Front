import React from "react";
import { FaGoogle, FaGithub, FaTwitter } from "react-icons/fa";
import "./login.css"; // Archivo de estilos
import { Link } from "react-router-dom";
import WavesBackground from "../../components/waves/waves";

const Login = () => {
  return (
    <div className="login-wrapper">
      <WavesBackground />
      <div className="login-container">
        <h2>Welcome!</h2>
        <div id="id-register-link">
            <p>
                Don't you have an account? 
                <Link to="/register"> Register</Link>
            </p>
        </div>

        <form className="login-form">
          <input type="email" placeholder="E-mail" required />
          <input type="password" placeholder="Password" required />
          <Link to="/">
            <button type="submit">Sign in</button>
          </Link>
        </form>

        <div className="social-login">
          <p>Or sign in with</p>
          <div className="social-icons">
            <button className="icon-btn google"><FaGoogle /></button>
            <button className="icon-btn github"><FaGithub /></button>
            <button className="icon-btn twitter"><FaTwitter /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

