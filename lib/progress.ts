"use client";

import { useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "tricks-visualizer:learned";
const listeners = new Set<() => void>();
let cache: string | null = null;

function read(): string {
  try {
    cache = localStorage.getItem(STORAGE_KEY) ?? "[]";
  } catch {
    cache ??= "[]";
  }
  return cache;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => e.key === STORAGE_KEY && listener();
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

/** Learned trick keys (see `progressKey`), persisted in localStorage. */
export function useProgress() {
  const raw = useSyncExternalStore(subscribe, read, () => "[]");
  const learned = new Set<string>(JSON.parse(raw) as string[]);

  const setLearned = useCallback((key: string, value: boolean) => {
    const next = new Set<string>(JSON.parse(read()) as string[]);
    if (value) next.add(key);
    else next.delete(key);
    cache = JSON.stringify([...next]);
    try {
      localStorage.setItem(STORAGE_KEY, cache);
    } catch {
      // Storage unavailable (private mode etc.) — keep the in-memory value for this visit.
    }
    listeners.forEach((l) => l());
  }, []);

  return { learned, setLearned };
}
