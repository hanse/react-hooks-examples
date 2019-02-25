import { TimeoutError, HttpError } from '../utils/errors';

test('HttpError', () => {
  const response = new Response();
  const error = new HttpError(response);
  expect(error.message).toEqual('200 OK');
  expect(error instanceof Error).toEqual(true);
  expect(error.name).toEqual('HttpError');
  expect(error.stack).toContain('HttpError');
  expect(error.response).toBe(response);
});

test('TimeoutError', () => {
  const timeout = 50000;
  const error = new TimeoutError(timeout);
  expect(error.message).toEqual('Operation timed out');
  expect(error instanceof Error).toEqual(true);
  expect(error.name).toEqual('TimeoutError');
  expect(error.stack).toContain('TimeoutError');
  expect(error.timeout).toBe(timeout);
});
