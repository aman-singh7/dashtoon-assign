import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  RawAxiosRequestHeaders,
  AxiosResponse,
  ResponseType,
} from "axios";

import Queue from "utils/DataStructures/Queue";

export type AxiosApiConfig = {
  baseURL: string;
  token?: string;
};

export type AxiosApiHeaders = RawAxiosRequestHeaders | undefined;

type ApiMethod = "GET" | "POST";

type ApiRequest = {
  method: ApiMethod;
  path: string;
  data?: Object;
  config: AxiosRequestConfig;
  successResolver: (response: AxiosResponse) => void;
  errorResolver: (error: any) => void;
};

// put it in multiples of 3 to divide the requests in 3 slots of 20s to avoid burst traffic
const RATE_LIMIT = 6; // 6 req/min => 2 requests will be done at intervals of 20s

class AxiosApi {
  axiosInstance: AxiosInstance;
  private pendingRequestQueue: Queue<ApiRequest>;
  private outstandingRequestCounter: number;
  token?: string;

  constructor(config: AxiosApiConfig) {
    const { baseURL, token } = config;
    this.token = token;
    this.pendingRequestQueue = new Queue<ApiRequest>();
    this.outstandingRequestCounter = 0;
    this.axiosInstance = axios.create({
      baseURL: baseURL,
    });
  }

  private processRequest = async (request: ApiRequest) => {
    // process request again after 20s if any present
    setTimeout(() => {
      const apiRequest: ApiRequest | undefined =
        this.pendingRequestQueue.deueue();
      if (apiRequest) {
        this.processRequest(apiRequest);
      } else {
        // no request in the pendingQueue, so make room for upcoming requests
        this.outstandingRequestCounter--;
      }
    }, 20000);

    let response: AxiosResponse;
    try {
      switch (request.method) {
        case "GET":
          response = await this.axiosInstance.get(request.path, request.config);
          break;
        case "POST":
          response = await this.axiosInstance.post(
            request.path,
            request.data,
            request.config
          );
          break;
      }
      request.successResolver(response);
    } catch (error: any) {
      request.errorResolver(error);
    }
  };

  private enqueueRequest = (
    method: ApiMethod,
    path: string,
    config: AxiosRequestConfig,
    data?: Object
  ) => {
    const responsePromise: Promise<AxiosResponse> = new Promise(
      (resolve, reject) => {
        const apiRequest: ApiRequest = {
          method,
          path,
          config,
          data,
          successResolver: resolve,
          errorResolver: reject,
        };
        if (this.outstandingRequestCounter < RATE_LIMIT / 3) {
          this.outstandingRequestCounter++;
          this.processRequest(apiRequest);
        } else {
          // these requests will be initiated by the requests which are already initiated
          this.pendingRequestQueue.enqueue(apiRequest);
        }
      }
    );
    return responsePromise;
  };

  // throw appropriate error message from the error object
  handleError = (error: any) => {
    let checkAxiosError = (error: any): error is AxiosError =>
      error instanceof AxiosError;

    let checkPlatformError = (error: any): error is Error =>
      error instanceof Error;

    let errorMessage = "Unexpected Error Ocuured";
    if (checkAxiosError(error)) {
      if (error.response?.data) {
        errorMessage = error.response?.data as string;
      }
    } else if (checkPlatformError(error)) {
      if (error.message) {
        errorMessage = error.message;
      }
    } else {
      if (error) {
        errorMessage = error;
      }
    }

    console.error(error);
    throw Error(errorMessage);
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

      const response: AxiosResponse = await this.enqueueRequest(
        "GET",
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
      const response: AxiosResponse = await this.enqueueRequest(
        "POST",
        path,
        config,
        data
      );
      return this.parseResponse(response);
    } catch (error: any) {
      this.handleError(error);
    }
  };
}

export default AxiosApi;
