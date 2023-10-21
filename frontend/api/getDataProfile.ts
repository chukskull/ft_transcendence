import axios from "axios";

export async function getDataProfile() {
  const response = await axios.get("http://localhost:4000/data"); // Replace with your API endpoint
  const userData = await response.data;
  return userData;
}
