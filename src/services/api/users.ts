import { UsersResponseScheme, UserCreateScheme, UserResponseScheme, UserUpdateScheme, Role } from '../../models/user';
import { ContentType } from "./axios";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { AxiosResponse } from "axios";
import { SortOrder } from '../../utils/constraints';



interface userQueryParams {
  page: number | undefined;
  page_size: number | undefined;
  search: string | undefined;
  order_by: string | undefined;
  sort_order: SortOrder | undefined;
  company_id: Array<string> | null;
  location_id: Array<string> | null;
  is_active: Array<string> | null;
  role: Array<string> | null;
}

const useUserService = () => {
  const axiosPrivate = useAxiosPrivate();
  
  const getUsers = async (queryParams: userQueryParams) :Promise<AxiosResponse<UsersResponseScheme, any>> => {
    console.log(queryParams);
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
          order_by: queryParams.order_by,
          sort_order: queryParams.sort_order,
          is_active: queryParams.is_active,
          company_id: queryParams.company_id,
          location_id: queryParams.location_id,
          role: queryParams.role
        },
      }); 

      return response;
    } catch (err: any) {
      return err;
    } 
  }
  const getUser = async (userId: number) :Promise<AxiosResponse<UserResponseScheme, any>> => {
    try {
      const response  = await axiosPrivate<UserResponseScheme>({
        url: `/api/v1/users/${userId}`,
        method: "GET",
        headers: {
          "Content-Type": ContentType.Json,
        }
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
        method: "PATCH",
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

  const deactivateUser = async (userId: number) :Promise<AxiosResponse<UserResponseScheme, any>> => {
    try {
      const response  = await axiosPrivate<UserResponseScheme>({
        url: `/api/v1/users/${userId}/deactivate`,
        method: "PATCH",
        headers: {
          "Content-Type": ContentType.Json,
        },
        params: {
          user_id: userId
        }

      }); 

      return response;
    } catch (err: any) {
      return err;
    } 
  }

  const activateUser = async (userId: number) :Promise<AxiosResponse<UserResponseScheme, any>> => {
    try {
      const response  = await axiosPrivate<UserResponseScheme>({
        url: `/api/v1/users/${userId}/activate`,
        method: "PATCH",
        headers: {
          "Content-Type": ContentType.Json,
        },
        params: {
          user_id: userId
        }

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
    updateUser,
    deactivateUser,
    activateUser
  }

};
export default useUserService