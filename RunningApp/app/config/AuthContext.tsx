import React, { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "./firebaseConfig";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
};

// 📌 Création du contexte (⚠️ avec valeur par défaut null)
const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("✅ AuthProvider monté !");
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("🔄 Changement d'état de l'auth :", user);
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    console.log("🚪 Déconnexion réussie !");
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 📌 Empêche `useAuth` de planter si AuthProvider est manquant
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    console.error("❌ useAuth est utilisé hors de AuthProvider !");
    return { user: null, loading: true, logout: async () => {} };
  }
  return context;
};

export default AuthProvider;
