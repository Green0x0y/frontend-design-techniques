import { Link, useLocation } from "react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { AlertTriangle, Home, LogIn } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export function NotFound() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const redirectPath = isAuthenticated ? "/" : "/login";
  const redirectLabel = isAuthenticated ? "Przejdź do strony głównej" : "Przejdź do logowania";
  const RedirectIcon = isAuthenticated ? Home : LogIn;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-amber-100 p-3 rounded-full">
              <AlertTriangle className="w-8 h-8 text-amber-600" />
            </div>
          </div>
          <CardTitle className="text-3xl text-center font-bold">404</CardTitle>
          <CardDescription className="text-center">
            Strona niedostępna
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-slate-600 text-center">
              Niestety strona, której szukasz nie istnieje.
            </p>
            <p className="text-sm text-slate-500 text-center break-all">
              Ścieżka: <code className="bg-slate-100 px-2 py-1 rounded">{location.pathname}</code>
            </p>
          </div>

          <div className="pt-4">
            <Button asChild className="w-full">
              <Link to={redirectPath}>
                <RedirectIcon className="w-4 h-4 mr-2" />
                {redirectLabel}
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
