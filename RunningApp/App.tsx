import React from "react";
import { AuthProvider } from "./app/config/AuthContext.js";
import AppNavigator from "./app/navigation/AppNavigator.js";

export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}
