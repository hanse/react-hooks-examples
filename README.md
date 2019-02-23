# react-hooks-examples

Playground for React Hooks.

## `useAbortablePromise`

Manage Promise state and allow aborting promises using `AbortController`. `abort` will automatically be called in the `useEffect` cleanup function, but is also provided to the caller. Built on top of `usePromise`.

```js
function App() {
  const [{ data, loading, error }, abort] = useAbortablePromise(
    signal =>
      Promise.all([
        fetch('/1', { signal }),
        fetch('/2', { signal }),
        fetch('/3', { signal })
      ]),
    []
  );

  return (
    <>
      <button onClick={() => abort()}>Abort</button>
      <div>{JSON.stringify({ data, loading, error }, null, 2)}</div>
    </>
  );
}
```
