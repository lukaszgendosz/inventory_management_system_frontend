import { LocationsResponseScheme, LocationCreateScheme, LocationResponseScheme, LocationUpdateScheme } from '../../models/location';
import { ContentType } from "./axios";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { AxiosResponse } from "axios";

interface queryParams {
  page: number | undefined;
  page_size: number | undefined;
  search: string | undefined;
}

const useLocationService = () => {
  const axiosPrivate = useAxiosPrivate();
  
  const getLocations = async (queryParams: queryParams) :Promise<AxiosResponse<LocationsResponseScheme, any>> => {
    try {
      const response  = await axiosPrivate<LocationsResponseScheme>({
        url: "/api/v1/locations",
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
  const getLocation = async (locationId: number) :Promise<AxiosResponse<LocationResponseScheme, any>> => {
    try {
      const response  = await axiosPrivate<LocationResponseScheme>({
        url: `/api/v1/locations/${locationId}`,
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
  const createLocation = async (locationAttributes: LocationCreateScheme) :Promise<AxiosResponse<LocationResponseScheme, any>> => {
    try {
      const response  = await axiosPrivate<LocationResponseScheme>({
        url: `/api/v1/locations`,
        method: "POST",
        headers: {
          "Content-Type": ContentType.Json,
        },
        data: JSON.stringify(locationAttributes)

      }); 

      return response;
    } catch (err: any) {
      return err;
    } 
  }

  const updateLocation = async (locationId: number, locationAttributes: LocationUpdateScheme) :Promise<AxiosResponse<LocationResponseScheme, any>> => {
    try {
      const response  = await axiosPrivate<LocationResponseScheme>({
        url: `/api/v1/locations/${locationId}`,
        method: "PATCH",
        headers: {
          "Content-Type": ContentType.Json,
        },
        data: JSON.stringify(locationAttributes)

      }); 

      return response;
    } catch (err: any) {
      return err;
    } 
  }

  const deactivateLocation = async (locationId: number) :Promise<AxiosResponse<LocationResponseScheme, any>> => {
    try {
      const response  = await axiosPrivate<LocationResponseScheme>({
        url: `/api/v1/locations/${locationId}/deactivate`,
        method: "PATCH",
        headers: {
          "Content-Type": ContentType.Json,
        },
        params: {
          location_id: locationId
        }

      }); 

      return response;
    } catch (err: any) {
      return err;
    } 
  }

  return {
    getLocations,
    getLocation,
    createLocation,
    updateLocation,
    deactivateLocation
  }

};
export default useLocationService