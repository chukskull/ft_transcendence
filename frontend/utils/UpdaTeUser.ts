
import { useMutation } from "react-query";
import axios from "axios";
const Update = async (sdata: any) => {
  const formData = new FormData();
  formData.append("image", sdata.image);
  formData.append("isEnbled", sdata.enableTwoFa);
  formData.append("name", sdata.name);

  const { data } = await axios.post("http://localhost:4000/users", {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    body: formData,
  });

  return data;
};

export const useUpdate = () => {
 return useMutation(Update);
  
};