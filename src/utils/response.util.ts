import { Response } from "express";

interface IResponseOptions {
  res: Response;
  statusCode?: number;
  status?: boolean;
  message?: string;
  data?: any;
  error?: any;
}

export const sendResponse = ({
  res,
  statusCode = 200,
  status = true,
  message = "Success",
  data = null,
  error = null,
}: IResponseOptions): Response => {
  const responsePayload: any = {
    status,
    message,
  };

  if (data) responsePayload.data = data;
  if (error) responsePayload.error = error;

  return res.status(statusCode).json(responsePayload);
};