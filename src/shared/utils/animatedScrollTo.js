// scrollTo(document.body, 0, 1250);
function scrollTo(element, to, duration, isAnimatied = true) {
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
    var val = Math.easeInOutQuad(currentTime, start, change, duration);
    element.scrollTop = val;
    if (currentTime < duration) {
      setTimeout(animateScroll, increment);
    }
  };
  animateScroll();
}

function scrollToBottom(element, duration, isAnimatied = true) {
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
Math.easeInOutQuad = function(t, b, c, d) {
  t /= d / 2;
  if (t < 1) return (c / 2) * t * t + b;
  t--;
  return (-c / 2) * (t * (t - 2) - 1) + b;
};

export const to = scrollTo;
export const bottom = scrollToBottom;
