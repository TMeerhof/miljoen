import { useRef } from 'react';
import { isEqual } from 'lodash';

export default function useDeepCompareMemoize<T>(value: T): T {
  const valueRef = useRef<T>(value);
  if (!isEqual(value, valueRef.current)) {
    valueRef.current = value;
  }
  return valueRef.current;
}
