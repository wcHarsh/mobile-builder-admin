import axios from "axios";
import { Logout } from "./commonFunctions";

const defaultHeaders = {
  isAuth: true,
  AdditionalParams: {},
  isJsonRequest: false,
  api_key: true,
  access_token: null
};

const BaseURL = process.env.NEXT_PUBLIC_API_URL

export const ApiGet = async (url, params, isAuth = true) => {
  return new Promise(async (resolve, reject) => {
    axios
      .get(BaseURL + url, { params, ...getHttpOptions({ ...defaultHeaders, isAuth }) })
      .then((response) => {
        resolve(response?.data);
      })
      .catch(async (error) => {
        if (error?.response?.status === 401) {
          Logout();
        }
        reject(error?.response?.data || error);
      });
  });
}

export const ApiPost = async (url, body, params, isAuth = true) => {
  return new Promise(async (resolve, reject) => {
    axios
      .post(BaseURL + url, body, {
        params,
        ...getHttpOptions({ ...defaultHeaders, isAuth }),
      })
      .then((response) => {
        resolve(response?.data);
      })
      .catch(async (error) => {
        if (error?.response?.status === 401 && window.location.pathname !== '/auth/login') {
          Logout();
        }
        reject(error?.response?.data || error);
      });
  });
};

export const ApiPut = async (url, body, params, isAuth = true) => {
  return new Promise((resolve, reject) => {
    axios
      .put(BaseURL + url, body, {
        params,
        ...getHttpOptions({ ...defaultHeaders, isAuth }),
      })
      .then((response) => {
        resolve(response?.data);
      })
      .catch(async (error) => {
        if (error?.response?.status === 401) {
          Logout();
        }
        reject(error?.response?.data || error);
      });
  });
};

export const ApiDelete = async (url, params, isAuth = true) => {
  return new Promise((resolve, reject) => {
    axios
      .delete(BaseURL + url, {
        params,
        ...getHttpOptions({ ...defaultHeaders, isAuth }),
      })
      .then((response) => {
        resolve(response?.data);
      })
      .catch(async (error) => {
        if (error?.response?.status === 401) {
          Logout();
        }
        reject(error?.response?.data || error);
      });
  });
};

export const getHttpOptions = (options = defaultHeaders) => {
  let userData = null;
  let headers = {};

  if (options.hasOwnProperty("isAuth") && options.isAuth) {
    // Only access localStorage on the client side
    if (typeof window !== 'undefined' && localStorage) {
      try {
        const storedData = localStorage.getItem("mobile_builder_user_data");
        if (storedData) {
          userData = JSON.parse(storedData)?.data;
        }
      } catch (error) {
        console.warn("Error parsing user data from localStorage:", error);
      }
    }

    if (userData) {
      headers["Authorization"] = "Bearer " + userData?.tokens?.accessToken;
    }
    headers["Cache-Control"] = "no-cache";
  }

  if (options.hasOwnProperty("isJsonRequest") && options.isJsonRequest) {
    headers["Content-Type"] = "application/json";
    // headers["Access-Control-Allow-Origin"] = "*";
  }

  if (options.hasOwnProperty("AdditionalParams") && options.AdditionalParams) {
    headers = { ...headers, ...options.AdditionalParams };
  }
  return { headers };
};