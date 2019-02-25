import React from 'react';

function JsonPrettyPrinter(value: any) {
  return <pre>{JSON.stringify(value, null, 2)}</pre>;
}

export default JsonPrettyPrinter;
