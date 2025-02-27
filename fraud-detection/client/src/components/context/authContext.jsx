import { createContext, useState, useMemo } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);

    const login = (newToken) => {
        setToken(newToken);
    };

    const logout = () => {
        setToken(null);
    };

    // Function to get the latest token
    const getToken = () => token;

    // Memoize the context value to prevent unnecessary re-renders
    const contextValue = useMemo(() => ({
        token,
        login,
        logout,
        getToken
    }), [token]); // Only re-create when token changes

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};


export default AuthContext;