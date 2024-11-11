import { CompaniesResponseScheme, CompanyCreateScheme, CompanyResponseScheme, CompanyUpdateScheme } from '../../models/company';
import { ContentType } from "./axios";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { AxiosResponse } from "axios";
import { baseQueryParams } from '../../utils/constraints';



const useCompanyService = () => {
  const axiosPrivate = useAxiosPrivate();
  
  const getCompanies = async (queryParams: baseQueryParams) :Promise<AxiosResponse<CompaniesResponseScheme, any>> => {
    try {
      const response  = await axiosPrivate<CompaniesResponseScheme>({
        url: "/api/v1/companies",
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
        },
      }); 

      return response;
    } catch (err: any) {
      return err;
    } 
  }
  const getCompany = async (companyId: number) :Promise<AxiosResponse<CompanyResponseScheme, any>> => {
    try {
      const response  = await axiosPrivate<CompanyResponseScheme>({
        url: `/api/v1/companies/${companyId}`,
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
  const createCompany = async (companyAttributes: CompanyCreateScheme) :Promise<AxiosResponse<CompanyResponseScheme, any>> => {
    try {
      const response  = await axiosPrivate<CompanyResponseScheme>({
        url: `/api/v1/companies`,
        method: "POST",
        headers: {
          "Content-Type": ContentType.Json,
        },
        data: JSON.stringify(companyAttributes)

      }); 

      return response;
    } catch (err: any) {
      return err;
    } 
  }

  const updateCompany = async (companyId: number, companyAttributes: CompanyUpdateScheme) :Promise<AxiosResponse<CompanyResponseScheme, any>> => {
    try {
      const response  = await axiosPrivate<CompanyResponseScheme>({
        url: `/api/v1/companies/${companyId}`,
        method: "PATCH",
        headers: {
          "Content-Type": ContentType.Json,
        },
        data: JSON.stringify(companyAttributes)

      }); 

      return response;
    } catch (err: any) {
      return err;
    } 
  }

  const deleteCompany = async (companyId: number) :Promise<AxiosResponse<CompanyResponseScheme, any>> => {
    try {
      const response  = await axiosPrivate<CompanyResponseScheme>({
        url: `/api/v1/companies/${companyId}`,
        method: "DELETE",
        headers: {
          "Content-Type": ContentType.Json,
        },
        params: {
          company_id: companyId
        }

      }); 

      return response;
    } catch (err: any) {
      return err;
    } 
  }

  return {
    getCompanies,
    getCompany,
    createCompany,
    updateCompany,
    deleteCompany
  }

};

export default useCompanyService