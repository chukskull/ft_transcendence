import axios from "axios";

export async function getUserProfile(id: string) {
  axios
    .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/profile/${id}`, {
      withCredentials: true,
    })
    .then((response) => {
      console.log("this is the response", response);
      return response.data;
    })
    .catch((error) => {
      console.log("this is the response status", error.response.status);
    });
}
