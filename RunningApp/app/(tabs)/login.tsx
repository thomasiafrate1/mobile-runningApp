import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebaseConfig";
import { StackNavigationProp } from "@react-navigation/stack";

// Définition des types de navigation
type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};
type NavigationProps = StackNavigationProp<AuthStackParamList, "Login">;

export default function LoginScreen({ navigation }: { navigation: NavigationProps }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert("Connexion réussie !");
    } catch (error) {
      Alert.alert("Erreur", "Email ou mot de passe incorrect.");
      console.error("Erreur de connexion:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔑 Connexion</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        secureTextEntry
        onChangeText={setPassword}
      />
      <Button title="Se connecter" onPress={handleLogin} />
      <Button title="Créer un compte" onPress={() => navigation.navigate("Register")} />
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
});
