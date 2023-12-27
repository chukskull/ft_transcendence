import axios from "axios";

export async function getUserProfile(id: string) {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/profile/${id}`,
      {
        withCredentials: true,
      }
    );
    const userData = response.data;
    return userData;
  } catch (error) {
    console.error("Error getting user profile:", error);
    throw error;
  }
}
