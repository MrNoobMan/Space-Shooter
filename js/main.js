//© NILS best code EU. 

var lastTimeCalled,
	Canvas = document.getElementById("gameCanvas"),
	Context = Canvas.getContext("2d"),
	showHitBox = false,
	showFps = false,
	totEnemies = 0,
	nxtTimer = 0,
	numLoaded = 0;

const numImages = imageRepo.imgSources.length,
	startPosX = Canvas.width/2-60
	startPosY = Canvas.height/3;
	
function main(){
	var now = Date.now(),
		Delta = (now - lastTimeCalled)/1000;
	if(isNaN(Delta)){
		Delta = 1/60;
	}
	if(Delta > 1){
		Delta = 1/60;
	}
	lastTimeCalled = now;
	
	getItAll();
	
	detectCollision(Delta);

	for(var l = 0; l < game.level.enemyPool.length; l++){
		totEnemies += game.level.enemyPool[l].getPool().length;
	}

	var entities = [];
	game.quadTree.getAllobjects(entities);

	updateUnits(Delta, entities);
	
	Render(Delta, entities);
		
	if(game.player.alive){
		Controlls(Delta);
	}else if(!game.player.alive && !game.startState){
		game.gameOverState = true;
	}
	
	if(showFps){
		fpsMeter(Delta);
	}
	
	if(totEnemies < 1 && nxtTimer === 0 && !game.startState){
		nxtTimer = now;
	}

	if(now - nxtTimer > 3500 && nxtTimer !== 0){
		game.currentLevel++;
		nxtTimer = 0;
		game.level = new levelFunk(game.currentLevel);
	}
			
	totEnemies = 0;
	requestAnimationFrame(main);
}

function updateUnits(dt, entity){
	
	var Delta = dt,
		Entity = entity;
		
	for(var i = 0, leng = Entity.length; i < leng; i++){
		Entity[i].getHitBox();
		if(Entity[i].type[0] !== "player" && Entity[i].type[1] !== "explosion"){
			var movementOrDead = Entity[i].ai.animate(Delta, Entity[i].rot, Entity[i].pos, Entity[i].speed, Entity[i].size, Entity[i].objectCenter);
			if(!movementOrDead[2]){
				Entity[i].pos = movementOrDead[0];
				Entity[i].rot = movementOrDead[1];
			}else if(movementOrDead[2]){
				Entity[i].alive = false;
			}
		}
	}
	
}

function Render(dt, entity){ // i render: husk å fylle inn back grunn først, så tegn enheter. deretter translate med enhetens x y.
		
	var Delta = dt,
		Entity = entity;

	renderBg.draw(Delta);
	
	renderObjects(Delta, Entity);
	
	renderUi(Delta);
	
};

