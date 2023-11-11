import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  RawAxiosRequestHeaders,
  AxiosResponse,
  ResponseType,
} from "axios";

export type AxiosApiConfig = {
  baseURL: string;
  token?: string;
};

export type AxiosApiHeaders = RawAxiosRequestHeaders | undefined;

class AxiosApi {
  axiosInstance: AxiosInstance;
  token?: string;

  constructor(config: AxiosApiConfig) {
    const { baseURL, token } = config;
    this.token = token;
    this.axiosInstance = axios.create({
      baseURL: baseURL,
    });
  }

  handleError = (error: any) => {
    let checkAxiosError = (error: any): error is AxiosError =>
      error instanceof AxiosError;

    let checkPlatformError = (error: any): error is Error =>
      error instanceof Error;

    if (checkAxiosError(error)) {
      console.error(error.response?.data);
    } else if (checkPlatformError(error)) {
      console.error(error.message);
    } else {
      console.error(error);
    }
  };

  parseResponse = (response: AxiosResponse) => {
    const checkBlob = (data: any): data is Blob => data instanceof Blob;
    if (checkBlob(response.data)) {
      return URL.createObjectURL(response.data);
    }
    return response.data;
  };

  generateHeaders = (
    authenticated: boolean,
    headerOptions: AxiosApiHeaders,
    token?: string
  ) => {
    let headers: AxiosApiHeaders = undefined;

    if (authenticated || token) {
      if (!token) {
        throw Error("token not specified");
      }
      headers = {
        Authorization: `Bearer ${token}`,
        ...headerOptions,
      };
    }

    return headers;
  };

  get = async (
    path: string,
    authenticated: boolean = true,
    responseType: ResponseType = "json",
    headerOptions?: AxiosApiHeaders,
    token?: string
  ) => {
    try {
      const headers = this.generateHeaders(
        authenticated,
        headerOptions,
        token ?? this.token
      );
      const config: AxiosRequestConfig = {
        responseType: responseType,
        headers: headers,
      };

      const response: AxiosResponse = await this.axiosInstance.get(
        path,
        config
      );

      return this.parseResponse(response);
    } catch (error: any) {
      this.handleError(error);
    }
    return "";
  };

  post = async (
    path: string,
    data: Object,
    authenticated: boolean = true,
    responseType: ResponseType = "json",
    headerOptions?: AxiosApiHeaders,
    token?: string
  ) => {
    try {
      const headers = this.generateHeaders(
        authenticated,
        headerOptions,
        token ?? this.token
      );
      const config: AxiosRequestConfig = {
        responseType: responseType,
        headers: headers,
      };
      const response: AxiosResponse = await this.axiosInstance.post(
        path,
        data,
        config
      );
      return this.parseResponse(response);
    } catch (error: any) {
      this.handleError(error);
    }
  };
}

export default AxiosApi;
