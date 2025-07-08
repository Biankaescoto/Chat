// import dependencies
import { Navigate } from "react-router-dom";
import { clearStorage } from "../../localStorage";

// component for handling user logout
export default function Logout() {
    clearStorage();
    return <Navigate to="/" replace />
}