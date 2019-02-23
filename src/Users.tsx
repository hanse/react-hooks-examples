import React, { useState } from 'react';
import { useAbortablePromise } from './usePromise';
import JsonPrettyPrinter from './JsonPrettyPrinter';
import Button from './Button';
import { HttpError } from './errors';

async function fetchUserById(
  id: number,
  options: RequestInit = {}
): Promise<{ id: number; name: string }> {
  const response = await fetch(`/api/users/${id}`, options);
  if (!response.ok) {
    throw new HttpError(response);
  }

  return response.json();
}

function Users() {
  const [offset, setOffset] = useState(0);
  //const controller = useMemo(createAbortController, [offset]);

  // const { data, loading, error } = usePromise(
  //   () =>
  //     Promise.all([
  //       fetchUserById(offset + 1, { signal: controller.signal }),
  //       fetchUserById(offset + 2, { signal: controller.signal }),
  //       fetchUserById(offset + 3, { signal: controller.signal })
  //     ]),
  //   [offset],
  //   controller.signal,
  //   () => controller.abort()
  // );

  const [{ data, loading, error }, abort] = useAbortablePromise(
    signal =>
      Promise.all([
        fetchUserById(offset + 1, { signal }),
        fetchUserById(offset + 2, { signal }),
        fetchUserById(offset + 3, { signal })
      ]),
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
