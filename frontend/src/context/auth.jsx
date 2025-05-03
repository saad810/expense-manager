import { createContext, useContext, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import userApi from "../api/user";
import { Alert, Spin } from "antd";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("authToken"));
    const [isAuthenticated, setIsAuthenticated] = useState(!!token);

    const { data: user, isLoading, isError, refetch, error } = useQuery({
        queryKey: ["get-user"],
        queryFn: () => userApi.getStatus(),
        enabled: !!token,
        retry: false,
        
        onError: () => {
            console.error("Error fetching user data:", error);
            logout();
        },
        
    });

    const login = async (token) => {
        localStorage.setItem("authToken", token);
        setToken(token);
        setIsAuthenticated(true);
        await refetch();
    };

    const logout = () => {
        localStorage.removeItem("authToken");
        setToken(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
                loading: isLoading,
                isAuthenticated,
            }}
        >
            {isLoading ? (
                <Spin fullscreen={true} size="large" tip="Loading" />
            ) : isError ? (
                <Alert
                    closable
                    type="error"
                    message="Error fetching user data"
                    description={error?.message || "Something went wrong. Please try again later."}
                    onClose={() => logout()} // Optional: log out the user on error
                />
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
};
