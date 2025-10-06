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
        if (error?.response?.status === 401 && window.location.pathname !== '/login') {
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
    // Check if we're on the client side (browser)
    if (typeof window !== 'undefined' && localStorage) {
      try {
        const storedData = localStorage.getItem("mobile_builder_user_data");
        if (storedData) {
          userData = JSON.parse(storedData);
        }
      } catch (error) {
        console.warn("Error parsing user data from localStorage:", error);
      }
    } else {
      // Server-side: try to get token from cookies
      try {
        const { cookies } = require('next/headers');
        const cookieStore = cookies();
        const authToken = cookieStore.get('auth-token')?.value;

        if (authToken) {
          // Create a minimal userData object with the token
          userData = { token: authToken };
        }
      } catch (error) {
        console.warn("Error reading auth token from cookies:", error);
      }
    }

    if (userData?.token) {
      headers["Authorization"] = "Bearer " + userData.token;
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