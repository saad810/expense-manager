import { createContext, useContext, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import userApi from "../api/user";
import { Alert, Spin } from "antd";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [token, setToken] = useState(localStorage.getItem("authToken"));
    const [isAuthenticated, setIsAuthenticated] = useState(!!token);

    const {
        data: user,
        isLoading,
        isError,
        refetch,
        error,
    } = useQuery({
        queryKey: ["get-user"],
        queryFn: () => userApi.getStatus(),
        enabled: !!token,
        retry: false,
    });

    // Effect to handle auth failure
    useEffect(() => {
        if (isError || (!user && !isLoading)) {
            logout();
            navigate("/login");
        }
    }, [isError, user, isLoading]);

    const login = async (newToken) => {
        localStorage.setItem("authToken", newToken);
        setToken(newToken);
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
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
};
