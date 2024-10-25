import { UsersResponseScheme, UserCreateScheme, UsersResponseScheme, UserResponseScheme, UserUpdateScheme } from '../../models/user';
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
  const getUser = async (userId: number) :Promise<AxiosResponse<UsersResponseScheme, any>> => {
    try {
      const response  = await axiosPrivate<UsersResponseScheme>({
        url: `/api/v1/users/${userId}`,
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
  const createUser = async (userAttributes: UserCreateScheme) :Promise<AxiosResponse<UserResponseScheme, any>> => {
    try {
      const response  = await axiosPrivate<UserResponseScheme>({
        url: `/api/v1/users`,
        method: "POST",
        headers: {
          "Content-Type": ContentType.Json,
        },
        data: JSON.stringify(userAttributes)

      }); 

      return response;
    } catch (err: any) {
      return err;
    } 
  }

  const updateUser = async (userId: number, userAttributes: UserUpdateScheme) :Promise<AxiosResponse<UserResponseScheme, any>> => {
    try {
      const response  = await axiosPrivate<UserResponseScheme>({
        url: `/api/v1/users/${userId}`,
        method: "POST",
        headers: {
          "Content-Type": ContentType.Json,
        },
        data: JSON.stringify(userAttributes)

      }); 

      return response;
    } catch (err: any) {
      return err;
    } 
  }

  return {
    getUsers,
    getUser,
    createUser,
    updateUser
  }

};
export default useUserService