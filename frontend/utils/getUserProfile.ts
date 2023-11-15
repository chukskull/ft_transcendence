import axios from "axios";

export async function getUserProfile(id: string) {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/profile${id}`
    ); // Replace with your API endpoint
    const userData = await response.data;
    return userData;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return {}; // Return empty object to prevent loading state
  }
}
