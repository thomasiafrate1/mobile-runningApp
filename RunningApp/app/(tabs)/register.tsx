import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebaseConfig";
import { StackNavigationProp } from "@react-navigation/stack";
import { FirebaseError } from "firebase/app";

type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

type NavigationProps = StackNavigationProp<AuthStackParamList, "Register">;

export default function RegisterScreen({ navigation }: { navigation: NavigationProps }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Erreur", "Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert("Compte créé avec succès !");
      navigation.navigate("Login");
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        Alert.alert("Erreur", error.message);
      } else {
        Alert.alert("Erreur inconnue");
      }
      console.error("Erreur d'inscription:", error);
    }
  };

  return (
    <View>
      <Text>📝 Inscription</Text>
      <TextInput placeholder="Email" onChangeText={setEmail} />
      <TextInput placeholder="Mot de passe" secureTextEntry onChangeText={setPassword} />
      <TextInput placeholder="Confirmer le mot de passe" secureTextEntry onChangeText={setConfirmPassword} />
      <Button title="S'inscrire" onPress={handleRegister} />
      <Button title="Retour à la connexion" onPress={() => navigation.navigate("Login")} />
    </View>
  );
}
