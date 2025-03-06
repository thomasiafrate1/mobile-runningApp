import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import { useAuth } from "../config/AuthContext";

// 🔥 Définition du type Course
type Course = {
  id: string;
  userId: string;
  email: string;
  date: { seconds: number }; // Firestore stocke les dates sous format timestamp
  distance: number;
  duration: number;
};

export default function HistoryScreen() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]); // ✅ Applique le type Course

  useEffect(() => {
    if (!user) {
      console.error("⚠️ Aucun utilisateur connecté, impossible de récupérer les courses !");
      return;
    }

    const fetchCourses = async () => {
      try {
        console.log("🔄 Chargement des courses...");
        const q = query(collection(db, "courses"), where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);

        const coursesData: Course[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Course[]; // ✅ Cast les données comme étant de type Course

        setCourses(coursesData);
        console.log("✅ Courses récupérées :", coursesData);
      } catch (error) {
        console.error("❌ Erreur lors de la récupération des courses :", error);
      }
    };

    fetchCourses();
  }, [user]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📜 Historique des courses</Text>

      <FlatList
        data={courses}
        keyExtractor={(item) => item.id} // ✅ Correction de l'erreur de typage
        renderItem={({ item }) => (
          <View style={styles.courseItem}>
            <Text>📅 Date : {new Date(item.date.seconds * 1000).toLocaleString()}</Text>
            <Text>📏 Distance : {item.distance} m</Text>
            <Text>⏳ Durée : {item.duration} sec</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f4f4f4",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  courseItem: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
});
