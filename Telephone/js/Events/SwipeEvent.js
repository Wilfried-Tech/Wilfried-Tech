function registerForSwipeEvent(elt) {'use strict'
  
  var startX, startY, endX, endY, diffX, diffY, dir, distance;

  if (!elt.onswipe) elt.onswipe = function(e) {};

  elt.addEventListener('touchstart', function(e) {
    var touch = e.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;
  });

  function touchend() {
    diffX = endX - startX;
    diffY = endY - startY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
      dir = (diffX > 0) ? "left" : "right";
      distance = diffX;
    } else {
      dir = (diffY > 0) ? "down" : "up";
      distance = diffY;
    }
    var event = new CustomEvent('swipe', {
      bubbles: true,
      cancelable: true,
      detail: {
        distance: Math.abs(distance),
        dir: dir,
        endX: endX,
        endY: endY,
        startX: startX,
        startY: startY
      }
    });
    elt.dispatchEvent(event);
    elt.onswipe(event);

    startX = startY = endX = endY = diffY = diffX = dir = null;
    elt.removeEventListener('touchend', touchend);
  }

  elt.addEventListener('touchmove', function(e) {
    if (!startX || !startY) return;

    var touch = e.touches[0];
    endX = touch.clientX;
    endY = touch.clientY;

    elt.addEventListener('touchend', touchend);
  });
};