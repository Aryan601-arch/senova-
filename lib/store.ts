import { useSyncExternalStore } from "react";

/**
 * A tiny external store. Used for state that must be shared between the DOM tree
 * and the single WebGL canvas (theme, pointer, active service…) without causing
 * React re-renders on every frame. 3D components read `.get()` inside useFrame.
 */
export function createStore<T>(initial: T) {
  let state = initial;
  const listeners = new Set<() => void>();

  const get = () => state;
  const set = (next: T | ((prev: T) => T)) => {
    const value = typeof next === "function" ? (next as (prev: T) => T)(state) : next;
    if (Object.is(value, state)) return;
    state = value;
    listeners.forEach((l) => l());
  };
  const subscribe = (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  function useStore(): T;
  function useStore<S>(selector: (s: T) => S): S;
  function useStore<S>(selector?: (s: T) => S) {
    const select = selector ?? ((s: T) => s as unknown as S);
    return useSyncExternalStore(
      subscribe,
      () => select(state),
      () => select(initial),
    );
  }

  return { get, set, subscribe, use: useStore };
}
