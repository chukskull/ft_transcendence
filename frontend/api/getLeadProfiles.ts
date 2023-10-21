import axios from "axios";

export async function getLeadProfiles() {
  try {
    const response = await axios.get("http://localhost:4000/Leadrboard"); // Replace with your API endpoint
    const userData = await response.data;
    return userData;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return [];
  }
}
