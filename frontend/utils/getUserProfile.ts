import axios from "axios";

export async function getUserProfile(id:string) {
  try {
    const response = await axios.get(`http://localhost:1337/api/:${id}`); // Replace with your API endpoint
    const userData = await response.data;
    return userData;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return {}; // Return empty object to prevent loading state
  }
}
