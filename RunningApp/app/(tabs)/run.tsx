import React, { useState, useEffect } from "react";
import { View, Text, Button, Platform } from "react-native";
import * as Location from "expo-location";
import { useAuth } from "../config/AuthContext";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import MapView, { Marker, Polyline } from "react-native-maps";

export default function RunScreen() {
  const { user } = useAuth();
  const isMobile = Platform.OS !== "web";
  const [isRunning, setIsRunning] = useState(false);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [previousLocation, setPreviousLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [distance, setDistance] = useState(0);
  const [route, setRoute] = useState<{ latitude: number; longitude: number }[]>([]); // 🚀 Stocke l'itinéraire GPS

  useEffect(() => {
    if (isRunning) {
      const watchPosition = async () => {
        const { granted } = await Location.requestForegroundPermissionsAsync();
        if (!granted) {
          console.error("❌ Permission de localisation refusée !");
          return;
        }
  
        const subscription = await Location.watchPositionAsync(
          { accuracy: Location.Accuracy.High, distanceInterval: 5 },
          (newLocation) => {
            if (!newLocation.coords) return;
  
            const coords = { latitude: newLocation.coords.latitude, longitude: newLocation.coords.longitude };
            setLocation(coords);
  
            // ✅ Vérifier si `previousLocation` existe avant d'ajouter la distance
            setPreviousLocation((prev) => {
              if (prev) {
                const d = getDistance(prev, coords);
                setDistance((dist) => dist + d); // ✅ Mise à jour correcte en temps réel
              }
              return coords; // ✅ Mise à jour de `previousLocation`
            });
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
    setRoute([]); // 🚀 Réinitialise l'itinéraire
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
        route, // 🚀 Stocke l'itinéraire GPS
      });
  
      console.log("✅ Course enregistrée avec succès ! ID :", docRef.id);
    } catch (error) {
      console.error("❌ Erreur lors de l'enregistrement :", error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>🏃 Course</Text>

      {isMobile && location ? ( // Vérifie que location est défini
  <MapView
    initialRegion={{
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    }}
    style={{ width: "100%", height: 400 }}
    showsUserLocation
  >
    <Marker coordinate={location} title="Vous êtes ici" />
    <Polyline coordinates={route || []} strokeWidth={3} strokeColor="blue" />
  </MapView>
) : (
  <Text>🌍 Carte indisponible sur le web ou en attente de position...</Text>
)}



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
