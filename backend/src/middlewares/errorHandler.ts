import { Request, Response, NextFunction } from "express";

/**
 * Global error handling middleware
 */
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("❌ Error:", err);

  const statusCode = err.status || 500;
  const message =
    "[ErrorMiddleware]: " + err.message ||
    "[ErrorMiddleware]: " + err.data.message ||
    "[ErrorMiddleware]: Internal Server Error";

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
};
