import { Link } from "react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Lock, LogIn } from "lucide-react";

export function AccessDenied() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-slate-100 p-3 rounded-full">
              <Lock className="w-8 h-8 text-slate-700" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Dostęp odmówiony</CardTitle>
          <CardDescription className="text-center">
            Musisz być zalogowany, aby uzyskać dostęp do tej strony
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
            <p className="text-sm text-slate-700">
              <span className="font-semibold">Brak autoryzacji</span>
            </p>
            <p className="text-xs text-slate-600">
              Nie możesz wejść na tę stronę bez zalogowania się do systemu.
            </p>
          </div>

          <div className="pt-4">
            <Button asChild className="w-full">
              <Link to="/login">
                <LogIn className="w-4 h-4 mr-2" />
                Przejdź do logowania
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
