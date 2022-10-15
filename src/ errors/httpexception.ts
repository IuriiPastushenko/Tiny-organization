export class HttpException extends Error {
	statusCode: number;
	contentError: string;
	constructor(statusCode: number, message: string, contentError: string) {
		super(message);
		this.statusCode = statusCode;
		this.message = message;
		this.contentError = contentError;
	}
}
