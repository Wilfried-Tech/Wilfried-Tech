/**
 * do an effet of rain
 * @param {HTMLCanvasElement} canvas
 */
function matrixRain(canvas) {
  var style = getComputedStyle(document.documentElement);
  var color1 = style.getPropertyValue('--theme-1');
  var color2 = style.getPropertyValue('--theme-2');
  var width, height, ctx, rain, matrix;
  width = canvas.offsetWidth;
  height = canvas.offsetHeight;
  ctx = canvas.getContext('2d');
  matrix = '101010110110101010001101011010110100101'.split('');
  rain = [];
  
  for (var i = 0; i < width / 2; i++) {
    rain.push(1);
  }
  function raining() {
    ctx.fillStyle = color2+'20';
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = color1;
    ctx.font = '10px arial';
    for (var j = 0; j < rain.length; j++) {
      var txt = matrix[Math.floor(Math.random() * matrix.length)];
      ctx.fillText(txt, j * 10, rain[j] * 10);
      if (rain[j] * 10 > height && Math.random() > 0.975)
        rain[j] = 0;
      rain[j]++;
    }
  }
  setInterval(raining, 20);
}
matrixRain($('#matrix'))

