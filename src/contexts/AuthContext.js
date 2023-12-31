import { createContext, useContext } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useLocalStorage("auth", {});

    const userLogin = (authData) => {
        setAuth(authData);
    };

    const userLogout = () => {
        setAuth({});
    };

    // to fix edit user data
    // const userEdit = (authData) => {
    //     setAuth(authData)
    // };

    return (
        <AuthContext.Provider
            value={{
                user: auth,
                userLogin,
                userLogout,
                // to fix edit user data
                // userEdit,
                isAuthenticated: !!auth.accessToken,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

// Custom Hook
export const useAuthContext = () => {
    const context = useContext(AuthContext);

    return context;
};

// With HOC
export const withAuth = (Component) => {
    const WrapperComponent = (props) => {
        const context = useContext(AuthContext);

        return <Component {...props} auth={context} />;
    };

    return WrapperComponent;
};
