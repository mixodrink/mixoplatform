import { Request, Response, NextFunction } from "express";
import { errorHandler } from "middlewares/errorHandler";

describe("Error Handler Middleware", () => {
  let req: Request;
  let res: Response;
  let next: NextFunction;

  beforeEach(() => {
    req = {} as Request;
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    next = jest.fn() as NextFunction;
  });

  it("should handle general errors with status 500", () => {
    const error = new Error("Something went wrong");

    // Act: Call the error handler with the error
    errorHandler(error, req, res, next);

    // Assert: Check if the response status and message are set correctly
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "[ErrorMiddleware]: Something went wrong",
      stack: expect.any(String), // Ensure stack trace is included (unless in production)
    });
  });

  it("should handle errors with a custom status code", () => {
    const error = new Error("Unauthorized");
    (error as any).status = 401;

    // Act: Call the error handler with the error
    errorHandler(error, req, res, next);

    // Assert: Check if the response status is 401
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "[ErrorMiddleware]: Unauthorized",
      stack: expect.any(String),
    });
  });

  it("should omit stack trace in production", () => {
    process.env.NODE_ENV = "production"; // Set environment to production
    const error = new Error("Internal Server Error");

    // Act: Call the error handler with the error
    errorHandler(error, req, res, next);

    // Assert: Ensure stack trace is not included in production environment
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "[ErrorMiddleware]: Internal Server Error",
      stack: undefined, // No stack trace in production
    });
  });

  it("should return a fallback error message when no message is provided", () => {
    const error = new Error();

    // Act: Call the error handler with the error
    errorHandler(error, req, res, next);

    // Assert: Ensure the default error message is returned
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "[ErrorMiddleware]: Internal Server Error",
      stack: expect.any(String),
    });
  });
});
