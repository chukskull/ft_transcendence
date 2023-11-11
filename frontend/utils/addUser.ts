import { use } from "react";
import { useMutation } from "react-query";
import axios from "axios";

const addUser = async (user: any) => {
  const { data } = await axios.post("http://localhost:4000/users", user);
  return data;
};

export const useAddUser = () => {
  return useMutation(addUser);
};


const changeImage = async (image: any) => {
  if(image === null) {
    console.log("image is null");
  }
  const {data} = await axios.post("http://localhost:4000/users", image);

  console.log(data);
  return data;

};
export const postImage = () => {
  return useMutation(changeImage);
};