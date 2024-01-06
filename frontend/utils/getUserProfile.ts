import { useQuery } from 'react-query';
import axios from 'axios';

export function useUserProfile(id: string) {
  return useQuery(['userProfile', id], async () => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/profile/${id}`,
      {
        withCredentials: true,
      }
    );
    return response.data;
},
{
    refetchInterval: 1000,
    onError: (error: Error) => {
      console.error("Error getting user profile:", error);
    }
  });
}