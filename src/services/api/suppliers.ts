import { SuppliersResponseScheme, SupplierCreateScheme, SupplierResponseScheme, SupplierUpdateScheme } from '../../models/supplier';
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

const useSupplierService = () => {
  const axiosPrivate = useAxiosPrivate();
  
  const getSuppliers = async (queryParams: queryParams) :Promise<AxiosResponse<SuppliersResponseScheme, any>> => {
    try {
      const response  = await axiosPrivate<SuppliersResponseScheme>({
        url: "/api/v1/suppliers",
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
  const getSupplier = async (supplierId: number) :Promise<AxiosResponse<SupplierResponseScheme, any>> => {
    try {
      const response  = await axiosPrivate<SupplierResponseScheme>({
        url: `/api/v1/suppliers/${supplierId}`,
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
  const createSupplier = async (supplierAttributes: SupplierCreateScheme) :Promise<AxiosResponse<SupplierResponseScheme, any>> => {
    try {
      const response  = await axiosPrivate<SupplierResponseScheme>({
        url: `/api/v1/suppliers`,
        method: "POST",
        headers: {
          "Content-Type": ContentType.Json,
        },
        data: JSON.stringify(supplierAttributes)

      }); 

      return response;
    } catch (err: any) {
      return err;
    } 
  }

  const updateSupplier = async (supplierId: number, supplierAttributes: SupplierUpdateScheme) :Promise<AxiosResponse<SupplierResponseScheme, any>> => {
    try {
      const response  = await axiosPrivate<SupplierResponseScheme>({
        url: `/api/v1/suppliers/${supplierId}`,
        method: "PATCH",
        headers: {
          "Content-Type": ContentType.Json,
        },
        data: JSON.stringify(supplierAttributes)

      }); 

      return response;
    } catch (err: any) {
      return err;
    } 
  }

  const deleteSupplier = async (supplierId: number) :Promise<AxiosResponse<SupplierResponseScheme, any>> => {
    try {
      const response  = await axiosPrivate<SupplierResponseScheme>({
        url: `/api/v1/suppliers/${supplierId}`,
        method: "DELETE",
        headers: {
          "Content-Type": ContentType.Json,
        },
        params: {
          supplier_id: supplierId
        }

      }); 

      return response;
    } catch (err: any) {
      return err;
    } 
  }

  return {
    getSuppliers,
    getSupplier,
    createSupplier,
    updateSupplier,
    deleteSupplier
  }

};
export default useSupplierService