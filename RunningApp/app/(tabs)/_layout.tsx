import { Tabs, usePathname } from "expo-router"; // 🚀 Ajout de `usePathname`
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../config/AuthContext";

export default function Layout() {
  const pathname = usePathname(); // 🔥 Permet de savoir sur quelle page on est

  // 🚀 Vérifier si on est sur "login" ou "register"
  const isAuthPage = pathname === "/login" || pathname === "/register";

  if (isAuthPage) {
    return (
      <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          backgroundColor: "#888888",
          paddingBottom: 5,
          height: 60,
          display: "none",
          marginTop: 500, 
        },
      }}
    ></Tabs>
    )
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          backgroundColor: "#fff",
          paddingBottom: 5,
          height: 60,
          marginTop: isAuthPage ? 500 : 0,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Accueil",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="run"
        options={{
          title: "Course",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="walk-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "Historique",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="time-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="login"
        options={{
          title: "Connexion",
          href: null, // 🔥 Pour cacher l'icône dans la navbar
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="log-in-outline" size={size} color={color} />
          ),
        }}
      />

<Tabs.Screen
        name="register"
        options={{
          title: "Inscription",
          href: null, // 🔥 Pour cacher l'icône dans la navbar
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-add-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="index"
        options={{
          title: "index",
          href: null, // 🔥 Pour cacher l'icône dans la navbar
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-add-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
