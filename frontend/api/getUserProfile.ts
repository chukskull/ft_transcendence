import axios from "axios";

export async function getUserProfile() {
  try {
    const response = await axios.get("http://localhost:4000/user"); // Replace with your API endpoint
    const userData = await response.data;
    return userData;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return {}; // Return empty object to prevent loading state
  }
}
