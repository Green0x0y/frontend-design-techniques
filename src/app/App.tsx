import { RouterProvider } from "react-router";
import { router } from "./routes";
import { Toaster } from "./components/ui/sonner";
import { AuthProvider } from "./contexts/AuthContext";
import { useEffect } from "react";
import ReactGA from "react-ga4";

export default function App() {
    useEffect(() => {
        ReactGA.initialize("G-FD2PWB6HHY");
    }, []);

    return (
        <AuthProvider>
            <RouterProvider router={router} />
            <Toaster />
        </AuthProvider>
    );
}