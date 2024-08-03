import { statusCode } from "../helper/index.js";

class RequestError extends Error {
  constructor(code, msg, data) {
    super(msg);
    this.code = code;
    this.data = data;
  }
}

class BadRequestError extends RequestError {
  constructor(msg, data) {
    super(statusCode.BAD_REQUEST, msg, data);
  }
}

class NotFoundError extends RequestError {
  constructor(msg, data) {
    super(statusCode.NOT_FOUND, msg, data);
  }
}

export { RequestError, BadRequestError, NotFoundError };
