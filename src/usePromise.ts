import { useMemo, useEffect, useReducer } from 'react';

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
  inputs: Array<string>
) {
  const [{ data, error, loading }, dispatch] = useReducer(reducer, {
    data: null,
    error: null,
    loading: false
  });

  const promiseFn = useMemo(() => promise, inputs);

  useEffect(() => {
    let cancelled = false;

    dispatch({ type: 'pending' });

    promiseFn().then(
      result => {
        if (cancelled) return;
        dispatch({ type: 'resolved', data: result });
      },
      error => {
        if (cancelled) return;
        dispatch({ type: 'rejected', error });
      }
    );

    return () => {
      cancelled = true;
    };
  }, [promiseFn]);

  console.log({ data, error, loading });
  return { data, error, loading };
}
