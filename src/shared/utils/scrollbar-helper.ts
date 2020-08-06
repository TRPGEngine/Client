/**
 * 滚动滚到具体某个位置
 * @example scrollTo(document.body, 0, 1250);
 */
export function scrollTo(
  element: HTMLElement,
  to: number,
  duration: number,
  isAnimatied = true
) {
  if (!isAnimatied) {
    element.scrollTop = to;
    return;
  }

  const start = element.scrollTop;
  const change = to - start;
  let currentTime = 0;
  const increment = 20;

  const animateScroll = function() {
    currentTime += increment;
    const val = easeInOutQuad(currentTime, start, change, duration);
    element.scrollTop = val;
    if (currentTime < duration) {
      setTimeout(animateScroll, increment);
    }
  };
  animateScroll();
}

/**
 * 滚动到底部
 */
export function scrollToBottom(
  element: HTMLElement,
  duration: number,
  isAnimatied = true
) {
  if (!element) {
    return;
  }

  const to = element.scrollHeight - element.clientHeight;
  scrollTo(element, to, duration, isAnimatied);
}

/**
 * 平滑进出
 * @param t current time
 * @param b start value
 * @param c change in value
 * @param d duration
 */
function easeInOutQuad(t: number, b: number, c: number, d: number): number {
  t /= d / 2;
  if (t < 1) return (c / 2) * t * t + b;
  t--;
  return (-c / 2) * (t * (t - 2) - 1) + b;
}
