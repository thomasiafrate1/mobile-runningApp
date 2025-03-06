import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebaseConfig";
import { useRouter } from "expo-router";

export default function RegisterScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Erreur", "Les mots de passe ne correspondent pas.");
      console.log("❌ Mot de passe non identique !");
      return;
    }

    try {
      console.log(`🔄 Tentative de création de compte pour : ${email}`);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("✅ Compte créé avec succès !", userCredential.user);

      Alert.alert("Succès", "Compte créé avec succès !");
      router.push("/login"); // Redirection vers la connexion
    } catch (error) {
      console.error("❌ Erreur lors de l'inscription :", error);
     
    }
  };

  return (
    <View>
      <Text>📝 Inscription</Text>
      <TextInput placeholder="Email" onChangeText={setEmail} />
      <TextInput placeholder="Mot de passe" secureTextEntry onChangeText={setPassword} />
      <TextInput placeholder="Confirmer le mot de passe" secureTextEntry onChangeText={setConfirmPassword} />
      <Button title="S'inscrire" onPress={handleRegister} />
      <Button title="Retour à la connexion" onPress={() => router.push("/login")} />
    </View>
  );
}
