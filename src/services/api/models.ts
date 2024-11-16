import { ModelsResponseScheme, ModelCreateScheme, ModelResponseScheme, ModelUpdateScheme } from '../../models/model';
import { ContentType } from "./axios";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { AxiosResponse } from "axios";

interface queryParams {
  page: number | undefined;
  page_size: number | undefined;
  search: string | undefined;
  order_by: string | undefined;
  sort_order: string | undefined;
  manufacturer_id: Array<string> | null
}

const useModelService = () => {
  const axiosPrivate = useAxiosPrivate();
  
  const getModels = async (queryParams: queryParams) :Promise<AxiosResponse<ModelsResponseScheme, any>> => {
    console.log(queryParams)
    try {
      const response  = await axiosPrivate<ModelsResponseScheme>({
        url: "/api/v1/models",
        method: "GET",
        headers: {
          "Content-Type": ContentType.Json,
        },
        params: {
          page: queryParams.page,
          page_size: queryParams.page_size,
          search: queryParams.search,
          manufacturer_id: queryParams.manufacturer_id
        },
      }); 

      return response;
    } catch (err: any) {
      return err;
    } 
  }
  const getModel = async (modelId: number) :Promise<AxiosResponse<ModelResponseScheme, any>> => {
    try {
      const response  = await axiosPrivate<ModelResponseScheme>({
        url: `/api/v1/models/${modelId}`,
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
  const createModel = async (modelAttributes: ModelCreateScheme) :Promise<AxiosResponse<ModelResponseScheme, any>> => {
    try {
      const response  = await axiosPrivate<ModelResponseScheme>({
        url: `/api/v1/models`,
        method: "POST",
        headers: {
          "Content-Type": ContentType.Json,
        },
        data: JSON.stringify(modelAttributes)

      }); 

      return response;
    } catch (err: any) {
      return err;
    } 
  }

  const updateModel = async (modelId: number, modelAttributes: ModelUpdateScheme) :Promise<AxiosResponse<ModelResponseScheme, any>> => {
    try {
      const response  = await axiosPrivate<ModelResponseScheme>({
        url: `/api/v1/models/${modelId}`,
        method: "PATCH",
        headers: {
          "Content-Type": ContentType.Json,
        },
        data: JSON.stringify(modelAttributes)

      }); 

      return response;
    } catch (err: any) {
      return err;
    } 
  }

  const deleteModel = async (modelId: number) :Promise<AxiosResponse<ModelResponseScheme, any>> => {
    try {
      const response  = await axiosPrivate<ModelResponseScheme>({
        url: `/api/v1/models/${modelId}`,
        method: "DELETE",
        headers: {
          "Content-Type": ContentType.Json,
        },
        params: {
          model_id: modelId
        }

      }); 

      return response;
    } catch (err: any) {
      return err;
    } 
  }

  return {
    getModels,
    getModel,
    createModel,
    updateModel,
    deleteModel
  }

};
export default useModelService