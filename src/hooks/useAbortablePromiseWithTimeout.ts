import { useCallback } from 'react';
import { State } from './usePromise';
import useAbortablePromise from './useAbortablePromise';
import { TimeoutError } from '../utils/errors';

function useAbortablePromiseWithTimeout<T>(
  promise: (signal: AbortSignal | undefined) => Promise<T>,
  inputs: Array<any>
) {
  const promiseFn = useCallback(promise, inputs);

  const [state, abort] = useAbortablePromise(async signal => {
    try {
      return await promiseFn(signal);
    } catch (error) {
      if (error instanceof TimeoutError) {
        abort();
      }

      throw error;
    }
  }, inputs);

  return [state, abort] as [State<T>, () => void];
}

export default useAbortablePromiseWithTimeout;
