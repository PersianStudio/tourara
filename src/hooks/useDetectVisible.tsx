import { useEffect, useRef } from 'react';
import { isElementInView as utilIsElementInView } from '../utils/viewport';

const isElementInView = utilIsElementInView as any;

interface UseDetectVisibilityOptions {
  selectors: string[];
  root: Element | undefined;
  onVisible: (selector: string) => void;
  onHidden: (selector: string) => void;
}

export const useDetectVisibility = ({ selectors, onVisible, onHidden, root }: UseDetectVisibilityOptions) => {
  const visibleElements = useRef<Set<string>>(new Set());

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const elements = selectors?.length ? Array.from(document?.querySelectorAll(selectors?.join(','))) : [];

      elements.forEach((element) => {
        const selector = selectors.find((sel) => element.matches(sel));
        if (!selector) return;

        const isInViewport = isElementInView(root, element as HTMLElement);
        const isVisible = isElementVisible(element);

        if (isInViewport && isVisible && !visibleElements.current.has(selector)) {
          // visibleElements.current.add(selector);
          onVisible(selector);
        } else {
          onHidden(selector);
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
    });

    return () => observer.disconnect();
  }, [selectors]);

  const isElementVisible = (element: Element): boolean => {
    const rect = element.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0 && window.getComputedStyle(element).visibility !== 'hidden';
  };
};
