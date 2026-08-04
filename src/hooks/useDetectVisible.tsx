/**
 * Reports when step targets enter / leave the viewport using IntersectionObserver.
 *
 * Replaces the old document-wide MutationObserver (attributes + subtree) which
 * fired constantly and caused React setState storms during tours.
 */

import { useEffect, useRef } from 'react';

interface UseDetectVisibilityOptions {
  selectors: string[];
  root: Element | undefined;
  onVisible: (selector: string) => void;
  onHidden: (selector: string) => void;
  /** When false, observers are disconnected (e.g. tour closed). */
  enabled?: boolean;
}

function resolveElement(selector: string, root?: Element): Element | null {
  if (root) {
    const scoped = root.querySelector(selector);
    if (scoped) return scoped;
  }
  return document.querySelector(selector);
}

export const useDetectVisibility = ({
  selectors,
  onVisible,
  onHidden,
  root,
  enabled = true,
}: UseDetectVisibilityOptions) => {
  const onVisibleRef = useRef(onVisible);
  const onHiddenRef = useRef(onHidden);
  onVisibleRef.current = onVisible;
  onHiddenRef.current = onHidden;

  const selectorsKey = selectors.join('\0');

  useEffect(() => {
    if (!enabled || !selectors.length) return;

    const state = new Map<string, boolean>();
    const observers: IntersectionObserver[] = [];

    const observe = (selector: string, el: Element) => {
      const io = new IntersectionObserver(
        ([entry]) => {
          const now = Boolean(entry?.isIntersecting);
          const prev = state.get(selector);
          if (prev === now) return;
          state.set(selector, now);
          if (now) onVisibleRef.current(selector);
          else onHiddenRef.current(selector);
        },
        { root: null, threshold: 0.01, rootMargin: '0px' },
      );
      io.observe(el);
      observers.push(io);
    };

    for (const selector of selectors) {
      const el = resolveElement(selector, root);
      if (el) observe(selector, el);
    }

    // Lightweight attach for late-mounted targets — debounced, not per-mutation work.
    let debounceId = 0;
    const mo = new MutationObserver(() => {
      window.clearTimeout(debounceId);
      debounceId = window.setTimeout(() => {
        for (const selector of selectors) {
          if (state.has(selector)) continue;
          const el = resolveElement(selector, root);
          if (el) {
            state.set(selector, false);
            observe(selector, el);
          }
        }
      }, 250);
    });

    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.clearTimeout(debounceId);
      mo.disconnect();
      observers.forEach((o) => o.disconnect());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectorsKey, root, enabled]);
};
