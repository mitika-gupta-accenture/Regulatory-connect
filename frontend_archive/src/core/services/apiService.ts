import axios from "axios";
import { API_BASE_URL,CMS_API_BASE_URL,TOKEN_BASE_URL } from "../constants/baseUrl";

// GET - will perform a get request with the exact URI provided
export async function _get(endpointURL: string) {
  const headers = { "Content-Type": "application/json" };
  return axios.get(API_BASE_URL + endpointURL, { headers: headers });
  }

// GET - will perform a get request with the exact URI provided
export async function _getCMSData(endpointURL: string, headers?:{}) {
  return axios.get(CMS_API_BASE_URL + endpointURL, { headers: headers });
}

export async function _generateAccessToken(endpointURL: string) {
  return axios.post(TOKEN_BASE_URL + endpointURL);
}
axios.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (!error.response || error.response.status === 500) {
      window.location.href = '/500';
    }
    return Promise.reject(error);
  }
);
