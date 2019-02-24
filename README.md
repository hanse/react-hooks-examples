# react-hooks-examples

Playground for React Hooks.

## `useAbortablePromise`

Manage Promise state and allow aborting promises using `AbortController`. `abort` will automatically be called in the `useEffect` cleanup function, but is also provided to the caller to be able to abort in the event of e.g a custom timeout mechanism error since the [Fetch API]() does not support it natively.

```js
function App() {
  const [offset, setOffset] = useState(0);

  const [{ data, loading, error }, abort] = useAbortablePromise(
    async signal => {
      try {
        return await Promise.all([
          fetchUserById(offset + 1, { signal }),
          fetchUserById(offset + 2, { signal }),
          fetchUserById(offset + 3, { signal })
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
```
