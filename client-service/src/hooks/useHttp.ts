import { useState } from "react";
import axios from "axios";

interface UseHttp {
  error: undefined | string;
  loading: boolean;
  sendRequest: (
    method: "get" | "post" | "patch" | "delete" | "put",
    url: string,
    body?: any
  ) => Promise<any>;
  removeError: () => void;
}

export const useHttp = (): UseHttp => {
  const [error, setError] = useState<undefined | string>();
  const [loading, setLoading] = useState<boolean>(false);

  const sendRequest = async (
    method: "get" | "post" | "patch" | "delete" | "put",
    url: string,
    body?: any
  ): Promise<any> => {
    try {
      setLoading(true);
      //   @ts-ignore
      const { data } = await axios[method](url, method !== "get" ? body : {});
      setLoading(false);
      return data;
    } catch (err) {
      setError(err.response.data.message || "Something went wrong!");
    }
  };

  const removeError = (): void => {
    setError(undefined);
  };

  return { error, loading, sendRequest, removeError };
};
