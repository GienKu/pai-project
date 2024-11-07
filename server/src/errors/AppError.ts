/*
 * Custom error class to handle application errors
 * @param message - error message generic message saying that operation failed
 * @param statusCode - HTTP status code
 */

export class AppError extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}
