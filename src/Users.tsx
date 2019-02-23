import React from 'react';
import usePromise from './usePromise';
import JsonPrettyPrinter from './JsonPrettyPrinter';
import { delay } from './promise';

function Users() {
  const { data } = usePromise(
    () =>
      Promise.all([
        Promise.resolve('foo'),
        Promise.resolve('bar'),
        Promise.race([
          delay(1000).then(() => 'baz'),
          delay(1000).then(() => Promise.reject(new Error()))
        ])
      ]),
    []
  );

  return <JsonPrettyPrinter value={data} />;
}

export default Users;
