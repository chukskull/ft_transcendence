import axios from "axios";

export async function getDataProfile() {
  try {
    const response = await axios.get("http://localhost:4000/data"); // Replace with your API endpoint
    const userData = await response.data;
    return userData;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return {};
  }
}
