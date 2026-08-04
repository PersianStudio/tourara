/**
 * Coalesce work onto a single animation frame (scroll/resize/settle bursts).
 */
export function createFrameScheduler(run: () => void) {
  let frame = 0;

  const schedule = () => {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      run();
    });
  };

  const cancel = () => {
    if (!frame) return;
    cancelAnimationFrame(frame);
    frame = 0;
  };

  return { schedule, cancel };
}
