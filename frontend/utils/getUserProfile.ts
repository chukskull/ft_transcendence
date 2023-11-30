import axios from "axios";

export async function getUserProfile(id: string) {
  
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/profile/${id}`,
      {
        withCredentials: true,
      }
    );
    const userData = response.data;
    console.log(userData);
    return userData;
  // } catch (error) {
  //   console.error("Error fetching user data:s", error);
    // return {}; // Return empty object to prevent loading state
  }

