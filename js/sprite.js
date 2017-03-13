
var imageRepo = new function(){
	
	this.imgSources = [ "pics/ships.png", 		//0
					"pics/bullets.png",			//1
					"pics/ui.png",				//2
					"pics/explosions.png",		//3
					"pics/bg.jpg",				//4
					"pics/bgstars.png",			//5
					"pics/beams.png",			//6
					"pics/harambe.png"			//7
					];

	this.imgs = [];

	for(var i = 0; i < this.imgSources.length; i++){
		this.imgs[i] = new Image();
		this.imgs[i].onload = function(){
				imageLoaded();
		}
		this.imgs[i].src = this.imgSources[i];
	};
			
};

function imageLoaded(){
	numLoaded++;
	if(numLoaded === numImages){
		game.init();
	}
}

function Sprite(img, framePos, size, frameSpeed, frames, once, maxHealth, speed, type, hitBoxSize, collidable, dmg, worth, maxShield){
	
	this.pos = [0,0];
	this.img = img;
	this.framePos = framePos;
	this.size = size;
	this.frameSpeed = typeof frameSpeed === "number" ? frameSpeed : 0;
	this.frames = frames;
	this.once = once;
	this.alive = false;
	this.maxHealth = maxHealth;
	this.rot = 0;
	this.speed = speed;
	this.type = type;
	this.frameIndex = 0;
	this.hitBoxSize = hitBoxSize == "size" ? size : hitBoxSize;
	this.isCollidableWith = collidable;
	this.damage = typeof dmg === "number" ? dmg : 1;
	this.worth = typeof worth === "number" ? worth : 0;
	this.maxShield = typeof maxShield === "number" ? maxShield : 0;
	
	this.currentShield = this.maxShield;
	this.currentHp = this.maxHealth;

		this.spawn = function(position, rot){
			this.pos = position;
			this.rot = rot;
			this.currentHp = this.maxHealth;
			this.currentShield = this.maxShield;
			this.healthPartition = 1;
			this.shieldPartition = 1;
			this.frameIndex = 0;
			this.shieldTimer = 0;
			this.alive = true;
		};

		this.update = function(dt){
			this.frameIndex += this.frameSpeed*dt;
			if(this.type[0] === "player"){
				this.currentFire += this.fireRate*dt;
			}
			if(this.shieldTimer >= 5 && this.shieldPartition < 1){
				this.shieldPartition += dt * .05;
				this.currentShield += dt * this.maxShield/20;
				if(this.shieldPartition > .995 || this.shieldPartition > 1 || this.currentShield > this.maxShield){
					this.shieldPartition = 1;
					this.currentShield = this.maxShield;
				}
			}
			this.shieldTimer += dt;
		};

		this.render = function(Context){

			if(this.currentHp <= 0){
				this.alive = false;
			}
			
			var maxFrames = this.frames.length,
				frameIndexR = Math.floor(this.frameIndex),
				whichFrame = this.frames[frameIndexR % maxFrames];
				
			if(this.once && frameIndexR >= maxFrames){
				this.alive = false;
				return;
			}
			
			this.frameX = this.framePos[0];
			this.frameY = this.framePos[1];	
			
			this.frameX += this.size[0] * whichFrame + 10 * whichFrame;
					
			if(this.alive){
					Context.drawImage(this.img, this.frameX, this.frameY, this.size[0], this.size[1], 0,0, this.size[0], this.size[1]);
			}
		};
		
		this.drawHpBar = function(){
				Context.drawImage(imageRepo.imgs[2], 170, 126, 120, 7, this.pos[0], this.pos[1]+this.size[1]*6/5, this.size[0], 7);
				Context.drawImage(imageRepo.imgs[2], 0, 126, 120*this.healthPartition, 7, this.pos[0], this.pos[1]+this.size[1]*6/5, this.size[0]*this.healthPartition, 7);
				if(this.shieldPartition > 0 && this.maxShield > 0){
					Context.drawImage(imageRepo.imgs[2], 336, 126, 120*this.shieldPartition, 7, this.pos[0], this.pos[1]+this.size[1]*6/5, this.size[0]*this.shieldPartition, 7);
				}
				Context.drawImage(imageRepo.imgs[2], 0, 146, 126, 13, this.pos[0]-2, this.pos[1]+this.size[1]*6/5-2.5, this.size[0]+4, 13);
		};
		
		this.objectWidthHitBox = this.hitBoxSize[0]/2;
		this.objectHeightHitBox = this.hitBoxSize[1]/2;
		this.objectWidth = this.size[0]/2;
		this.objectHeight = this.size[1]/2;
		this.objectCenter = [this.pos[0]+this.objectWidth, this.pos[1]+this.objectHeight];
		this.corners = [];	//	2----1 -> this.corners[i][x,y];
							//	|    |
							//	|	 |
							//	3----0
		this.topLeftRightBottom = [];
		
		this.getHitBox = function(){
			
			this.objectCenter = [this.pos[0]+this.objectWidth, this.pos[1]+this.objectHeight];
			
			var	angleToGet1 = this.rot + Math.atan(this.objectHeightHitBox/this.objectWidthHitBox),
				angleToGet2 = this.rot + Math.atan(-this.objectHeightHitBox/this.objectWidthHitBox),
				vectorLength = Math.sqrt(Math.pow(this.objectWidthHitBox,2) + Math.pow(this.objectHeightHitBox,2)),
				quadRant = [ angleToGet1, angleToGet2, angleToGet1+Math.PI, angleToGet2+Math.PI];
			
			for(var i = 0; i < 4; i++){
				this.corners[i] = [
									(this.objectCenter[0]) + Math.cos(quadRant[i]) * vectorLength,
									(this.objectCenter[1]) + Math.sin(quadRant[i]) * vectorLength
									]
			}
									
			this.topLeftRightBottom = [
										Math.min(this.corners[0][1], this.corners[1][1], this.corners[2][1], this.corners[3][1]),
										Math.min(this.corners[0][0], this.corners[1][0], this.corners[2][0], this.corners[3][0]),
										Math.max(this.corners[0][0], this.corners[1][0], this.corners[2][0], this.corners[3][0]),
										Math.max(this.corners[0][1], this.corners[1][1], this.corners[2][1], this.corners[3][1])
										];

		};

		this.drawHitBox = function(){
			
			this.getHitBox();
			
			Context.strokeStyle="#ff00ae";
			
			Context.beginPath();
			Context.moveTo(this.corners[0][0], this.corners[0][1]);
			for(var i = 1; i < 4; i++){
				Context.lineTo(this.corners[i][0], this.corners[i][1]);
				Context.lineTo(this.corners[i][0], this.corners[i][1]);
				Context.lineTo(this.corners[i][0], this.corners[i][1]);
			}
			Context.lineTo(this.corners[0][0], this.corners[0][1]);
			Context.stroke();
			
			Context.fillStyle = "#ff170f"; 
			Context.font="bold 20px Georgia";
			Context.fillText(
						Math.floor(this.objectCenter[0])+"x "+Math.floor(this.objectCenter[1])+"y",
						this.objectCenter[0]+this.objectWidth,
						this.objectCenter[1]+this.objectHeight*3/2);
			
			if(this.type[2]){
			Context.fillStyle = "#ff770f"; 
				for(var i = 0; i < 4; i++){
					Context.fillText(
							Math.floor(this.corners[i][0])+"x "+
							Math.floor(this.corners[i][1])+"y",
							this.corners[i][0],
							this.corners[i][1]
							);
				}
			}
		};

};