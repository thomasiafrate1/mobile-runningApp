import React, { useState, useEffect } from "react";
import { View, Text, Button } from "react-native";
import * as Location from "expo-location";
import { useAuth } from "../config/AuthContext";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../config/firebaseConfig";

export default function RunScreen() {
  const { user } = useAuth();
  const [isRunning, setIsRunning] = useState(false);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [previousLocation, setPreviousLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    if (isRunning) {
      const watchPosition = async () => {
        const { granted } = await Location.requestForegroundPermissionsAsync();
        if (!granted) {
          console.error("Permission de localisation refusée !");
          return;
        }

        const subscription = await Location.watchPositionAsync(
          { accuracy: Location.Accuracy.High, distanceInterval: 5 },
          (newLocation) => {
            if (!newLocation.coords) return;
            const coords = { latitude: newLocation.coords.latitude, longitude: newLocation.coords.longitude };

            setLocation(coords);
            if (previousLocation) {
              const d = getDistance(previousLocation, coords);
              setDistance((prev) => prev + d);
            }
            setPreviousLocation(coords);
          }
        );

        return () => subscription.remove();
      };
      watchPosition();
    }
  }, [isRunning]);

  const startRun = () => {
    setIsRunning(true);
    setStartTime(new Date());
    setDistance(0);
    setPreviousLocation(null);
  };

  const stopRun = async () => {
    setIsRunning(false);
  
    if (!startTime) {
      console.error("Erreur : Temps de départ non défini !");
      return;
    }
    if (!user) {
      console.error("Erreur : Aucun utilisateur connecté !");
      return;
    }
  
    const endTime = new Date();
    const duration = Math.round((endTime.getTime() - startTime.getTime()) / 1000);
  
    try {
      const docRef = await addDoc(collection(db, "courses"), {
        userId: user.uid, // L'ID unique de l'utilisateur Firebase
        email: user.email, // L'adresse e-mail de l'utilisateur
        date: new Date(), // Date de la course
        distance: distance.toFixed(2), // Distance en mètres
        duration, // Durée en secondes
      });
  
      console.log("✅ Course enregistrée avec succès ! ID :", docRef.id);
    } catch (error) {
      console.error("❌ Erreur lors de l'enregistrement :", error);
    }
  };
  

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>🏃 Course</Text>
      <Text>Connecté en tant que : {user?.email ?? "Utilisateur inconnu"}</Text>
      <Text>📍 Position : {location ? `${location.latitude}, ${location.longitude}` : "En attente..."}</Text>
      <Text>📏 Distance parcourue : {distance.toFixed(2)} m</Text>
      <Text>⏳ Durée : {isRunning ? "En cours..." : "Non démarrée"}</Text>

      {isRunning ? (
        <Button title="Arrêter la course" onPress={stopRun} />
      ) : (
        <Button title="Démarrer la course" onPress={startRun} />
      )}
    </View>
  );
}

// Fonction pour calculer la distance entre deux points GPS (Haversine)
const getDistance = (prev: { latitude: number; longitude: number }, curr: { latitude: number; longitude: number }) => {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const R = 6371e3; // Rayon de la Terre en mètres
  const dLat = toRad(curr.latitude - prev.latitude);
  const dLon = toRad(curr.longitude - prev.longitude);
  const lat1 = toRad(prev.latitude);
  const lat2 = toRad(curr.latitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};
