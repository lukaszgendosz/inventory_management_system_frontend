import { ManufacturersResponseScheme, ManufacturerCreateScheme, ManufacturerResponseScheme, ManufacturerUpdateScheme } from '../../models/manufacturer';
import { ContentType } from "./axios";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { AxiosResponse } from "axios";

interface queryParams {
  page: number | undefined;
  page_size: number | undefined;
  search: string | undefined;
  order_by: string | undefined;
  sort_order: string | undefined;
}

const useManufacturerService = () => {
  const axiosPrivate = useAxiosPrivate();
  
  const getManufacturers = async (queryParams: queryParams) :Promise<AxiosResponse<ManufacturersResponseScheme, any>> => {
    try {
      const response  = await axiosPrivate<ManufacturersResponseScheme>({
        url: "/api/v1/manufacturers",
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
  const getManufacturer = async (manufacturerId: number) :Promise<AxiosResponse<ManufacturerResponseScheme, any>> => {
    try {
      const response  = await axiosPrivate<ManufacturerResponseScheme>({
        url: `/api/v1/manufacturers/${manufacturerId}`,
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
  const createManufacturer = async (manufacturerAttributes: ManufacturerCreateScheme) :Promise<AxiosResponse<ManufacturerResponseScheme, any>> => {
    try {
      const response  = await axiosPrivate<ManufacturerResponseScheme>({
        url: `/api/v1/manufacturers`,
        method: "POST",
        headers: {
          "Content-Type": ContentType.Json,
        },
        data: JSON.stringify(manufacturerAttributes)

      }); 

      return response;
    } catch (err: any) {
      return err;
    } 
  }

  const updateManufacturer = async (manufacturerId: number, manufacturerAttributes: ManufacturerUpdateScheme) :Promise<AxiosResponse<ManufacturerResponseScheme, any>> => {
    try {
      const response  = await axiosPrivate<ManufacturerResponseScheme>({
        url: `/api/v1/manufacturers/${manufacturerId}`,
        method: "PATCH",
        headers: {
          "Content-Type": ContentType.Json,
        },
        data: JSON.stringify(manufacturerAttributes)

      }); 

      return response;
    } catch (err: any) {
      return err;
    } 
  }

  const deleteManufacturer = async (manufacturerId: number) :Promise<AxiosResponse<ManufacturerResponseScheme, any>> => {
    try {
      const response  = await axiosPrivate<ManufacturerResponseScheme>({
        url: `/api/v1/manufacturers/${manufacturerId}`,
        method: "DELETE",
        headers: {
          "Content-Type": ContentType.Json,
        },
        params: {
          manufacturer_id: manufacturerId
        }

      }); 

      return response;
    } catch (err: any) {
      return err;
    } 
  }

  return {
    getManufacturers,
    getManufacturer,
    createManufacturer,
    updateManufacturer,
    deleteManufacturer
  }

};
export default useManufacturerService