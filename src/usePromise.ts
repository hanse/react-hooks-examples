import { useMemo, useEffect, useReducer } from 'react';
import { AbortError } from './errors';

type State<T> = {
  data: T | null;
  error: Error | null;
  loading: boolean;
};

type Action<T> =
  | {
      type: 'resolved';
      data: T;
    }
  | {
      type: 'rejected';
      error: Error;
    }
  | { type: 'pending' };

function reducer<T>(state: State<T>, action: Action<T>) {
  switch (action.type) {
    case 'resolved':
      return {
        ...state,
        data: action.data,
        loading: false
      };

    case 'rejected':
      return {
        ...state,
        error: action.error,
        loading: false
      };

    case 'pending':
      return {
        ...state,
        loading: true
      };

    default:
      throw new Error();
  }
}

export default function usePromise<T>(
  promise: () => Promise<T>,
  inputs: Array<any>,
  signal?: AbortSignal | null,
  onCancel?: () => void
) {
  const [state, dispatch] = useReducer(reducer, {
    data: null,
    error: null,
    loading: false
  });

  const promiseFn = useMemo(() => promise, inputs);

  useEffect(() => {
    let unmounted = false;
    let aborted = false;

    function abort() {
      aborted = true;

      dispatch({ type: 'rejected', error: new AbortError() });
    }

    if (signal) {
      if (signal.aborted) {
        throw new AbortError();
      }

      signal.addEventListener('abort', abort);
    }

    dispatch({ type: 'pending' });

    promiseFn().then(
      result => {
        if (unmounted || aborted) return;
        dispatch({ type: 'resolved', data: result });
        signal && signal.removeEventListener('abort', abort);
      },
      error => {
        if (unmounted || aborted) return;
        dispatch({ type: 'rejected', error });
        signal && signal.removeEventListener('abort', abort);
      }
    );

    return () => {
      unmounted = true;
      if (signal) {
        signal.removeEventListener('abort', abort);
      }
      onCancel && onCancel();
    };
  }, [promiseFn]);

  console.log(state);
  return state;
}
