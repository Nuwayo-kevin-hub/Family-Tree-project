import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function ProtectedRoute({

    children,
    roles

}) {

    const auth = useAuth();

    if (auth.loading) {

        return <h2>Loading...</h2>;

    }

    if (!auth.isAuthenticated) {

        return <Navigate to="/login" replace />;

    }

    if (

        roles &&
        roles.length > 0 &&
        !roles.includes(auth.user?.role)

    ) {

        return <Navigate to="/" replace />;

    }

    return children;

}