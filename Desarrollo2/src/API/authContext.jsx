import { createContext, useContext } from "react";
import useAuth from "./auth.js"; // Importamos la lógica de autenticación

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const auth = useAuth(); // Obtenemos todas las funciones de autenticación

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

// Hook personalizado para usar el contexto de autenticación
export const useAuthContext = () => {
  return useContext(AuthContext);
};
