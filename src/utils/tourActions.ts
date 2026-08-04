export const isElementPresent = (selector: string): boolean => {
  return Boolean(document.querySelector(selector));
};

export const clickOnElement = (selector: string) => {
  const element = document.querySelector(selector) as HTMLElement;
  if (element) {
    element.click();
  } else {
    console.warn(`Element ${selector} not found for clicking.`);
  }
};

export const waitForElement = async (selector: string, duration: number): Promise<boolean> => {
  const interval = 500;
  let elapsed = 0;

  return new Promise((resolve) => {
    const check = setInterval(() => {
      if (isElementPresent(selector)) {
        clearInterval(check);
        resolve(true);
      }
      elapsed += interval;
      if (elapsed >= duration) {
        clearInterval(check);
        resolve(false);
      }
    }, interval);
  });
};

/**
 * Performs an action based on the presence of a target element.
 *
 * Workflow:
 * 1. Checks if the target element is present.
 * 2. If present → Executes the main action immediately.
 * 3. If absent → Waits, clicks a fallback element, waits again, and retries.
 * 4. If still absent → Executes an alternative action (if provided) or retries the main action.
 *
 * @param targetSelector - CSS selector for the element to check for presence.
 * @param fallbackClickSelector - CSS selector for the element to click if the target is absent.
 * @param onSuccessAction - Action to perform when the target element is found.
 * @param onFailureAction - Alternative action if the target never appears (optional).
 * @param preClickWait - Wait time (ms) before clicking the fallback element. Default is 100ms.
 * @param postClickWait - Wait time (ms) after clicking the fallback element. Default is 100ms.
 */
export const conditionalTourAction = async (
  targetSelector: string,
  fallbackClickSelector: string,
  onSuccessAction: VoidFunction,
  onFailureAction?: VoidFunction,
  preClickWait = 100,
  postClickWait = 100,
): Promise<void> => {
  const isVisible = () => isElementPresent(targetSelector);

  // Step 1: Check if the target element is already present
  if (isVisible()) {
    onSuccessAction();
    return;
  }

  // Step 2: Wait before attempting a fallback click
  const preClickCheck = await waitForElement(targetSelector, preClickWait);
  if (preClickCheck) {
    onSuccessAction();
    return;
  }

  // Step 3: Click on the fallback element if still not present
  clickOnElement(fallbackClickSelector);

  // Step 4: Wait after clicking the fallback element
  const postClickCheck = await waitForElement(targetSelector, postClickWait);
  if (postClickCheck) {
    onSuccessAction();
  } else {
    // Step 5: If still absent, perform the alternative action if provided
    onFailureAction ? onFailureAction() : onSuccessAction();
  }
};
