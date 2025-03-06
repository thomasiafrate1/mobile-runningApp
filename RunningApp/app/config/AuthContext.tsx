import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "./firebaseConfig";

// ✅ Définition du type pour éviter l'erreur
type AuthContextType = {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
};

// ✅ Création du contexte avec type sécurisé
const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      console.log("👤 Utilisateur détecté :", firebaseUser);
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);
    console.log("🚪 Déconnexion réussie");
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

// ✅ Vérifie que `useAuth` est bien utilisé dans un `AuthProvider`
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
