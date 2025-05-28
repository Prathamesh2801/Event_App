import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  ActivityIndicator,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../constants/colors";
import { useState } from "react";
import { fetchEvents } from "../constants/api/eventApi";
import Toast from "react-native-toast-message";
import BackgroundVideoBanner from "../components/BackgroundVideoBanner";
import CustomButton from "../components/CustomButton";

export default function EventRegistrationScreen({ navigation }) {
  const [eventId, setEventId] = useState("");
  const [loading, setLoading] = useState(false);
  async function pressHandler() {
    if (!eventId.trim()) {
      Toast.show({
        type: "error",
        text1: "Event ID Not Found",
        text2: "Please Enter the Event Id",
      });
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
        if (response.Data.event.IsApp === "1") {
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
            type: "success",
            text1: "Event Found ",
            text2: "Event Does Not Support App feature",
          });
          return navigation.navigate("ErrorPage", {
            status: "Feature Not Available",
            message:
              "This feature isn’t available for that event just yet. Try a different one or check back later!",
            action: true,
          });
        }
      } else {
        Toast.show({
          type: "error",
          text1: "Event Not Found !",
          text2: "Please Check the Event Id",
        });
        setEventId("");
      }
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Event Not Found !",
        text2: "Please Check the Event Id",
      });
      setEventId("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <BackgroundVideoBanner />
      <SafeAreaView style={styles.rootOuterContainer}>
        <View style={styles.rootInnerContainer}>
          <View style={styles.container}>
            <Text style={styles.text}>Welcome to Event</Text>
            <TextInput
              style={styles.inputText}
              onChangeText={setEventId}
              value={eventId}
              placeholder="Event Id : "
              editable={!loading}
            />

            {loading ? (
              <ActivityIndicator size="large" color={Colors.accent500} />
            ) : (
              <CustomButton
                text="Submit"
                onPress={pressHandler}
                color="#efab0d"
                rippleColor="rgba(0,0,0,0.1)"
                size="medium"
                borderRadius={30}
              
              />
            )}
          </View>
        </View>
      </SafeAreaView>
    </>
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
