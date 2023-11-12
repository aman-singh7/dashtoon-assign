import AxiosApi, { AxiosApiConfig } from "app/api/AxiosApi";

const apiConfig: AxiosApiConfig = {
  baseURL: process.env.REACT_APP_HUGGING_FACE_API_URL!,
  token: process.env.REACT_APP_HUGGING_FACE_API_TOKEN,
};

console.log("api config", apiConfig);

/**
 * Create Instance for this Api and if needed override public methods
 * like handleError, handleResponse
 *
 *
 */
const huggingfaceApi = new AxiosApi(apiConfig);

export default huggingfaceApi;
