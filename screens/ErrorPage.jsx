import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function ErrorPage({ route, navigation }) {
  const { message, status, action = false } = route.params;

  function pressHandler() {
    navigation.navigate("EventRegister");
  }
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.status}>{status ?? "Error"}</Text>
        <Text style={styles.message}>{message}</Text>

        {action && (
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={pressHandler}
            >
              <Text style={styles.primaryButtonText}>
                Go back to Event Register Screen
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: 24,
    paddingVertical: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
    textAlign: "center",
  },
  status: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4f46e5", // indigo-600
  },
  title: {
    marginTop: 16,
    fontSize: 40, // similar to text-5xl
    fontWeight: "600",
    color: "#111827", // gray-900
    textAlign: "center",
  },
  message: {
    marginTop: 24,
    fontSize: 18, // text-lg
    fontWeight: "500",
    color: "#6b7280", // gray-500
    textAlign: "center",
  },
  actions: {
    marginTop: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
  },
  primaryButton: {
    backgroundColor: "#4f46e5", // indigo-600
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    elevation: 2,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
  secondaryLink: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827", // gray-900
  },
  arrow: {
    fontWeight: "600",
  },
});
