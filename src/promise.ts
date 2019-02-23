import { TimeoutError } from './errors';

export function delay(ms: number = 0) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function timeout(ms: number): Promise<never> {
  await delay(ms);
  throw new TimeoutError(ms);
}
