import { AxiosApiHeaders } from "app/api/AxiosApi";
import huggingfaceApi from "app/api/HuggingFace";

export const fetchComicFromText = async (text: string) => {
  const data = {
    inputs: text,
  };
  const headers: AxiosApiHeaders = {
    Accept: "image/png",
  };
  const imageURL: string = await huggingfaceApi.post(
    "/",
    data,
    true,
    "blob",
    headers
  );
  return imageURL;
};
