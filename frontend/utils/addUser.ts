
import { useMutation } from "react-query";
import axios from "axios";

const addUser = async (user: any) => {
  const { data } = await axios.post("http://localhost:4000/users", user);
  return data;
};

export const useAddUser = () => {
  return useMutation(addUser);
};


