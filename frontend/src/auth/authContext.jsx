import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {

    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const savedUser = localStorage.getItem("user");
        const savedToken = localStorage.getItem("token");

        if (savedUser && savedUser !== "undefined") {

            try {

                setUser(JSON.parse(savedUser));

            } catch (error) {

                console.log("Invalid user data");

                localStorage.removeItem("user");

            }

        }

        if (savedToken && savedToken !== "undefined") {

            setToken(savedToken);

        }

        setLoading(false);

    }, []);

    const login = (userData, userToken) => {

        setUser(userData);
        setToken(userToken);

        localStorage.setItem(
            "user",
            JSON.stringify(userData)
        );

        localStorage.setItem(
            "token",
            userToken
        );

    };

    const logout = () => {

        setUser(null);
        setToken(null);

        localStorage.removeItem("user");
        localStorage.removeItem("token");

    };

    return (

        <AuthContext.Provider

            value={{

                user,
                token,
                loading,

                login,
                logout,

                isAuthenticated: !!token

            }}

        >

            {children}

        </AuthContext.Provider>

    );

}