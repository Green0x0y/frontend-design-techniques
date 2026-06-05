import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { UserPlus, Mail, Shield, UserCheck, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { toast } from "sonner";
import { collection, deleteDoc, doc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import { FirebaseError } from "firebase/app";
import { db } from "../../firebase";

type UserRole = "admin" | "member";

type UserItem = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
};

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  if (parts.length === 1 && parts[0].length >= 2) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0]?.[0] ?? "?").toUpperCase();
}

export function Users() {
  const { isAdmin } = useAuth();
  const [usersList, setUsersList] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState<UserRole>("member");

  const loadUsers = async () => {
    if (!db) {
      setUsersList([]);
      setLoading(false);
      return;
    }

    try {
      const snapshot = await getDocs(collection(db, "users"));
      const loadedUsers: UserItem[] = snapshot.docs.map((d) => {
        const data = d.data() as {
          name?: string;
          displayName?: string;
          email?: string;
          role?: UserRole;
          avatar?: string;
        };

        const resolvedName = data.name || data.displayName || data.email || "Użytkownik";
        return {
          id: d.id,
          name: resolvedName,
          email: data.email || "brak@email",
          role: data.role === "admin" ? "admin" : "member",
          avatar: data.avatar || initialsFromName(resolvedName),
        };
      });

      setUsersList(loadedUsers);
    } catch (error) {
      if (error instanceof FirebaseError) {
        toast.error(`Nie udało się pobrać użytkowników (${error.code})`);
      } else {
        toast.error("Nie udało się pobrać użytkowników z Firestore");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadUsers();
  }, []);

  const deleteUser = async (id: string) => {
    if (!db) return;

    try {
      await deleteDoc(doc(db, "users", id));
    } catch (error) {
      if (error instanceof FirebaseError) {
        toast.error(`Nie udało się usunąć użytkownika (${error.code})`);
      } else {
        toast.error("Nie udało się usunąć użytkownika");
      }
      return;
    }

    setUsersList((prev) => prev.filter((user) => user.id !== id));
    toast.success("Użytkownik został usunięty");
  };

  const changeRole = async (id: string, newRole: UserRole) => {
    if (!db) return;

    try {
      await updateDoc(doc(db, "users", id), { role: newRole });
    } catch (error) {
      if (error instanceof FirebaseError) {
        toast.error(`Nie udało się zmienić roli (${error.code})`);
      } else {
        toast.error("Nie udało się zmienić roli użytkownika");
      }
      return;
    }

    setUsersList((prev) =>
      prev.map((user) => (user.id === id ? { ...user, role: newRole } : user)),
    );
    toast.success("Rola użytkownika została zmieniona");
  };

  const resetInviteForm = () => {
    setNewUserName("");
    setNewUserEmail("");
    setNewUserRole("member");
  };

  const handleInviteUser = () => {
    const name = newUserName.trim();
    const email = newUserEmail.trim();
    if (!name || !email) {
      toast.error("Podaj imię i nazwisko oraz adres email");
      return;
    }
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) {
      toast.error("Podaj poprawny adres email");
      return;
    }
    if (usersList.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      toast.error("Użytkownik z tym adresem już istnieje");
      return;
    }
    const id = `invited-${Date.now()}`;

    const createUser = async () => {
      if (!db) {
        toast.error("Firestore nie jest skonfigurowany");
        return;
      }

      try {
        await setDoc(doc(db, "users", id), {
          name,
          email,
          role: newUserRole,
          avatar: initialsFromName(name),
        });

        setUsersList((prev) => [
          ...prev,
          {
            id,
            name,
            email,
            role: newUserRole,
            avatar: initialsFromName(name),
          },
        ]);
        setInviteDialogOpen(false);
        resetInviteForm();
        toast.success("Użytkownik został dodany");
      } catch (error) {
        if (error instanceof FirebaseError) {
          toast.error(`Nie udało się dodać użytkownika (${error.code})`);
        } else {
          toast.error("Nie udało się dodać użytkownika do Firestore");
        }
      }
    };

    void createUser();
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Użytkownicy i role
          </h1>
          <p className="text-slate-600">
            Zarządzaj dostępem do systemu inteligentnego domu
          </p>
        </div>

        {isAdmin && <Dialog
          open={inviteDialogOpen}
          onOpenChange={(open) => {
            setInviteDialogOpen(open);
            if (!open) resetInviteForm();
          }}
        >
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              Dodaj użytkownika
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Zaproś nowego użytkownika</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="user-name">Imię i nazwisko</Label>
                <Input
                  id="user-name"
                  placeholder="np. Jan Kowalski"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="user-email">Adres email</Label>
                <Input
                  id="user-email"
                  type="email"
                  placeholder="jan@example.com"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="user-role">Rola</Label>
                <Select
                  value={newUserRole}
                  onValueChange={(v) => setNewUserRole(v as "admin" | "member")}
                >
                  <SelectTrigger id="user-role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrator</SelectItem>
                    <SelectItem value="member">Domownik</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                Użytkownik otrzyma zaproszenie na podany adres email z linkiem
                do aktywacji konta.
              </div>
              <Button
                type="button"
                className="w-full"
                onClick={handleInviteUser}
              >
                <Mail className="w-4 h-4 mr-2" />
                Wyślij zaproszenie
              </Button>
            </div>
          </DialogContent>
        </Dialog>}
      </div>

      {/* Role Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-slate-900 mb-2">
                Administrator
              </h3>
              <p className="text-sm text-slate-600 mb-3">
                Pełny dostęp do wszystkich funkcji systemu, w tym zarządzanie
                użytkownikami, urządzeniami i ustawieniami bezpieczeństwa.
              </p>
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <UserCheck className="w-4 h-4" />
                <span>
                  {usersList.filter((u) => u.role === "admin").length}{" "}
                  administrator
                  {usersList.filter((u) => u.role === "admin").length !== 1
                    ? "ów"
                    : ""}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <UserCheck className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-slate-900 mb-2">Domownik</h3>
              <p className="text-sm text-slate-600 mb-3">
                Dostęp do sterowania urządzeniami i scen. Brak możliwości
                zarządzania użytkownikami i modyfikacji ustawień systemowych.
              </p>
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <UserCheck className="w-4 h-4" />
                <span>
                  {usersList.filter((u) => u.role === "member").length} domownik
                  {usersList.filter((u) => u.role === "member").length !== 1
                    ? "ów"
                    : ""}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Users List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900">
            Wszyscy użytkownicy
          </h2>
        </div>

        {loading && (
          <div className="p-6 text-sm text-slate-500">Ładowanie użytkowników...</div>
        )}

        <div className="divide-y divide-slate-200">
          {usersList.map((user) => (
            <div
              key={user.id}
              className="p-6 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <Avatar className="w-12 h-12">
                  <AvatarFallback className="bg-blue-600 text-white font-medium">
                    {user.avatar}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-slate-900">
                      {user.name || user.email}
                    </h3>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        user.role === "admin"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {user.role === "admin" ? "Administrator" : "Domownik"}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600">{user.email}</p>
                </div>

                {isAdmin && (
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Select
                      value={user.role}
                      onValueChange={(value: "admin" | "member") =>
                        changeRole(user.id, value)
                      }
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Administrator</SelectItem>
                        <SelectItem value="member">Domownik</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteUser(user.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
