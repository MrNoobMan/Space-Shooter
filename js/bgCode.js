// The keycodes that will be mapped when a user presses a button.
// Original code by Doug McInnes
KEY_CODES = {
  32: 'space',
  65: 'left',
  87: 'up',
  68: 'right',
  83: 'down'
};
// Creates the array to hold the KEY_CODES and sets all their values
// to false. Checking true/flase is the quickest way to check status
// of a key press and which one was pressed when determining
// when to move and which direction.
KEY_STATUS = {};
for (code in KEY_CODES) {
  KEY_STATUS[ KEY_CODES[ code ]] = false;
};
/**
 * Sets up the document to listen to onkeydown events (fired when
 * any key on the keyboard is pressed down). When a key is pressed,
 * it sets the appropriate direction to true to let us know which
 * key it was.
 */
document.onkeydown = function(e) {
  // Firefox and opera use charCode instead of keyCode to
  // return which key was pressed.
  var keyCode = (e.keyCode) ? e.keyCode : e.charCode;
  if (KEY_CODES[keyCode]) {
    e.preventDefault();
    KEY_STATUS[KEY_CODES[keyCode]] = true;
  }
};
/**
 * Sets up the document to listen to ownkeyup events (fired when
 * any key on the keyboard is released). When a key is released,
 * it sets teh appropriate direction to false to let us know which
 * key it was.
 */
document.onkeyup = function(e) {
  var keyCode = (e.keyCode) ? e.keyCode : e.charCode;
  if (KEY_CODES[keyCode]) {
    e.preventDefault();
    KEY_STATUS[KEY_CODES[keyCode]] = false;
  }
};

(function() {
	// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
	// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
	// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
	// MIT license

    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

var fps,
	avarageFps = 0,
	sumFps = 0,
	last10 = [];

function fpsMeter(dt) { //stjålet fra stackoverflow

	var Delta = dt
	
	fps = 1/Delta;
	last10.push(fps);
	
	Context.fillStyle = "#000"; 
	Context.font="bold 20px Arial Black, Gadget, sans-serif";
	
	if(last10.length >= 10){
		for(var i = 0; i < last10.length; i++){
			sumFps += last10[i];
			avarageFps = Math.round(sumFps/last10.length);
		}
		last10.splice(0, last10.length);
		sumFps = 0;
	}
	
	Context.strokeStyle = "#fff";
	Context.font="bold 20.5px Arial Black, Gadget, sans-serif";
	Context.strokeText( Math.round(avarageFps)+" fps", 5, 20);
	Context.fillText( Math.round(avarageFps)+" fps", 5, 20);
};

document.addEventListener("keypress", function(event) {
    if (event.keyCode === 80 && event.shiftKey) {
        showHitBox = !showHitBox;
    }else if(event.keyCode === 79 && event.shiftKey) {
        showFps = !showFps;
    }else if(event.keyCode === 49 && !game.startState && !game.gameOverState){
		game.fireMode = 1;
		game.player.fireRate = 100;
	}else if(event.keyCode === 50 && !game.startState && !game.gameOverState){
		game.fireMode = 2;
		game.player.fireRate = 250;
	}else if(event.keyCode === 51 && !game.startState && !game.gameOverState){
		game.fireMode = 3;
		game.player.fireRate = 40;
	}
})

function getMousePos(Canvas, event){
    var rect = Canvas.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };
}

function isInside(pos, rect){
    return pos.x > rect[0] && pos.x < rect[0]+rect[2] && pos.y < rect[1]+rect[3] && pos.y > rect[1]
}

function startScreenBurronHover(rect){
	Canvas.addEventListener('mousemove', game.getHoverStart, false);
	Canvas.addEventListener('click', game.getClickStart, false);
}

function gameOverButtonHover(rect){
	Canvas.addEventListener('mousemove', game.getHover, false);
	Canvas.addEventListener('click', game.getClick, false);
}