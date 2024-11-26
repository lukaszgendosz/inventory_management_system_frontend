import { AssetsResponseScheme, AssetCreateScheme, AssetResponseScheme, AssetUpdateScheme } from '../../models/asset';
import { ContentType } from "./axios";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { AxiosResponse } from "axios";
import { SortOrder } from '../../utils/constraints';



interface assetQueryParams {
  page: number | undefined;
  page_size: number | undefined;
  search: string | undefined;
  order_by: string | undefined;
  sort_order: SortOrder | undefined;
  company_id: Array<string> | null;
  location_id: Array<string> | null;
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
          company_id: queryParams.company_id,
          location_id: queryParams.location_id,
        },
      }); 

      return response;
    } catch (err: any) {
      return err;
    } 
  }
  const getCurrentAsset = async (access_token: string) :Promise<AxiosResponse<AssetResponseScheme, any>> => {
    try {
      const response  = await axiosPrivate<AssetResponseScheme>({
        url: `/api/v1/assets/me`,
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

  return {
    getAssets,
    getAsset,
    createAsset,
    updateAsset,
    deactivateAsset,
    activateAsset,
    getCurrentAsset
  }

};
export default useAssetService