import React from "react";
import { View, Text } from "react-native";
import AuthProvider from "./app/config/AuthContext"; // Vérifie bien que le chemin est bon !
import AppNavigator from "./app/navigation/AppNavigator";

export default function App() {
  console.log("🔥 App.tsx exécuté !");

  return (
    <AuthProvider> {/* 🔥 AuthProvider englobe TOUT */}
      <AppNavigator />
    </AuthProvider>
  );
}
