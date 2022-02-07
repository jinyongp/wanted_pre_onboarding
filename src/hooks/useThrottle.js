import { useState } from 'react';

export default function useThrottle(callbackFn, wait) {
  const [trigger, setTrigger] = useState(true);
  return (...args) => {
    if (trigger) {
      setTrigger(false);
      setTimeout(() => {
        setTrigger(true);
        callbackFn.apply(this, args);
      }, wait);
    }
  };
}
