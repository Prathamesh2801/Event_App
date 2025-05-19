import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../constants/colors";
import { useState } from "react";
import { fetchEvents } from "../constants/api/eventApi";
import Toast from "react-native-toast-message";

export default function EventRegistrationScreen({ navigation }) {
  const [eventId, setEventId] = useState("");
  const [eventIdError, setEventIdError] = useState("");
  const [loading, setLoading] = useState(false);
  async function pressHandler() {
    setEventIdError("");

    if (!eventId.trim()) {
      Toast.show({
        type: "error",
        text1: "Event ID Not Found",
        text2: "Please Enter the Event Id",
      });
      setEventIdError("Please enter an Event ID.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetchEvents(eventId);

      if (
        response.Status === true &&
        response.Data &&
        response.Data.event &&
        typeof response.Data.event === "object"
      ) {
        Toast.show({
          type: "success",
          text1: "Welcome User To : ",
          text2: response.Data.event.Event_Name,
        });

        return navigation.navigate("UserRegister", {
          event: response.Data.event,
          eventId: eventId,
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Event Not Found !",
          text2: "Please Check the Event Id",
        });
        return navigation.navigate("ErrorPage", {
          message: "Event not found for ID: " + eventId,
          status: "404 Not Found",
          action: true
        });
      }
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Event Not Found !",
        text2: "Please Check the Event Id",
      });
      return navigation.navigate("ErrorPage", {
        message: "There was a problem fetching the event. Please try again.",
        status: "500 Server Error",
        action: true
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.rootOuterContainer}>
      <LinearGradient
        style={styles.rootInnerContainer}
        colors={[Colors.primary500, Colors.primary600, Colors.primary700]}
      >
        <View style={styles.container}>
          <Text style={styles.text}>Welcome to Event</Text>
          <TextInput
            style={[
              styles.inputText,
              eventIdError ? styles.inputErrorBorder : null,
            ]}
            onChangeText={(text) => {
              setEventId(text);
              if (text.trim()) setEventIdError("");
            }}
            value={eventId}
            placeholder="Event Id : "
            editable={!loading}
          />

          {eventIdError ? (
            <Text style={styles.errorText}>{eventIdError}</Text>
          ) : null}

          {loading ? (
            <ActivityIndicator size="large" color={Colors.accent500} />
          ) : (
            <Button
              title="Submit"
              color={Colors.accent500}
              onPress={pressHandler}
              disabled={loading}
            />
          )}
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  rootOuterContainer: {
    flex: 1,
  },
  rootInnerContainer: {
    flex: 1,
    padding: 16,
  },
  container: {
    flex: 1,
    height: "70%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    gap: 30,
  },
  text: {
    color: "white",
    fontSize: 30,
  },
  inputText: {
    width: "80%",
    borderWidth: 1,
    borderColor: "gray",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
  },
  inputErrorBorder: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    marginTop: 4,
    marginBottom: 8,
  },
});
