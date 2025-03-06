import React from "react";
import { View, Text } from "react-native"; 
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useAuth } from "../config/AuthContext";
import RunScreen from "../(tabs)/run";
import HistoryScreen from "../(tabs)/history";
import LoginScreen from "../(tabs)/login";
import RegisterScreen from "../(tabs)/register";

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  const auth = useAuth(); // 🔥 On récupère useAuth

  if (auth.loading) {
    console.log("⏳ AuthProvider en cours de chargement...");
    return (
      <View>
        <Text>Chargement...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      {auth.user ? (
        <Tab.Navigator>
          <Tab.Screen name="Course" component={RunScreen} />
          <Tab.Screen name="Historique" component={HistoryScreen} />
        </Tab.Navigator>
      ) : (
        <Tab.Navigator>
          <Tab.Screen name="Connexion" component={LoginScreen} />
          <Tab.Screen name="Inscription" component={RegisterScreen} />
        </Tab.Navigator>
      )}
    </NavigationContainer>
  );
}
