import { UsersResponseScheme, UserCreateScheme, UserResponseScheme, UserUpdateScheme } from '../../models/user';
import { ContentType } from "./axios";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { AxiosResponse } from "axios";
import { SortOrder } from '../../utils/constraints';



interface userQueryParams {
  page?: number;
  page_size?: number;
  search?: string;
  order_by?: string;
  sort_order?: SortOrder;
  company_id?: Array<string> | null;
  location_id?: Array<string> | null;
  is_active?: Array<string> | null;
  role?: Array<string> | null;
}

const useUserService = () => {
  const axiosPrivate = useAxiosPrivate();
  
  const getUsers = async (queryParams: Partial<userQueryParams> = {}) :Promise<AxiosResponse<UsersResponseScheme, any>> => {
    try {
      const response  = await axiosPrivate<UsersResponseScheme>({
        url: "/api/v1/users",
        method: "GET",
        headers: {
          "Content-Type": ContentType.Json,
        },
        params: {
          page: queryParams.page ?? null,
          page_size: queryParams.page_size ?? null,
          search: queryParams.search ?? null,
          order_by: queryParams.order_by ?? null,
          sort_order: queryParams.sort_order ?? null,
          is_active: queryParams.is_active ?? null,
          company_id: queryParams.company_id ?? null,
          location_id: queryParams.location_id ?? null,
          role: queryParams.role ?? null
        },
      }); 

      return response;
    } catch (err: any) {
      return err;
    } 
  }
  const getCurrentUser = async (access_token: string) :Promise<AxiosResponse<UserResponseScheme, any>> => {
    try {
      const response  = await axiosPrivate<UserResponseScheme>({
        url: `/api/v1/users/me`,
        method: "GET",
        headers: {
          "Content-Type": ContentType.Json,
          "Authorization": `Bearer ${access_token}`
        }
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
    activateUser,
    getCurrentUser
  }

};
export default useUserService