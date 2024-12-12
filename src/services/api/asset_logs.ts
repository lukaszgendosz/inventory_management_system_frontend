
import { ContentType } from "./axios";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { AxiosResponse } from "axios";
import { AssetLogResponseScheme } from "../../models/asset_logs";




const useAssetService = () => {
  const axiosPrivate = useAxiosPrivate();
  
  const getAssetLogs = async (asset_id: number) :Promise<AxiosResponse<Array<AssetLogResponseScheme>, any>> => {
    try {
      const response  = await axiosPrivate<Array<AssetLogResponseScheme>>({
        url: `/api/v1/asset-logs`,
        method: "GET",
        headers: {
          "Content-Type": ContentType.Json,
        },
        params: {
          asset_id: asset_id
        }
      }); 

      return response;
    } catch (err: any) {
      return err;
    } 
  }
  
  return {
    getAssetLogs,
  }

};
export default useAssetService