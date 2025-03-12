// Importamos React y los iconos de Google, GitHub y Twitter desde react-icons
import React from "react";
import { FaGoogle, FaGithub, FaTwitter } from "react-icons/fa";

// Importamos el archivo CSS para aplicar estilos a este componente
import "./login.css"; 

// Importamos Link desde react-router-dom para la navegación entre páginas
import { Link } from "react-router-dom";

// Importamos el componente WavesBackground para agregar un fondo animado de olas
import WavesBackground from "../../components/waves/waves";

const Login = () => {
  return (
    <div className="login-wrapper"> {/* Contenedor principal */}
      <WavesBackground /> {/* Componente que agrega el fondo animado */}

      <div className="login-container"> {/* Contenedor del formulario de login */}
        <h2>Welcome!</h2> {/* Título de la página */}

        {/* Enlace para registrarse si el usuario no tiene cuenta */}
        <div id="id-register-link">
            <p>
                Don't you have an account? 
                <Link to="/register"> Register</Link> {/* Redirige a la página de registro */}
            </p>
        </div>

        {/* Formulario de inicio de sesión */}
        <form className="login-form">
          <input type="email" placeholder="E-mail" required /> {/* Campo de correo */}
          <input type="password" placeholder="Password" required /> {/* Campo de contraseña */}

          {/* Botón de inicio de sesión, que redirige a la página principal */}
          <Link to="/">
            <button type="submit">Sign in</button>
          </Link>
        </form>

        {/* Sección de inicio de sesión con redes sociales */}
        <div className="social-login">
          <p>Or sign in with</p>
          <div className="social-icons">
            {/* Botones de inicio de sesión con Google, GitHub y Twitter */}
            <button className="icon-btn google"><FaGoogle /></button>
            <button className="icon-btn github"><FaGithub /></button>
            <button className="icon-btn twitter"><FaTwitter /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; // Exportamos el componente para usarlo en otras partes de la aplicación


