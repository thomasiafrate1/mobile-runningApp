import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { useAuth } from "../config/AuthContext";
import RunScreen from "../(tabs)/run";
import HistoryScreen from "../(tabs)/history";
import LoginScreen from "../(tabs)/login";
import RegisterScreen from "../(tabs)/register";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// 🏠 Navigation principale (utilisateur connecté)
function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Course" component={RunScreen} />
      <Tab.Screen name="Historique" component={HistoryScreen} />
    </Tab.Navigator>
  );
}

// 🔐 Navigation pour l'authentification
function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

// 🚀 Choix de navigation selon l'authentification
export default function AppNavigator() {
  const { user } = useAuth(); // Vérifie si l'utilisateur est connecté

  return (
    <NavigationContainer>
      {user ? <MainTabs /> : <AuthStack />}
    </NavigationContainer>
  );
}
