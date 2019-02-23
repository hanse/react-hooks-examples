export class HttpError extends Error {
  response?: Response;
  constructor(response: Response) {
    super(`${response.status} ${response.statusText}`);
    this.name = this.constructor.name;
    this.response = response;
  }
}

export class TimeoutError extends Error {
  timeout?: number;
  constructor(timeout: number, message: string = 'Operation timed out') {
    super(message);
    this.name = this.constructor.name;
    this.timeout = timeout;
  }
}
