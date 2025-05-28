import { View, Text, StyleSheet, ScrollView } from "react-native";

const RegistrationDetails = ({ userData,title }) => {
  // Fields to exclude from display
  const excludedFields = [
    "User_ID",
    "Registration_Number",
    "Scanned",
    "Recognized",
    "Updated_AT",
    "Created_AT",
    "QRPath",
  ];

  // Function to format field names for display
  const formatFieldName = (fieldName) => {
    // Convert camelCase or snake_case to Title Case with spaces
    return fieldName
      .replace(/_/g, " ")
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  };

  // Filter out excluded fields and prepare data for display
  const displayData = Object.entries(userData || {}).filter(
    ([key]) => !excludedFields.includes(key)
  );

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <ScrollView style={styles.detailsContainer}>
        {displayData.length > 0 ? (
          displayData.map(([key, value]) => (
            <View key={key} style={styles.detailItem}>
              <Text style={styles.detailLabel}>{formatFieldName(key)}</Text>
              <Text style={styles.detailValue}>
                {value?.toString() || "N/A"}
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.noDataText}>
            No registration details available
          </Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 12,
    textAlign: "center",
  },
  detailsContainer: {
    width: "100%",
    maxHeight: 300,
  },
  detailItem: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  detailLabel: {
    fontSize: 14,
    color: "#FFFFFF",
    opacity: 0.8,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  noDataText: {
    color: "#FFFFFF",
    textAlign: "center",
    opacity: 0.7,
    padding: 20,
  },
});

export default RegistrationDetails;
