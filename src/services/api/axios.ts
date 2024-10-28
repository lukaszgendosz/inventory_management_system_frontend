import axios from 'axios';
import qs from 'qs';
import { BASE_URL } from '../../utils/constraints';

export enum ContentType {
    Json = "application/json",
    FormData = "multipart/form-data",
    UrlEncoded = "application/x-www-form-urlencoded",
    Text = "text/plain",
  };

export default axios.create({
    baseURL: BASE_URL
});

export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    paramsSerializer: (params) => {
        return qs.stringify(params, { arrayFormat: 'repeat', skipNulls: true, encode: true });
      },
});