function renderUi(dt){
	
	var Delta = dt;
		
	Context.save();
	Context.shadowBlur = 40;
	Context.shadowColor = "#f57e00";
	Context.drawImage(imageRepo.imgs[2], 0, 89, 248, 25, 31, Canvas.height-42, 348, 25);
	Context.shadowBlur = 10;
	Context.drawImage(imageRepo.imgs[2], 0, 170, 200, 35, Canvas.width-220, 15, 200, 35);
	Context.restore();
	
	Context.save();
	Context.shadowBlur = 10;
	Context.shadowColor = "#fff"
	Context.drawImage(imageRepo.imgs[2], 0, 52, 348*game.player.healthPartition, 25, 31, Canvas.height-42, 348*game.player.healthPartition, 25);
	Context.drawImage(imageRepo.imgs[2], 0, 299, 348*game.player.shieldPartition, 25, 31, Canvas.height-42, 348*game.player.shieldPartition, 25);
	Context.restore();
	
	Context.drawImage(imageRepo.imgs[2], 0, 0, 360, 40, 25, Canvas.height-50, 360, 40);
	
	Context.font = "18px Lucida Console";
	Context.strokeStyle = "#5c0005";
	Context.fillStyle = "#05ffe6";

	Context.save();
	if(game.fireMode === 1){
		Context.shadowBlur = 25;
		Context.shadowColor = "#05ffe6";
	}
	Context.drawImage(imageRepo.imgs[2], 390, 0, 18, 40, 50, Canvas.height-100, 18, 40);
	Context.restore();
	
	Context.save();
	if(game.fireMode === 2){
		Context.shadowBlur = 20;
		Context.shadowColor = "#05ffe6";
	}
	Context.drawImage(imageRepo.imgs[2], 423, 0, 18, 40, 100, Canvas.height-100, 18, 40);
	Context.restore();
	
	Context.save();
	if(game.fireMode === 3){
		Context.shadowBlur = 20;
		Context.shadowColor = "#05ffe6";
	}
	Context.drawImage(imageRepo.imgs[2], 457, 0, 13, 40, 150, Canvas.height-100, 13, 40);
	Context.restore();
	
	Context.save();
	Context.shadowBlur = 20;
	Context.shadowColor = "#05ffe6";
	Context.fillText("SCORE:", Canvas.width-210, 38);
	Context.textAlign = "end";
	Context.fillText(game.currentScore, Canvas.width-30, 38);
	if(game.currentScore < game.scoreBank){
		game.currentScore += Math.ceil(Delta*2 * (game.scoreBank - game.currentScore));
	}
	
	if(game.player.shieldPartition === 1){
		Context.save();
		Context.shadowColor = "#0014f0";
		Context.fillStyle = "#0014f0";
		Context.fillText(Math.floor(game.player.shieldPartition*100)+"% Shields", 200, Canvas.height-23);
		Context.restore();
	}else if(game.player.shieldPartition >= .1){
		Context.save();
		Context.shadowColor = "#0014f0";
		Context.fillStyle = "#0014f0";
		var dec = Math.floor(game.player.shieldPartition*1000).toString()[2];
		Context.fillText(Math.floor(game.player.shieldPartition*100)+","+dec+"% Shields", 200, Canvas.height-23);
		Context.restore();
	}else if(game.player.shieldPartition < .1 && game.player.shieldPartition >= .01){
		Context.save();
		Context.shadowColor = "#0014f0";
		Context.fillStyle = "#0014f0";
		var dec = Math.floor(game.player.shieldPartition*1000).toString()[1];
		Context.fillText(Math.floor(game.player.shieldPartition*100)+","+dec+"% Shields", 200, Canvas.height-23);
		Context.restore();
	}else if(game.player.shieldPartition < .01 && game.player.shieldPartition > 0){
		Context.save();
		Context.shadowColor = "#0014f0";
		Context.fillStyle = "#0014f0";
		var dec = Math.floor(game.player.shieldPartition*1000);
		Context.fillText(Math.floor(game.player.shieldPartition*100)+","+dec+"% Shields", 200, Canvas.height-23);
		Context.restore();
	}else if(game.player.healthPartition === 1 && game.player.shieldPartition <= 0){
		Context.fillText(Math.floor(game.player.healthPartition*100)+"% HP", 140, Canvas.height-23);
	}else if(game.player.healthPartition >= .1 && game.player.shieldPartition <= 0){
		var dec = Math.floor(game.player.healthPartition*1000).toString()[2];
		Context.fillText(Math.floor(game.player.healthPartition*100)+","+dec+"% HP", 140, Canvas.height-23);
	}else if(game.player.healthPartition < .1 && game.player.healthPartition >= .01 && game.player.shieldPartition <= 0){
		var dec = Math.floor(game.player.healthPartition*1000).toString()[1];
		Context.fillText(Math.floor(game.player.healthPartition*100)+","+dec+"% HP", 140, Canvas.height-23);
	}else if(game.player.healthPartition < .01 && game.player.healthPartition > 0 && game.player.shieldPartition <= 0){
		var dec = Math.floor(game.player.healthPartition*1000);
		Context.fillText(Math.floor(game.player.healthPartition*100)+","+dec+"% HP", 140, Canvas.height-23);
	}
	Context.restore();
	
	if(game.startState){
		game.startScreen(Delta);
	}else if(game.gameOverState){
		game.gameOver(Delta);
	}
	
}

