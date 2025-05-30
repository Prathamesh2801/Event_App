import axios from "axios";
import { API_BASE_URL } from "../../config";

export const fetchUserPollData = async (eventId, userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/User/polls.php`, {
      params: {
        Event_ID: eventId,
        User_ID: userId,
      },
    });
    console.log(response.data);

    return response.data;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};

export const submitPoll = async (eventId, pollId, userId, optionId) => {
  try {
    const body = new URLSearchParams();
    body.append("Event_ID", eventId);
    body.append("Poll_ID", pollId);
    body.append("User_ID", userId);
    body.append("Option_ID", optionId);

    const response = await axios.post(
      `${API_BASE_URL}/User/polls.php`,
      body.toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    // console.log("Submitted Poll Response:", response.data);

    if (response.data.Status) {
      return response.data;
    } else {
      throw new Error(response.data.Message || "Poll submission failed");
    }
  } catch (err) {
    console.log("Poll Submit Error Details:");
    console.log("Error Message:", err.message);
    console.log("Error Config:", err.config);
    if (err.response) {
      console.log("Response Data:", err.response.data);
      console.log("Response Status:", err.response.status);
    } else if (err.request) {
      console.log("Request Object:", err.request);
    }
    throw err;
  }
};
