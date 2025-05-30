import axios from "axios";
import { API_BASE_URL } from "../../config";


export const fetchAllNotifications = async (eventId) => {
  try {
    const resp = await axios.get(
      `${API_BASE_URL}/Helper/Notification/notification.php`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        params: { Event_ID: eventId },
      }
    );
    console.log("response in notification Api : ", resp.data.Data);
    if (resp.data.Status) return resp.data.Data;
    throw new Error(resp.data.Message);
  } catch (err) {
    console.error("Error fetching notifications :", err);
    throw err;
  }
};