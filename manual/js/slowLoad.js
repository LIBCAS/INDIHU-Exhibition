function setAttributes(el, attrs) {
  for(let key in attrs) {
	el.setAttribute(key, attrs[key]);
  }
}

function offset(el) {
	let rect = el.getBoundingClientRect(),
	scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
	scrollTop = window.pageYOffset || document.documentElement.scrollTop;
	return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
}

// example use
// let div = document.querySelector('div');
// let divOffset = offset(div);
// console.log(divOffset.left, divOffset.top);


n = 0;
let scrollObject = {};
// window.onscroll = getScrollPosition;
let videos = document.getElementsByTagName('video');
function getScrollPosition(){

	test = document.getElementById('1').parentNode;
	scrollObject = {
	   x: window.pageXOffset,
	   y: window.pageYOffset
	}
	// If you want to check distance
	if(scrollObject.y) {
		console.log(scrollObject.y);
		console.log(offset(test));
	} else {
		return false;
	}
}

// Get media - with autoplay disabled (audio or video)


// window width and height = viewport values

let w=window,
	d=document,
	e=d.documentElement,
	g=d.getElementsByTagName('body')[0],
	viewportWidth=w.innerWidth||e.clientWidth||g.clientWidth,
	viewportHeight=w.innerHeight||e.clientHeight||g.clientHeight;


// scrollable content height = full document height

let body = document.body,
    html = document.documentElement;

let documentHeight = Math.max( body.scrollHeight, body.offsetHeight, 
 					html.clientHeight, html.scrollHeight, html.offsetHeight );


let media = document.querySelectorAll('video');
let tolerancePixel = 40;

function checkMedia(){
	let scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
	    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
	// Get current browser top and bottom

	media.forEach(function(el,i,arr) {
		let yTopMedia 	 = arr[i].getBoundingClientRect().top;
		let yBottomMedia = yTopMedia + arr[i].getBoundingClientRect().height;

		if(yTopMedia + tolerancePixel >=0 && yBottomMedia - tolerancePixel  <= viewportHeight){ //view explaination in `In brief` section above
			arr[i].play();
		} else {
			arr[i].pause();
		}
	});

	//}
}
// $(document).on('scroll', checkMedia);
document.addEventListener('scroll', checkMedia );