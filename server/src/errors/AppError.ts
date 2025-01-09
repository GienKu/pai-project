

/**
 * Custom error class that extends the built-in `Error` class.
 * Represents application-specific errors with an associated HTTP status code.
 */
export class AppError extends Error {
  /**
   * The HTTP status code associated with the error.
   */
  public readonly statusCode: number;

  /**
   * Creates an instance of `AppError`.
   * @param message - The error message.
   * @param statusCode - The HTTP status code (default is 400).
   */
  constructor(message: string, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}
