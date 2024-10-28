import { DepartmentsResponseScheme, DepartmentCreateScheme, DepartmentResponseScheme, DepartmentUpdateScheme } from '../../models/department';
import { ContentType } from "./axios";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { AxiosResponse } from "axios";

interface queryParams {
  page: number | undefined;
  page_size: number | undefined;
  search: string | undefined;
}

const useDepartmentService = () => {
  const axiosPrivate = useAxiosPrivate();
  
  const getDepartments = async (queryParams: queryParams) :Promise<AxiosResponse<DepartmentsResponseScheme, any>> => {
    try {
      const response  = await axiosPrivate<DepartmentsResponseScheme>({
        url: "/api/v1/departments",
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
  const getDepartment = async (departmentId: number) :Promise<AxiosResponse<DepartmentResponseScheme, any>> => {
    try {
      const response  = await axiosPrivate<DepartmentResponseScheme>({
        url: `/api/v1/departments/${departmentId}`,
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
  const createDepartment = async (departmentAttributes: DepartmentCreateScheme) :Promise<AxiosResponse<DepartmentResponseScheme, any>> => {
    try {
      const response  = await axiosPrivate<DepartmentResponseScheme>({
        url: `/api/v1/departments`,
        method: "POST",
        headers: {
          "Content-Type": ContentType.Json,
        },
        data: JSON.stringify(departmentAttributes)

      }); 

      return response;
    } catch (err: any) {
      return err;
    } 
  }

  const updateDepartment = async (departmentId: number, departmentAttributes: DepartmentUpdateScheme) :Promise<AxiosResponse<DepartmentResponseScheme, any>> => {
    try {
      const response  = await axiosPrivate<DepartmentResponseScheme>({
        url: `/api/v1/departments/${departmentId}`,
        method: "PATCH",
        headers: {
          "Content-Type": ContentType.Json,
        },
        data: JSON.stringify(departmentAttributes)

      }); 

      return response;
    } catch (err: any) {
      return err;
    } 
  }

  const deactivateDepartment = async (departmentId: number) :Promise<AxiosResponse<DepartmentResponseScheme, any>> => {
    try {
      const response  = await axiosPrivate<DepartmentResponseScheme>({
        url: `/api/v1/departments/${departmentId}/deactivate`,
        method: "PATCH",
        headers: {
          "Content-Type": ContentType.Json,
        },
        params: {
          department_id: departmentId
        }

      }); 

      return response;
    } catch (err: any) {
      return err;
    } 
  }

  return {
    getDepartments,
    getDepartment,
    createDepartment,
    updateDepartment,
    deactivateDepartment
  }

};
export default useDepartmentService