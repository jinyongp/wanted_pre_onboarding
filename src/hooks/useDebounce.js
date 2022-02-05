import { useState } from 'react';

export default function useDebounce(callbackFn, wait) {
  const [timeoutID, setTimeoutID] = useState(null);
  return (...args) => {
    if (timeoutID) clearTimeout(timeoutID);
    setTimeoutID(
      setTimeout(() => {
        setTimeoutID(null);
        callbackFn.apply(this, args);
      }, wait),
    );
  };
}
