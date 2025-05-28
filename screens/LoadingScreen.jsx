import { View, ActivityIndicator, StyleSheet, Text } from "react-native";


export default function LoadingScreen() {
  return (
    <View style={styles.container}>
      {/* <Text style={{color:'yellow'}}>Fetch data</Text> */}
      <ActivityIndicator size="large" color="#ffffff" />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
});
