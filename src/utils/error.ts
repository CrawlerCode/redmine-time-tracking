import { TRedmineError } from "@/api/redmine/types";
import { AxiosError, isAxiosError } from "axios";

export const getErrorMessage = (error: unknown): string => {
  if (isAxiosError(error)) {
    return (error as AxiosError<TRedmineError>).response?.data?.errors?.join(", ") || error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
};
