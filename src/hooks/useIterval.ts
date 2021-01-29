import { useRef, useEffect } from "react";

export default function useInterval(callback: () => any, delay: number | null) {
  const savedCallback = useRef<any>();

  // Remember the latest function.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = window.setInterval(tick, delay);
      return () => window.clearInterval(id);
    }
  }, [delay]);
}
