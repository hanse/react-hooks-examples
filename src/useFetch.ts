import { useState, useEffect } from 'react';
import { delay } from './promise';

function useFetch(url: string, opts: RequestInit = {}) {
  const [data, setData] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const response = await fetch(url, opts);
      await delay(100);
      const text = await response.text();
      if (!cancelled) {
        setData(text);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [url, opts]);

  return { data };
}

export default useFetch;
