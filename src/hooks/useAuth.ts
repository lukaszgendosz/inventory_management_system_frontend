import { useContext, useDebugValue } from "react";
import AuthContext from "../context/AuthProvider";

export const useAuth = () => {
    const { auth } = useContext(AuthContext);
    useDebugValue(auth, auth => auth?.access_token ? "Logged In" : "Logged Out")
    return useContext(AuthContext);
}

 