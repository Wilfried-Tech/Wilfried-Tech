function registerForSwipeEvent(elt) {
  'use strict'

  var ismousedown = false, startX, startY, endX, endY, diffX, diffY, dir, distance, fingers;

  if (!elt.onswipe) elt.onswipe = function (e) { };

  function Calculated() {
    //console.log(startX, startY, endX, endY);
    if (!startX || !startY || !endX || !endY) {
      return [undefined, 0];
    } else {
      diffX = endX - startX;
      diffY = endY - startY;

      if (diffX == 0 && diffY == 0) return [undefined, 0]

      if (Math.abs(diffX) > Math.abs(diffY)) {
        dir = (diffX > 0) ? "right" : "left";
        distance = Math.abs(diffX);
      } else {
        dir = (diffY > 0) ? "down" : "up";
        distance = Math.abs(diffY);
      }
      return [dir, distance];
    }
  }

  function unify(e) {
    return [e.changedTouches ? e.changedTouches[0] : e, (e.touches && e.touches.length > 1) ? e.touches.length : 1];
  }

  function dispatchEvent(phase) {
    var e = new CustomEvent('swipe', {
      cancelable: false,
      bubbles: true,
      detail: {}
    });
    e.detail.phase = phase;
    e.detail.fingers = fingers;
    var cal = Calculated();
    e.detail.direction = cal[0];
    e.detail.distance = cal[1];

    elt.dispatchEvent(e);
    elt.onswipe(e);
    if (phase == 'end') startX = startY = endX = endY = diffY = diffX = dir = null;
  }

  function lock(e) {
    ismousedown = true;
    [e, fingers] = unify(e);
    startX = e.clientX;
    startY = e.clientY;
    dispatchEvent('start');
  }

  function move(e) {
    if (ismousedown) {
      [e, fingers] = unify(e);
      endX = e.clientX;
      endY = e.clientY;
      dispatchEvent('move');
    }
  }

  function unlock(e) {
    ismousedown = false;
    [e, fingers] = unify(e);
    endX = e.clientX;
    endY = e.clientY;
    dispatchEvent('end');
  }


  elt.addEventListener('touchstart', lock, false);
  //elt.addEventListener('mousedown', lock, false);
  elt.addEventListener('touchmove', move, false);
  //elt.addEventListener('mousemove', move, false);
  elt.addEventListener('touchend', unlock, false);
  //elt.addEventListener('mouseup', unlock, false);
};
