function registerForLongClickEvent(elt, duration) {
    'use strict'
  
  if (!elt.onlongclick) elt.onlongclick = function(e) {};

  duration = (!duration) ? 750 : duration;
  var start = 0,
    end = 0,
    diff = 0;
  var id = null;

  function handler(e) {
    if (e.type == 'pointerdown') {
      start = Date.now()
      id = setInterval(() => {
        end = Date.now();
        if (start) diff = end - start;
        if (diff >= duration) {
          var e = new CustomEvent('longclick', {
            bubbles: true,
            cancelable: true,
            detail: {
              start: start,
              end: end,
              duration: diff
            }
          });
          elt.dispatchEvent(e);
          elt.onlongclick(e)
          if (id) clearInterval(id);
        }
      })
    }
    if (e.type != 'pointerdown') {
      start = 0
      end = 0
      diff = 0
      if (id) clearInterval(id);
    }
  }
  elt.addEventListener('pointerdown', handler);
  elt.addEventListener('touchmove', handler);
  elt.addEventListener('pointerup', handler);

}