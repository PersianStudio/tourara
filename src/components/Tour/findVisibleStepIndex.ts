/**
 * Pure helpers that walk the step list while skipping steps whose
 * selectors are missing from the DOM (same rules as the legacy Tour handlers).
 */

export type StepWithSelector = { selector: string };

/** True when the step's selector matches at least one element in the document. */
export function checkTargetVisibility(
  steps: StepWithSelector[],
  stepIndex: number,
): boolean {
  return !!window.document.querySelector(steps?.[stepIndex]?.selector);
}

/**
 * First index after `currentStepIndex` whose selector is present, or `undefined`
 * if none remain (mirrors recursive `handleNextClick`).
 */
export function findNextVisibleStepIndex(
  steps: StepWithSelector[],
  currentStepIndex: number,
): number | undefined {
  let nextCounter = currentStepIndex + 1;

  const walk = (): number | undefined => {
    const isPresent = checkTargetVisibility(steps, nextCounter);
    if (nextCounter < steps.length && !isPresent) {
      nextCounter = nextCounter + 1;
      return walk();
    }
    if (nextCounter < steps.length) {
      return nextCounter;
    }
    return undefined;
  };

  return walk();
}

/**
 * First index before `currentStepIndex` whose selector is present, or `undefined`
 * if none remain (mirrors recursive `handlePrevClick`).
 */
export function findPrevVisibleStepIndex(
  steps: StepWithSelector[],
  currentStepIndex: number,
): number | undefined {
  let prevCounter = currentStepIndex - 1;

  const walk = (): number | undefined => {
    const isPresent = checkTargetVisibility(steps, prevCounter);
    if (prevCounter >= 0 && !isPresent) {
      prevCounter = prevCounter - 1;
      return walk();
    }
    if (prevCounter >= 0) {
      return prevCounter;
    }
    return undefined;
  };

  return walk();
}

/**
 * Skip target index: advances past the next step (and past missing selectors),
 * matching the legacy dual-counter `handleSkipClick` recursion.
 * Returns the last index that would have been passed to `goToStep`.
 */
export function findSkipStepIndex(
  steps: StepWithSelector[],
  currentStepIndex: number,
): number | undefined {
  let skipCounter = currentStepIndex + 1;
  let skipExtraCounter = skipCounter + 1;
  let result: number | undefined;

  const walk = () => {
    const isPresent = checkTargetVisibility(steps, skipCounter);
    if (skipCounter < steps.length && !isPresent) {
      skipCounter = skipCounter + 1;
      walk();
    }

    if (skipExtraCounter < steps.length && !isPresent) {
      skipExtraCounter = skipExtraCounter + 1;
      walk();
    }

    if (skipExtraCounter < steps.length) {
      result = skipExtraCounter;
    }
  };

  walk();
  return result;
}
