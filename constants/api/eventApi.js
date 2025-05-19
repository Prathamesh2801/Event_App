import axios from "axios";
import { API_BASE_URL } from "../../config";

export const fetchEvents = async (eventId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/register.php`, {
      params: {
        Event_ID: eventId,
      },
    });
    console.log(response.data)
    return response.data;

  } catch (error) {
    // console.error('Error fetching events:', error);
    throw error;
  }
};

export const fetchSpecificUserId = async (userId, eventId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/User/user.php`, {
      params: {
        User_ID: userId,
        Event_ID: eventId,
      },
    });
    return response.data;
  } catch (error) {
    // console.error('Error fetching events:', error);
    throw error;
  }
};
