
import { useMutation } from "react-query";
import axios from "axios";

const addUser = async (user: any) => {
  const { data } = await axios.post("http://localhost:4000/users", user);
  return data;
};

export const useAddUser = () => {
  return useMutation(addUser);
};


const Update = async (sdata: any) => {
  const formData = new FormData();
  formData.append(sdata, "any");
  const {data} = await axios.post("http://localhost:4000/users", {
    image: sdata.image,
    isEnbled: sdata.enableTwoFa,
    name: sdata.name,
  });

  return data;

};
export const usePostImage = () => {
 return useMutation(Update);
  
};