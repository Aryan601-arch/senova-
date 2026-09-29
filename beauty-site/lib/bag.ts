"use client";

import { useSyncExternalStore } from "react";

/**
 * The shopping bag. Kept in localStorage so it survives page reloads.
 * Orders are sent to the shop by WhatsApp or email from the bag drawer.
 */
export type BagLine = { slug: string; qty: number };

const KEY = "senova-bag";
const EMPTY: BagLine[] = [];
let lines: BagLine[] = EMPTY;
let loaded = false;
let open = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    if (Array.isArray(parsed)) lines = parsed.filter((l) => typeof l?.slug === "string" && l.qty > 0);
  } catch {
    /* storage unavailable or corrupt: start with an empty bag */
  }
}

function emit() {
  try {
    localStorage.setItem(KEY, JSON.stringify(lines));
  } catch {
    /* private mode: the bag still works for this visit */
  }
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export const bag = {
  add(slug: string, qty = 1) {
    load();
    const found = lines.find((l) => l.slug === slug);
    lines = found
      ? lines.map((l) => (l.slug === slug ? { ...l, qty: l.qty + qty } : l))
      : [...lines, { slug, qty }];
    open = true;
    emit();
  },
  setQty(slug: string, qty: number) {
    load();
    lines = qty <= 0 ? lines.filter((l) => l.slug !== slug) : lines.map((l) => (l.slug === slug ? { ...l, qty } : l));
    emit();
  },
  clear() {
    lines = EMPTY;
    emit();
  },
  setOpen(value: boolean) {
    open = value;
    listeners.forEach((l) => l());
  },
};

export function useBag() {
  return useSyncExternalStore(
    subscribe,
    () => {
      load();
      return lines;
    },
    () => EMPTY,
  );
}

export function useBagOpen() {
  return useSyncExternalStore(
    subscribe,
    () => open,
    () => false,
  );
}
