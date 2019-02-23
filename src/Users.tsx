import React, { useState } from 'react';
import { useAbortablePromise } from './usePromise';
import JsonPrettyPrinter from './JsonPrettyPrinter';
import Button from './Button';
import { HttpError, TimeoutError } from './errors';
import { timeout, abortable, delay } from './promise';

async function fetchUserById(
  id: number,
  options: RequestInit = {}
): Promise<{ id: number; name: string }> {
  const response = await Promise.race([
    timeout(6000),
    fetch(`/api/users/${id}`, options)
  ]);

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
    async signal => {
      try {
        return await Promise.all([
          fetchUserById(offset + 1, { signal }),
          fetchUserById(offset + 2, { signal }),
          fetchUserById(offset + 3, { signal }),
          abortable(delay(1000).then(() => 'foo'), signal!)
        ]);
      } catch (error) {
        if (error instanceof TimeoutError) {
          abort();
        }

        throw error;
      }
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
