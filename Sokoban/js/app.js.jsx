function listener(elt, e, fun) {
  elt.addEventListener(e, fun, false)
};

function Path(src) {
  return 'assets/images/src/' + src + '.png';
};

function getPosition(element) {
  var top = 0,
    left = 0;

  do {
    top += element.offsetTop;
    left += element.offsetLeft;
  } while (element = element.offsetParent);

  return { x: left, y: top };
}



function getMousePosition(event) {
  return {
    x: event.pageX,
    y: event.pageY
  };
}




