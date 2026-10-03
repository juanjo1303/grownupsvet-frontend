import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

export function PropietarioApp() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>GrownupsVet</Text>
      <Text style={styles.subtitle}>Portal Propietario — en construcción</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
});
