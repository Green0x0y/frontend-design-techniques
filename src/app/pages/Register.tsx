import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Home, AlertCircle, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "../components/ui/alert";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

import {
  auth,
  db,
  firebaseConfigError,
  isFirebaseConfigured,
  trackEvent,
} from "../../firebase";
import { updateProfile } from "firebase/auth";

export function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!name || !email || !password || !confirmPassword) {
      setError("Proszę wypełnić wszystkie pola");
      return;
    }

    if (password.length < 6) {
      setError("Hasło musi mieć co najmniej 6 znaków");
      return;
    }

    if (password !== confirmPassword) {
      setError("Hasła nie są identyczne");
      return;
    }

    if (!auth || !db || !isFirebaseConfigured) {
      setError(firebaseConfigError ?? "Firebase nie jest skonfigurowany");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      await updateProfile(userCredential.user, {
        displayName: name,
      });

      await setDoc(doc(db, "users", userCredential.user.uid), {
        uid: userCredential.user.uid,
        email,
        name,
        role: "member",
        createdAt: serverTimestamp(),
      });

      void trackEvent("sign_up", { method: "email_password" });

      setSuccess(true);

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case "auth/configuration-not-found":
            setError(
              "Brak konfiguracji Firebase Authentication. Sprawdź, czy włączono Authentication i metodę Email/Password oraz czy dane w pliku .env.local są z tego samego projektu."
            );
            break;
          case "auth/email-already-in-use":
            setError("Ten email jest już zarejestrowany");
            break;
          case "auth/invalid-email":
            setError("Podano nieprawidłowy adres email");
            break;
          case "auth/operation-not-allowed":
            setError("Rejestracja email/hasło nie jest włączona w Firebase Authentication");
            break;
          case "auth/weak-password":
            setError("Hasło jest zbyt słabe");
            break;
          case "auth/network-request-failed":
            setError("Błąd sieci. Sprawdź połączenie i spróbuj ponownie");
            break;
          default:
            setError(`Nie udało się utworzyć konta (${error.code})`);
            break;
        }
        return;
      }

      setError("Nie udało się utworzyć konta. Spróbuj ponownie");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-indigo-600 p-3 rounded-full">
              <Home className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Utwórz konto</CardTitle>
          <CardDescription className="text-center">
            Zacznij zarządzać swoim inteligentnym domem
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {!isFirebaseConfigured && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {firebaseConfigError ?? "Firebase nie jest skonfigurowany"}
                </AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="border-green-500 text-green-700">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription>
                  Konto utworzone! Przekierowywanie do logowania...
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Imię i nazwisko</Label>
              <Input
                id="name"
                type="text"
                placeholder="Jan Kowalski"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={success}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="twoj@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={success}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Hasło</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={success}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Potwierdź hasło</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={success}
              />
            </div>

            <Button type="submit" className="w-full" disabled={success}>
              Zarejestruj się
            </Button>

            <div className="text-center text-sm text-gray-600">
              Masz już konto?{" "}
              <Link to="/login" className="text-indigo-600 hover:underline">
                Zaloguj się
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
