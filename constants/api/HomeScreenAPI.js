import axios from "axios";
import { API_BASE_URL } from "../../config";

export const fetchUCEventsPN = async (eventId, userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/User/home.php`, {
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
