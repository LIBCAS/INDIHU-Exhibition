let b = d.getElementsByTagName('body')[0];

function scrollAnimate(elem, style, from, to, time, prop) {
  if (!elem) {
    return;
  }
  var start = new Date().getTime(),
      timer = setInterval(function () {
        var step = Math.min(1, (new Date().getTime() - start) / time);
        if (prop) {
          elem[style] = (from + step * (to - from));
        } else {
          elem.style[style] = (from + step * (to - from));
        }
        if (step === 1 || step < -1) {
          clearInterval(timer);
        }
      }, 25);
  if (prop) {
    elem[style] = from;
  } else {
    elem.style[style] = from;
  }
}


d.addEventListener('click', function (e) {
  if(e.target.localName === 'a' && e.target.getAttribute('href').indexOf('#') !== -1 ){
    e.preventDefault();
    var target = document.getElementById( e.target.getAttribute('href').replace('#', '') ),
        speed = 700;
    scrollAnimate( document.scrollingElement || document.documentElement, "scrollTop", w.scrollY, target.offsetTop, speed, true);
  }
});
