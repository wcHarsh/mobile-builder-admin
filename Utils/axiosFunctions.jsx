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
    try {
      const httpOptions = await getHttpOptions({ ...defaultHeaders, isAuth });
      axios
        .get(BaseURL + url, { params, ...httpOptions })
        .then((response) => {
          console.log('response', response)
          resolve(response?.data);
        })
        .catch(async (error) => {
          console.log('errordemo', error)
          console.log('error.status:', error?.status)
          console.log('error.response?.status:', error?.response?.status)
          if (error?.response?.status === 401 || error?.status === 401) {
            console.log('401 detected, calling Logout()')
            Logout();

            // For server-side 401 errors, we need to throw a special error that the client can catch
            if (typeof window === 'undefined') {
              const serverError = new Error('Session expired. Please log in again.');
              serverError.status = 401;
              serverError.isSessionExpired = true;
              reject(serverError);
              return;
            }
          }
          reject(error?.response?.data || error);
        });
    } catch (error) {
      reject(error);
    }
  });
}

export const ApiPost = async (url, body, params, isAuth = true) => {
  return new Promise(async (resolve, reject) => {
    try {
      const httpOptions = await getHttpOptions({ ...defaultHeaders, isAuth });
      axios
        .post(BaseURL + url, body, {
          params,
          ...httpOptions,
        })
        .then((response) => {
          resolve(response?.data);
        })
        .catch(async (error) => {
          if ((error?.response?.status === 401 || error?.status === 401) && typeof window !== 'undefined' && window.location.pathname !== '/login') {
            Logout();
          }
          reject(error?.response?.data || error);
        });
    } catch (error) {
      reject(error);
    }
  });
};

export const ApiPut = async (url, body, params, isAuth = true) => {
  return new Promise(async (resolve, reject) => {
    try {
      const httpOptions = await getHttpOptions({ ...defaultHeaders, isAuth });
      axios
        .put(BaseURL + url, body, {
          params,
          ...httpOptions,
        })
        .then((response) => {
          resolve(response?.data);
        })
        .catch(async (error) => {
          if (error?.response?.status === 401 || error?.status === 401) {
            Logout();
          }
          reject(error?.response?.data || error);
        });
    } catch (error) {
      reject(error);
    }
  });
};

export const ApiDelete = async (url, params, isAuth = true) => {
  return new Promise(async (resolve, reject) => {
    try {
      const httpOptions = await getHttpOptions({ ...defaultHeaders, isAuth });
      axios
        .delete(BaseURL + url, {
          params,
          ...httpOptions,
        })
        .then((response) => {
          resolve(response?.data);
        })
        .catch(async (error) => {
          if (error?.response?.status === 401 || error?.status === 401) {
            Logout();
          }
          reject(error?.response?.data || error);
        });
    } catch (error) {
      reject(error);
    }
  });
};

export const getHttpOptions = async (options = defaultHeaders) => {
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
        const cookieStore = await cookies();
        const authToken = cookieStore?.get('auth-token')?.value;

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