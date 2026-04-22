import { createContext } from "react";

const AuthContext = createContext({
  isAuthenticated: false,
  email: "",
});

export default AuthContext;