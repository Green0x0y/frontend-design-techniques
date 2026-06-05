import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import { User, onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

import { auth, db, isFirebaseConfigured } from "../../firebase";

type UserRole = "admin" | "member";

interface AuthContextType {
  user: User | null;
  role: UserRole;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isAuthEnabled: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>("member");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth || !db || !isFirebaseConfigured) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        try {
          const profileRef = doc(db, "users", firebaseUser.uid);
          const profileSnap = await getDoc(profileRef);

          if (!profileSnap.exists()) {
            await setDoc(profileRef, {
              uid: firebaseUser.uid,
              email: firebaseUser.email ?? "",
              name: firebaseUser.displayName || firebaseUser.email || "Użytkownik",
              role: "member",
              createdAt: serverTimestamp(),
            });
          }

          const refreshedSnap = await getDoc(profileRef);
          const loadedRole = refreshedSnap.exists()
            ? (refreshedSnap.data().role as UserRole | undefined)
            : undefined;
          setRole(loadedRole === "admin" ? "admin" : "member");
        } catch {
          setRole("member");
        }
      } else {
        setRole("member");
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const logout = async () => {
    if (!auth) {
      return;
    }

    await signOut(auth);
  };

  if (loading) {
    return null;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        logout,
        isAuthenticated: !!user,
        isAuthEnabled: isFirebaseConfigured,
        isAdmin: role === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
