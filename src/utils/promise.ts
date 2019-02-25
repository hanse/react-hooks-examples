import { TimeoutError, AbortError } from './errors';

export function delay(ms: number = 0) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function timeout(ms: number): Promise<never> {
  await delay(ms);
  throw new TimeoutError(ms);
}

export function abortable<T>(promise: Promise<T>, signal: AbortSignal) {
  if (signal.aborted) {
    throw new AbortError();
  }

  return new Promise((resolve, reject) => {
    const abort = () => {
      reject(new AbortError());
    };

    signal.addEventListener('abort', abort);

    promise.then(value => {
      signal.removeEventListener('abort', abort);
      resolve(value);
    });
  });
}
