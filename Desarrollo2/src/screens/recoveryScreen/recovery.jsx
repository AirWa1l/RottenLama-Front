import React, { useState } from "react";
import { FiMail } from "react-icons/fi";
import "./recovery.css";

const Recovery = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email.includes("@") || !email.includes(".")) {
            setError("Por favor, ingresa un correo válido.");
            return;
        }
        setError("");
        setMessage("Si el correo está registrado, recibirás un enlace de recuperación.");
    };

    return (
        <div className="recovery-container">
            <h2>🔒 Recuperar Contraseña</h2>
            <p>Ingresa tu correo para recibir un enlace de recuperación.</p>
            <form onSubmit={handleSubmit}>
                <div className="input-container">
                    <FiMail className="icon" />
                    <input 
                        type="email" 
                        placeholder="Correo electrónico" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Enviar enlace</button>
            </form>
            {error && <p className="error">{error}</p>}
            {message && <p className="message">{message}</p>}
        </div>
    );
};

export default Recovery;