function renderObjects(dt, entity){
	
	var Delta = dt,
		Entity = entity;
	
	Entity.sort(function(a,b){
		var order = ["beam", "enemyShip", "bullet", "playerShip" , "enemyBullet", "explosion"];
		if(a.type[1] !== b.type[1]){
			return order.indexOf(a.type[1]) - order.indexOf(b.type[1]);
		}else{
			return;
		}
	});
	
	for(var i = 0, leng = Entity.length; i < leng; i++){
		
		Context.save();
			
			if(Entity[i].type[4] == "beamer" && (Entity[i].ai.isFireAngleSet || Entity[i].ai.isLiningUp)){				
				Context.beginPath();
				Context.strokeStyle = Entity[i].ai.laserColor;
				Context.moveTo(Entity[i].objectCenter[0], Entity[i].objectCenter[1]);
				Context.lineTo(Math.cos(Entity[i].rot-Math.PI/2)*1600 + Entity[i].objectCenter[0], Math.sin(Entity[i].rot-Math.PI/2)*1600 + Entity[i].objectCenter[1]);
				Context.lineWidth = Entity[i].ai.laserWidth;
				Context.stroke();
			}
			
			Context.translate(Entity[i].pos[0]+Entity[i].size[0]/2, Entity[i].pos[1]+Entity[i].size[1]/2);
			Context.rotate(Entity[i].rot);
			Context.translate(-Entity[i].size[0]/2, -Entity[i].size[1]/2);
						
			Entity[i].update(Delta);
			Entity[i].render(Context);	
		Context.restore();

			if(Entity[i].type[3]){
				Entity[i].drawHpBar();
			}
			if(showHitBox && typeof Entity[i].corners[0] !== "undefined"){
				Entity[i].drawHitBox();	//tegn hitbox;
			}
	}
};

var renderBg = new function(){
	
	this.bgPos = [0,0];
	this.bgStarPos = [0,0];
	this.bgSpeed = 10;
	this.bgStarSpeed = 15;
	
	this.draw = function(dt){
		this.Delta = dt;
		
		this.bgPos[0] -= this.bgSpeed*this.Delta;
		this.bgPos[1] -= this.bgSpeed*this.Delta;
		this.bgStarPos[0] -= this.bgStarSpeed*this.Delta;
		this.bgStarPos[1] -= this.bgStarSpeed*this.Delta;
		
		var imgsNum = Math.ceil(Canvas.width/imageRepo.imgs[4].width)+1;
			
		Context.save();
		Context.translate(this.bgPos[0], this.bgPos[1]);
			for(var i = 0; i < imgsNum; i++){
				Context.drawImage(imageRepo.imgs[4], i * imageRepo.imgs[4].width, 0);
				Context.drawImage(imageRepo.imgs[4], i * imageRepo.imgs[4].width, imageRepo.imgs[4].height);
			}
		Context.restore();

		Context.save();
				
		Context.translate(this.bgStarPos[0], this.bgStarPos[1]);
			for(var i = 0; i < imgsNum; i++){
				Context.drawImage(imageRepo.imgs[5], i * imageRepo.imgs[5].width, 0);
				Context.drawImage(imageRepo.imgs[5], i * imageRepo.imgs[5].width, imageRepo.imgs[5].height);
			}
		Context.restore();
			
		if(this.bgPos[0] <= -imageRepo.imgs[4].width){
			this.bgPos[0] = 0;
		}
		if(this.bgPos[1] <= -imageRepo.imgs[4].height){
			this.bgPos[1] = 0;
		}
		if(this.bgStarPos[0] <= -imageRepo.imgs[5].width){
			this.bgStarPos[0] = 0;
		}
		if(this.bgStarPos[1] <= -imageRepo.imgs[5].height){
			this.bgStarPos[1] = 0;
		}
		
	}

};

