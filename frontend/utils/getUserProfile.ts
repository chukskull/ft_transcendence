import axios from "axios";

export async function getUserProfile(id: string) {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/profile/${id}`,
    {
      withCredentials: true,
    }
  );
  const userData = response.data;
  console.log("this is the user profile data", userData);
  return userData;
}
