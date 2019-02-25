import React, { useState } from 'react';
import useAbortablePromise from '../hooks/useAbortablePromise';
import JsonPrettyPrinter from './JsonPrettyPrinter';
import Button from './Button';
import { HttpError, TimeoutError } from '../utils/errors';
import { timeout, abortable, delay } from '../utils/promise';
import useAbortablePromiseWithTimeout from '../hooks/useAbortablePromiseWithTimeout';

const API_ROOT =
  process.env.REACT_APP_API_ROOT || 'https://jsonplaceholder.typicode.com';

async function fetchUserById(
  id: number,
  options: RequestInit = {}
): Promise<{ id: number; name: string }> {
  const response = await Promise.race([
    timeout(6000),
    fetch(`${API_ROOT}/users/${id}`, options)
  ]);

  if (!response.ok) {
    throw new HttpError(response);
  }

  return response.json();
}

function Users() {
  const [offset, setOffset] = useState(0);

  const [{ data, loading, error }, abort] = useAbortablePromiseWithTimeout(
    async signal => {
      return Promise.all([
        fetchUserById(offset + 1, { signal }),
        fetchUserById(offset + 2, { signal }),
        fetchUserById(offset + 3, { signal }),
        abortable(delay(1000).then(() => 'foo'), signal!)
      ]);
    },
    [offset]
  );

  return (
    <>
      <Button onClick={() => abort()}>Abort</Button>
      <Button onClick={() => setOffset(offset => offset + 1)}>
        Increase Offset ({offset})
      </Button>
      <JsonPrettyPrinter value={{ data, loading, error }} />
      {error && <p style={{ color: 'red' }}>{error.message}</p>}
    </>
  );
}

export default Users;