function Controlls(dt){
	
	var Delta = dt;
	
	var direction = getVector(),
		rotSpeed = Math.PI;
		
	if(KEY_STATUS.left || KEY_STATUS.right
		|| KEY_STATUS.up || KEY_STATUS.down){

		if(KEY_STATUS.right){
			game.player.rot += rotSpeed * Delta;
			if(game.player.rot >= 2*Math.PI){
				game.player.rot = 0;
			}
		}
		if(KEY_STATUS.left){
			game.player.rot -= rotSpeed * Delta;
			if(game.player.rot <= -2*Math.PI){
				game.player.rot = 0;
			}
		}
		if(KEY_STATUS.up){
			if(game.player.speed <= game.player.maxSpeed){
				game.player.speed +=2;
			}
			game.player.pos[0] -= direction.x * game.player.speed * Delta;
			game.player.pos[1] -= direction.y * game.player.speed * Delta;
			game.player.breakSpeed = -game.player.speed;
		}
		if(KEY_STATUS.down){
			if(game.player.speed <= game.player.maxSpeed){
				game.player.speed +=2;
			}
			game.player.pos[0] += direction.x * game.player.speed * Delta;
			game.player.pos[1] += direction.y * game.player.speed * Delta;
			game.player.breakSpeed = game.player.speed;
		}
				
	}
	
	if(KEY_STATUS.space && game.fireMode == 1){
		if(game.player.currentFire >= game.player.fireNum){
			fireBullet1(game.player.objectCenter, game.player.rot, [8,48]);
			game.player.currentFire = 0;
		}
	}else if(KEY_STATUS.space && game.fireMode == 2){
		if(game.player.currentFire >= game.player.fireNum){
			fireBullet2(game.player.objectCenter, game.player.rot, [6,36]);
			game.player.currentFire = 0;
		}
	}else if(KEY_STATUS.space && game.fireMode == 3){
		if(game.player.currentFire >= game.player.fireNum){
			fireBullet3(game.player.objectCenter, game.player.rot, [20,62]);
			game.player.currentFire = 0;
		}
	}
	
	if(!KEY_STATUS.up && !KEY_STATUS.down){
		if(game.player.breakSpeed < 0){
			game.player.pos[0] += direction.x * game.player.breakSpeed * Delta;
			game.player.pos[1] += direction.y * game.player.breakSpeed * Delta;
			game.player.breakSpeed += 1.5;
			if(game.player.speed <= game.player.maxSpeed){
				game.player.speed += 1.5;
			}
		}else if(game.player.breakSpeed > 0 ){
			game.player.pos[0] += direction.x * game.player.breakSpeed * Delta;
			game.player.pos[1] += direction.y * game.player.breakSpeed * Delta;
			game.player.breakSpeed -= 1.5;
			if(game.player.speed >= -game.player.maxSpeed){
				game.player.speed -= 1.5;
			}
		}
		
	}
	
	checkBounds();
		
};

function fireBullet1(pos, rot, bulletSize){
	
	this.pos = pos;
	this.rot = rot;
	this.bulletSize = bulletSize;
	this.center = [this.pos[0]-this.bulletSize[0]/2, this.pos[1]-this.bulletSize[1]/2]
		
		game.player.bulletPool1.getPlayer1(this.center, this.rot);

};

function fireBullet2(pos, rot, bulletSize){
	
	this.pos = pos;
	this.rot = rot;
	this.bulletSize = bulletSize;
	this.center = [this.pos[0]-this.bulletSize[0]/2, this.pos[1]-this.bulletSize[1]/2]
		
		game.player.bulletPool2.getPlayer2(this.center, this.rot);

};

function fireBullet3(pos, rot, bulletSize){
	
	this.pos = pos;
	this.rot = rot;
	this.bulletSize = bulletSize;
	this.center = [this.pos[0]-this.bulletSize[0]/2, this.pos[1]-this.bulletSize[1]/2]
		
		game.player.bulletPool3.getPlayer3(this.center, this.rot);

};

function checkBounds(){
	if(game.player.pos[0] <= -60){
					game.player.pos[0] = -60;
	}
	if(game.player.pos[0] >= Canvas.width-60){
					game.player.pos[0] = Canvas.width-60;
	}
	if(game.player.pos[1] <= -60){
					game.player.pos[1] = -60;
	}
	if(game.player.pos[1] >= Canvas.height-60){
					game.player.pos[1] = Canvas.height-60;
	}
}

function getVector(){
	var vector = {	x: Math.cos(game.player.rot+Math.PI/2),
					y: Math.sin(game.player.rot+Math.PI/2)
				};
	
	return vector;
}	
	
var game = new Game();

