import { Response } from "express";
import StatusCode from "./StatusCodes";

enum ResponseStatus {
	SUCCESS = 200,
	BAD_REQUEST = 400,
	UNAUTHORIZED = 401,
	FORBIDDEN = 403,
	NOT_FOUND = 404,
	INTERNAL_ERROR = 500,
}

abstract class ApiResponse {
	constructor(protected statusCode: StatusCode, protected status: ResponseStatus, protected message: string) { }
	private static sanitize<T extends ApiResponse>(response: T): T {
		const clone: T = {} as T;
		Object.assign(clone, response);
		// eslint-disable-next-line @typescript-eslint/no-namespace
		// @ts-ignore
		delete clone.status;
		for (const i in clone) if (typeof clone[i] === "undefined") delete clone[i];
		return clone;
	}

	protected prepare<T extends ApiResponse>(res: Response, response: T): Response {
		return res.status(this.status).json(ApiResponse.sanitize(response));
	}

	public send(res: Response): Response {
		return this.prepare<ApiResponse>(res, this);
	}
}

export class NotFoundResponse extends ApiResponse {
	private url: string | undefined;

	constructor(message = "Not Found") {
		super(StatusCode.FAILURE, ResponseStatus.NOT_FOUND, message);
	}

	send(res: Response): Response {
		this.url = res.req?.originalUrl;
		return super.prepare<NotFoundResponse>(res, this);
	}
}

export class ForbiddenResponse extends ApiResponse {
	constructor(message = "Forbidden") {
		super(StatusCode.FAILURE, ResponseStatus.FORBIDDEN, message);
	}
}

export class BadRequestResponse extends ApiResponse {
	constructor(message = "Bad Parameters") {
		super(StatusCode.FAILURE, ResponseStatus.BAD_REQUEST, message);
	}
}

export class InternalErrorResponse extends ApiResponse {
	constructor(message = "Internal Error") {
		super(StatusCode.FAILURE, ResponseStatus.INTERNAL_ERROR, message);
	}
}

export class SuccessMsgResponse extends ApiResponse {
	constructor(message: string) {
		super(StatusCode.SUCCESS, ResponseStatus.SUCCESS, message);
	}
}

export class FailureMsgResponse extends ApiResponse {
	constructor(message: string) {
		super(StatusCode.FAILURE, ResponseStatus.SUCCESS, message);
	}
}
