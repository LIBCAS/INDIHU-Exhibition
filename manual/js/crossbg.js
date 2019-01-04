let angle,length,trgtW,trgtH;
let winW = window.innerWidth;
let winH = window.innerHeight;
const atan = (y,x) => Math.atan2(y,x);
const tan = (arg) => Math.tan(arg);
// Converts from degrees to radians.
Math.radians = function(degrees) {
  return degrees * Math.PI / 180;
};
// Converts from radians to degrees.
Math.degrees = function(radians) {
  return radians * 180 / Math.PI;
};
const width  = (trg) => {return trg.offsetWidth}; 
const height = (trg) => {return trg.offsetHeight};

let target = document.querySelector('.--fullscreen');
// let	trgtW = width(target) -42;
// let	trgtH = height(target)-42;
let lDiagonal = document.createElement('div');
let rDiagonal = document.createElement('div');
	lDiagonal.classList.add('fullscreen__diagonal','diagonal--left');
	rDiagonal.classList.add('fullscreen__diagonal','diagonal--right');
let styleDiagonal = `<style>
.fullscreen__diagonal{
	position: absolute;
	display: block;
	height:2px;
	background: #00f;
	transform-origin 0% 0%;
	left:50%;
	top:50%;
}

</style>`;	
	target.appendChild(lDiagonal);
	target.appendChild(rDiagonal);
	target.innerHTML += '\n' + (styleDiagonal);
let left  = document.querySelector('.diagonal--left');
let right = document.querySelector('.diagonal--right');

window.addEventListener('load',() =>{
		trgtW = width(target) -80;
		trgtH = height(target)-80;

		length = Math.sqrt( (trgtW*trgtW) + (trgtH*trgtH) );
		angle = Math.degrees(atan(trgtH , trgtW));

		left.style.width = ` ${length}px`;
		left.style.transform = `translate(-50%,-50%) rotate(${Math.floor(angle*100)/100}deg)`;
		right.style.width = `${length}px`;
		right.style.transform = `translate(-50%,-50%) rotate(${-Math.floor(angle*100)/100}deg)`;
}); 

window.addEventListener('resize',() =>{
		trgtW = width(target) -80;
		trgtH = height(target)-80;
	
		length = Math.sqrt( (trgtW*trgtW) + (trgtH*trgtH) );
		angle = Math.degrees(atan(trgtH , trgtW));
	
		left.style.width = ` ${length}px`;
		left.style.transform = `translate(-50%,-50%) rotate(${Math.floor(angle*100)/100}deg)`;
		right.style.width = `${length}px`;
		right.style.transform = `translate(-50%,-50%) rotate(${-Math.floor(angle*100)/100}deg)`;
}); 


// creates global css variable
		// document.documentElement.style.setProperty('--length', length);
		// document.documentElement.style.setProperty('--angle', angle);
