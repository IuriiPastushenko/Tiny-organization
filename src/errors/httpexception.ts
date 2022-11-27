export class HttpException extends Error {
  statusCode: number;
  contentError: string;
  constructor(statusCode: number, contentError: string, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.contentError = contentError;
    this.message = message;
  }
}