function Game(){
	
	this.alphaGo = 0;
	this.alphaText = 0;
	this.gameOverState = false;
	this.scoreCounter = 0;
	this.alphaImg = 0;
	this.alphaImg0 = 0;
	this.totScoreTxt = "Final score:";
	this.retryTxt = "RETRY?";
	this.typeTxt = "";
	this.typeTxt0 = "";
	this.currentChar = 0;
	this.currentChar0 = 0;
	this.styleButton = "#05ffe6";
	this.shadowBotton = "#05ffe6";
	this.isEventSet = false;
	this.finishGameOver = false;
	this.spawnRestart = false;
	this.spawnQueue = [];
	
	this.init = function(){
		
		this.currentLevel = 0;
		this.scoreBank = 0;
		this.currentScore = 0;
		this.fireMode = 1;
		this.gameOverState = false;
				
		this.player = new Sprite (imageRepo.imgs[0],					//bildefil
								[0,0],									//start frame posisjon
								[120, 120],								//størrelse på framsa, [x,y]
								7,										//fps
								[0,1,2,3,5,6],							//hvilke frames som eksisterer / skal brukes
								false,									//om den loopes eller ei
								20,										//hp 20
								200,									//fart i px/sec
								["player", "playerShip", true, false],	//type; syntax = [spesiell type, generell type, hitBoxTall, hpbar, "beamer"]
								[70, 110],								//hitBoxSize hvis trengs "size" hvis size 
								["enemyProj"],							//kolliderbar med
								1,										//dmg
								"",										//worth
								10										//shield 10
							);	
		this.player.fireNum = 25;
		this.player.fireRate = 100;
		this.player.currentFire = 0;
		this.player.bulletPool1 = new bulletPool(20);
		this.player.bulletPool1.init("playerBullet1");
		this.player.bulletPool2 = new bulletPool(20);
		this.player.bulletPool2.init("playerBullet2");
		this.player.bulletPool3 = new bulletPool(10);
		this.player.bulletPool3.init("playerBullet3");
		this.player.explosion = new Sprite(imageRepo.imgs[3],
								[0,0],
								[130, 130],
								14,
								[0,1,2,3,4,5,6,7],
								true,
								1,
								1,
								["playerExplosion", "explosion", false, false],
								"size",
								[],
								1
							);
				
		this.quadTree = new QuadTree({x:0,y:0,width:Canvas.width,height:Canvas.height});

		this.level = new levelFunk(this.currentLevel);
		
		startScreenBurronHover();

		this.startState = true;
		
		main();
	}
	
	this.startScreen = function(){
		Context.save();
		Context.fillStyle = "rgba(0, 27, 61, 0.55)";
		Context.fillRect(0,0,Canvas.width, Canvas.height);
		Context.restore();
		
		Context.save();
		Context.font = "70px Lucida Console";
		Context.shadowBlur = 20;
		Context.shadowColor = "#05ffe6";
		Context.textAlign = "center";
		Context.fillText("Space Shooter", Canvas.width/2, Canvas.height*2/7);
		Context.restore();
		
		Context.save();
		Context.fillStyle = this.styleButton;
		Context.shadowColor = this.shadowBotton;
		Context.shadowBlur = 20;
		Context.font = "40px Lucida Console";
		Context.textAlign = "center";
		Context.drawImage(imageRepo.imgs[2], 260, 140, 300, 70, Canvas.width/2 - 200, Canvas.height*2/5, 400, 80);
		Context.fillText("Start Game", Canvas.width/2, Canvas.height*2/5 + 50);
		Context.restore();
	}
	
	this.gameOver = function(dt){
		
		var Delta = dt;
		
		Context.save();
		Context.fillStyle = "rgba(0, 27, 61, "+this.alphaGo+")";
		Context.fillRect(0,0,Canvas.width, Canvas.height);
		if(this.alphaGo < .55){
			this.alphaGo += Delta/2;
		}
		Context.restore();
		
		Context.save();
		Context.font = "70px Lucida Console";
		Context.fillStyle = "rgba(5, 255, 230, "+this.alphaText+")";
		Context.shadowBlur = 20;
		Context.shadowColor = "rgba(5, 255, 230, "+this.alphaText+")";
		Context.textAlign = "center";
		Context.fillText("GAME OVER", Canvas.width/2, Canvas.height/3);
		
		if(this.alphaText < 1){
			this.alphaText += Delta;
		}else if(this.alphaText > 1){
			this.alphaText = 1;
		}
		
		if(this.alphaText > .5){
			Context.save();
			Context.globalAlpha = this.alphaImg;
			
			if(this.alphaImg < 1){
				this.alphaImg += Delta;
			}
			Context.drawImage(imageRepo.imgs[2], 0, 217, 560, 70, Canvas.width/2-280, Canvas.height/3+57, 560,70);
			Context.restore();
		}
		
			Context.font = "25px Lucida Console";
			Context.fillText(this.typeTxt, Canvas.width/2 -150, Canvas.height/3+100);
			Context.textAlign = "end";
			
		if(this.alphaImg >= 1 && this.currentChar < this.totScoreTxt.length){
			
			this.typeTxt = this.typeTxt.concat(this.totScoreTxt.charAt(this.currentChar));
			this.currentChar = Math.ceil(this.currentChar + Delta);
		}
				
		if(this.typeTxt.length >= this.totScoreTxt.length/2){
			Context.fillText(this.scoreCounter, Canvas.width/2 + 240, Canvas.height/3+100);
			if(this.scoreCounter < this.currentScore){
				this.scoreCounter += Math.ceil(Delta*2 * (this.currentScore - this.scoreCounter));
			}
			if(this.scoreCounter >= this.currentScore*2/3){
				this.spawnRestart = true;
			}
		}
		if(this.spawnRestart){
			Context.save();
			Context.globalAlpha = this.alphaImg0;
			Context.fillStyle = this.styleButton;
			Context.shadowColor = this.shadowBotton;
			Context.drawImage(imageRepo.imgs[2], 260, 140, 300, 70, Canvas.width/2 - 150, Canvas.height/3+200, 300, 70);
			if(this.alphaImg0 < 1){
				this.alphaImg0 += 1.5 * Delta;
			}
			Context.restore();
		}
		if(this.alphaImg0 >= 1){
			if(!this.isEventSet){
				gameOverButtonHover();
				this.isEventSet = false;
			}
			Context.save();
			Context.fillStyle = this.styleButton;
			Context.shadowColor = this.shadowBotton;
			Context.font = "40px Lucida Console";
			Context.textAlign = "center";
			Context.fillText(this.typeTxt0, Canvas.width/2, Canvas.height/3 + 248);
			Context.restore();
			this.typeTxt0 = this.typeTxt0.concat(this.retryTxt.charAt(this.currentChar0));
			if(this.currentChar0 < this.retryTxt.length){
				this.currentChar0 = Math.ceil(this.currentChar0 + Delta);
			}else{
				this.finishGameOver = true;
			}
		}
		
		Context.restore();
	}
	
	this.start = function(){
		this.startState = false;
		this.player.spawn([startPosX, startPosY], 0);
		Canvas.removeEventListener('mousemove', this.getHoverStart, false);
		Canvas.removeEventListener('click', this.getClickStart, false);
		this.styleButton = "#05ffe6";
		this.shadowBotton = "#05ffe6";
		this.level = new levelFunk(this.currentLevel);
	}
	
	this.restart = function(){
		this.gameOverState = false;
		this.typeTxt = "";
		this.typeTxt0 = "";
		this.currentChar = 0;
		this.currentChar0 = 0;
		this.alphaGo = 0;
		this.alphaText = 0;
		this.gameOverState = false;
		this.finishGameOver = false;
		this.scoreCounter = 0;
		this.alphaImg = 0;
		this.alphaImg0 = 0;
		this.currentLevel = 1;
		this.scoreBank = 0;
		this.currentScore = 0;
		this.fireMode = 1;
		this.player.fireRate = 100;
		this.spawnRestart = false;
		this.level = new levelFunk(this.currentLevel);
		this.player.breakSpeed = 0;
		this.finishGameOver = false;
		this.styleButton = "#05ffe6";
		this.shadowBotton = "#05ffe6";
		this.spawnQueue = [];
		Canvas.removeEventListener('mousemove', this.getHover, false);
		Canvas.removeEventListener('click', this.getClick, false);
		this.player.spawn([startPosX, startPosY], 0);
	}
	
	this.getHoverStart = function(evt){
		if(game.startState){
		var mousePos = getMousePos(Canvas, evt),
			rect = [Canvas.width/2 - 195, Canvas.height*2/5 + 5, 400, 80];

		if (isInside(mousePos,rect) && game.startState){
			game.styleButton = "#ff0095";
			game.shadowBotton = "#ff0095";
		}else{
			game.styleButton = "#05ffe6";
			game.shadowBotton = "#05ffe6";
		}   
		}
	}

	this.getClickStart = function (evt){
		if(game.startState){
		var mousePos = getMousePos(Canvas, evt),
			rect = [Canvas.width/2 - 195, Canvas.height*2/5 + 5, 400, 80];

		if (isInside(mousePos,rect)){
			game.start();
		}  
		}
	}
	
	this.getClick = function(evt){
		var mousePos = getMousePos(Canvas, evt),
			rect = [Canvas.width/2 - 144, Canvas.height/3+207, 296, 65];

		if (isInside(mousePos,rect) && game.finishGameOver){
			game.restart();
		}  
	}
	
	this.getHover = function(evt){
		var mousePos = getMousePos(Canvas, evt),
			rect = [Canvas.width/2 - 144, Canvas.height/3+207, 296, 65];

		if (isInside(mousePos,rect) && game.finishGameOver){
			game.styleButton = "#ff0095";
			game.shadowBotton = "#ff0095";
		}else{
			game.styleButton = "#05ffe6";
			game.shadowBotton = "#05ffe6";
		}   
	}
	
};