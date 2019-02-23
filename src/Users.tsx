import React, { useMemo, useState } from 'react';
import usePromise from './usePromise';
import JsonPrettyPrinter from './JsonPrettyPrinter';
import createAbortController from './createAbortController';
import Button from './Button';

function fetchUserById(id: number, options: RequestInit = {}) {
  return fetch(`/api/users/${id}`, options).then(response => response.json());
}

function Users() {
  const [offset, setOffset] = useState(0);
  const controller = useMemo(createAbortController, [offset]);

  const { data, loading, error } = usePromise(
    () =>
      Promise.all([
        fetchUserById(offset + 1, { signal: controller.signal }),
        fetchUserById(offset + 2, { signal: controller.signal }),
        fetchUserById(offset + 3, { signal: controller.signal })
      ]),
    [offset],
    controller.signal,
    () => controller.abort()
  );

  return (
    <>
      <Button onClick={() => controller.abort()}>Abort</Button>
      <Button onClick={() => setOffset(offset => offset + 1)}>
        Increase Offset ({offset})
      </Button>
      <JsonPrettyPrinter value={{ data, loading, error }} />
      {error && <p style={{ color: 'red' }}>{error.message}</p>}
    </>
  );
}

export default Users;
