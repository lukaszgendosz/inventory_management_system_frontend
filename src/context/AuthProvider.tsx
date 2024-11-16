import { createContext, useState, ReactNode, Dispatch, SetStateAction } from "react";
import { UserResponseScheme } from "../models/user";

interface AuthState {
    access_token?: string;
    current_user?: UserResponseScheme;
}

interface AuthContextType {
    auth: AuthState;
    setAuth: Dispatch<SetStateAction<AuthState>>;
}
export const AuthContext = createContext<AuthContextType>({} as AuthContextType);


// Define the AuthProvider props type
interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [auth, setAuth] = useState<AuthState>({}); 

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
          {children}
        </AuthContext.Provider>
    );
}
export default AuthContext;