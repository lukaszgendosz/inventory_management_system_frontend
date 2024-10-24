import { UsersResponseScheme } from "../../models/user";
import { ContentType } from "./axios";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { AxiosResponse } from "axios";

interface queryParams {
  page: number | undefined;
  page_size: number | undefined;
  search: string | undefined;
}
const useUserService = () => {
  const axiosPrivate = useAxiosPrivate();
  
  const getUsers = async (queryParams: queryParams) :Promise<AxiosResponse<UsersResponseScheme, any>> => {
    try {
      const response  = await axiosPrivate<UsersResponseScheme>({
        url: "/api/v1/users",
        method: "GET",
        headers: {
          "Content-Type": ContentType.Json,
        },
        params: {
          page: queryParams.page,
          page_size: queryParams.page_size,
          search: queryParams.search,
        },
      }); 

      return response;
    } catch (err: any) {
      return err;
    } 
  }
  return {
    getUsers
  }

};
export default useUserService