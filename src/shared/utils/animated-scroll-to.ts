// scrollTo(document.body, 0, 1250);
export function scrollTo(element, to, duration, isAnimatied = true) {
  if (!isAnimatied) {
    element.scrollTop = to;
    return;
  }

  var start = element.scrollTop,
    change = to - start,
    currentTime = 0,
    increment = 20;

  var animateScroll = function() {
    currentTime += increment;
    var val = easeInOutQuad(currentTime, start, change, duration);
    element.scrollTop = val;
    if (currentTime < duration) {
      setTimeout(animateScroll, increment);
    }
  };
  animateScroll();
}

export function scrollToBottom(
  element: HTMLElement,
  duration: number,
  isAnimatied = true
) {
  if (!element) {
    return;
  }

  var to = element.scrollHeight - element.clientHeight;
  scrollTo(element, to, duration, isAnimatied);
}

//t = current time
//b = start value
//c = change in value
//d = duration
function easeInOutQuad(t, b, c, d) {
  t /= d / 2;
  if (t < 1) return (c / 2) * t * t + b;
  t--;
  return (-c / 2) * (t * (t - 2) - 1) + b;
}

export default {
  to: scrollTo,
  bottom: scrollToBottom,
};
