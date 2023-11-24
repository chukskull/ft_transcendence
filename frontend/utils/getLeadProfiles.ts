import axios from "axios";

export async function getLeadProfiles() {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/leaderboard`,
      {
        withCredentials: true,
      }
    );
    // const response = await axios.get("  http://localhost:4000/Leadrboard");
    const userData = await response.data;
    return userData;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return [];
  }
}
