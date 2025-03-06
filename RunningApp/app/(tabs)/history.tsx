import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import { useAuth } from "../config/AuthContext"; 

export default function HistoryScreen() {
  const { user } = useAuth(); // Récupère l'utilisateur connecté
  const [courses, setCourses] = useState<
    { id: string; date: string; distance: number; duration: number }[]
  >([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        if (!user) {
          console.error("Aucun utilisateur connecté.");
          return;
        }

        console.log("🔄 Récupération des courses...");
        const querySnapshot = await getDocs(collection(db, "courses"));
        
        const coursesData = querySnapshot.docs
          .filter((doc) => doc.data().userId === user.uid) // Filtrer par utilisateur
          .map((doc) => ({
            id: doc.id,
            date: new Date(doc.data().date.seconds * 1000).toLocaleString(), // Conversion Firebase timestamp
            distance: doc.data().distance || 0, // Valeur par défaut si manquante
            duration: doc.data().duration || 0, // Valeur par défaut si manquante
          }));

        console.log("✅ Courses récupérées :", coursesData);
        setCourses(coursesData);
      } catch (error) {
        console.error("❌ Erreur lors de la récupération des courses :", error);
      }
    };

    fetchCourses();
  }, [user]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📜 Historique des courses</Text>

      {courses.length === 0 ? (
        <Text style={styles.noData}>Aucune course enregistrée.</Text>
      ) : (
        <FlatList
          data={courses}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.courseItem}>
              <Text>📅 Date : {item.date}</Text>
              <Text>📏 Distance : {item.distance} m</Text>
              <Text>⏳ Durée : {item.duration} sec</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

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
  noData: {
    fontSize: 16,
    color: "gray",
  },
  courseItem: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    width: "100%",
  },
});
