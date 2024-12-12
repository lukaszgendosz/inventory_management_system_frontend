import { AssetsResponseScheme, AssetCreateScheme, AssetResponseScheme, AssetUpdateScheme } from '../../models/asset';
import { ContentType } from "./axios";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { AxiosResponse } from "axios";
import { SortOrder } from '../../utils/constraints';



interface assetQueryParams {
  page?: number;
  page_size?: number;
  search?: string;
  order_by?: string;
  sort_order: SortOrder;
  status?: string[] | null;
  company_id?: string[] | null;
  location_id?: string[] | null;
  model_id?: string[] | null;
  supplier_id?: string[] | null;
  manufacturer_id?: string[] | null;
  user_id?: string[] | null;
}

const useAssetService = () => {
  const axiosPrivate = useAxiosPrivate();
  
  const getAssets = async (queryParams: assetQueryParams) :Promise<AxiosResponse<AssetsResponseScheme, any>> => {
    try {
      const response  = await axiosPrivate<AssetsResponseScheme>({
        url: "/api/v1/assets",
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
          ...(queryParams.status !== undefined && { status: queryParams.status }),
          ...(queryParams.company_id !== undefined && { company_id: queryParams.company_id }),
          ...(queryParams.location_id !== undefined && { location_id: queryParams.location_id }),
          ...(queryParams.model_id !== undefined && { model_id: queryParams.model_id }),
          ...(queryParams.supplier_id !== undefined && { supplier_id: queryParams.supplier_id }),
          ...(queryParams.manufacturer_id !== undefined && { manufacturer_id: queryParams.manufacturer_id }),
          ...(queryParams.user_id !== undefined && { user_id: queryParams.user_id }),
        },
      }); 

      return response;
    } catch (err: any) {
      return err;
    } 
  }
  const getCurrentUserAssets = async () :Promise<AxiosResponse<AssetResponseScheme[], any>> => {
    try {
      const response  = await axiosPrivate<AssetResponseScheme[]>({
        url: `/api/v1/assets/me`,
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
  const getAsset = async (assetId: number) :Promise<AxiosResponse<AssetResponseScheme, any>> => {
    try {
      const response  = await axiosPrivate<AssetResponseScheme>({
        url: `/api/v1/assets/${assetId}`,
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
  const createAsset = async (assetAttributes: AssetCreateScheme) :Promise<AxiosResponse<AssetResponseScheme, any>> => {
    try {
      const response  = await axiosPrivate<AssetResponseScheme>({
        url: `/api/v1/assets`,
        method: "POST",
        headers: {
          "Content-Type": ContentType.Json,
        },
        data: JSON.stringify(assetAttributes)

      }); 

      return response;
    } catch (err: any) {
      return err;
    } 
  }

  const updateAsset = async (assetId: number, assetAttributes: AssetUpdateScheme) :Promise<AxiosResponse<AssetResponseScheme, any>> => {
    try {
      const response  = await axiosPrivate<AssetResponseScheme>({
        url: `/api/v1/assets/${assetId}`,
        method: "PATCH",
        headers: {
          "Content-Type": ContentType.Json,
        },
        data: JSON.stringify(assetAttributes)

      }); 

      return response;
    } catch (err: any) {
      return err;
    } 
  }

  const deactivateAsset = async (assetId: number) :Promise<AxiosResponse<AssetResponseScheme, any>> => {
    try {
      const response  = await axiosPrivate<AssetResponseScheme>({
        url: `/api/v1/assets/${assetId}/deactivate`,
        method: "PATCH",
        headers: {
          "Content-Type": ContentType.Json,
        },
        params: {
          asset_id: assetId
        }

      }); 

      return response;
    } catch (err: any) {
      return err;
    } 
  }

  const activateAsset = async (assetId: number) :Promise<AxiosResponse<AssetResponseScheme, any>> => {
    try {
      const response  = await axiosPrivate<AssetResponseScheme>({
        url: `/api/v1/assets/${assetId}/activate`,
        method: "PATCH",
        headers: {
          "Content-Type": ContentType.Json,
        },
        params: {
          asset_id: assetId
        }

      }); 

      return response;
    } catch (err: any) {
      return err;
    } 
  }

  const checkoutAsset = async (assetId: number, userId: number) :Promise<AxiosResponse<AssetResponseScheme, any>> => {
    try {
      const response  = await axiosPrivate<AssetResponseScheme>({
        url: `/api/v1/assets/${assetId}/checkout`,
        method: "PATCH",
        headers: {
          "Content-Type": ContentType.Json,
        },
        params: {
          asset_id: assetId,
          user_id: userId
        }

      }); 

      return response;
    } catch (err: any) {
      return err;
    } 
  }
  const checkinAsset = async (assetId: number) :Promise<AxiosResponse<AssetResponseScheme, any>> => {
    try {
      const response  = await axiosPrivate<AssetResponseScheme>({
        url: `/api/v1/assets/${assetId}/checkin`,
        method: "PATCH",
        headers: {
          "Content-Type": ContentType.Json,
        }

      }); 

      return response;
    } catch (err: any) {
      return err;
    } 
  }

  const exportAssets = async (exportFormat: ContentType, queryParams: assetQueryParams) :Promise<AxiosResponse<any, any>> => {
    try {
      const response = await axiosPrivate({
        url: "/api/v1/assets/export",
        method: "GET",
        headers: {
          "Content-Type": ContentType.Json,
          "Accept": exportFormat,
        },
        params: {
          page: queryParams.page,
          page_size: queryParams.page_size,
          search: queryParams.search,
          order_by: queryParams.order_by,
          sort_order: queryParams.sort_order,
          ...(queryParams.company_id !== undefined && { company_id: queryParams.company_id }),
          ...(queryParams.location_id !== undefined && { location_id: queryParams.location_id }),
          ...(queryParams.model_id !== undefined && { model_id: queryParams.model_id }),
          ...(queryParams.supplier_id !== undefined && { supplier_id: queryParams.supplier_id }),
          ...(queryParams.manufacturer_id !== undefined && { manufacturer_id: queryParams.manufacturer_id }),
          ...(queryParams.user_id !== undefined && { user_id: queryParams.user_id }),
        },
        responseType: 'blob',
      }); 
      return response;
    } catch (err: any) {
      return err;
    } 
  }

  const getUserAssets = async (userId: number): Promise<AxiosResponse<AssetsResponseScheme, any>> => {
    try {
      const response = await axiosPrivate<AssetsResponseScheme>({
        url: `/api/v1/users/${userId}/assets`,
        method: "GET",
        headers: {
          "Content-Type": ContentType.Json,
        }
      }); 

      return response;
    } catch (err: any) {
      return err;
    } 
  };

  return {
    getAssets,
    getAsset,
    createAsset,
    updateAsset,
    deactivateAsset,
    activateAsset,
    getCurrentUserAssets,
    checkoutAsset,
    checkinAsset,
    exportAssets,
    getUserAssets
  }

};
export default useAssetService