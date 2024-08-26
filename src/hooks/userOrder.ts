import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useFetchOrderList = (params: any) => {
  console.log(`🐼 ==>  params::::`, params);

  return useQuery({
    queryKey: ["GET_ORDER_LIST", params],
    queryFn: async () => {
      const response: any = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/order`,
        { params }
      );
      return response.data;
    },
    retry: false,
  });
};
