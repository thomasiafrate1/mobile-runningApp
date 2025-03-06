import { Redirect } from "expo-router";

export default function Index() {
  return <Redirect href="/login" />;  // 🔄 Redirige vers Login au lieu de Home
}
