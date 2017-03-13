
function bulletAi(){

	var bulletBounds = 70;

	this.animate = function(dt, rot, pos, speed){
		
			var Delta = dt;
			this.rot = rot;
			this.pos = pos;
			this.speed = speed;
			this.dead = false;
			
			this.pos[0] += Math.cos(rot-Math.PI/2) * this.speed * Delta;
			this.pos[1] += Math.sin(rot-Math.PI/2) * this.speed * Delta;
			
			if(this.pos[0] <= -bulletBounds || this.pos[0] >= Canvas.width + bulletBounds ||
			this.pos[1] <= -bulletBounds || this.pos[1] >= Canvas.height + bulletBounds){
				this.dead = true;
			}
			
		return [this.pos, this.rot, this.dead];
	};

};

function beamAi(){
	
	this.timer = 0;
	
	this.animate = function(dt, rot, pos, speed){
		
		var Delta = dt;
		this.rot = rot;
		this.pos = pos;
		this.speed = speed;
		this.dead = false;
						
		this.timer += Delta;
		if(this.timer >= 15){
			this.dead = true;
			this.timer = 0;
		}

		return [this.pos, this.rot, this.dead];
	}
	
}

function enemy1Ai(bullPool, playerDist, get){
	
	this.get = get;
	this.getString = "getEnemy"+this.get;
	this.fireRate = 50;
	this.currentFire = 0;
	this.fireNum = 200;
	this.bulletPool = bullPool;
	this.left = Math.random() < 0.5 ? true : false;
	this.isSpeedSet = false;
	this.rotSpeed = .5;
	
	this.animate = function(dt, rot, pos, speed, size, objectCenter){
		
		var Delta = dt;
		this.rot = rot;
		this.pos = pos;
		if(!this.isSpeedSet){this.speed = Math.floor(Math.random()*((speed+25)-(speed-25)+1)+(speed-25)); this.isSpeedSet = true};
		this.dead = false;
		this.size = size;
		this.objectCenter = objectCenter;
		
		this.currentFire += this.fireRate*Delta;
		
		this.playerDist = Math.sqrt(Math.pow(game.player.objectCenter[0]-this.objectCenter[0], 2) + Math.pow(game.player.objectCenter[1]-this.objectCenter[1], 2));
		this.playerAngle = Math.atan2(this.objectCenter[1] - game.player.objectCenter[1], this.objectCenter[0] - game.player.objectCenter[0]);
		this.playerAngle = this.playerAngle > 0 ? this.playerAngle : this.playerAngle+Math.PI*2;
		this.faceAngle = Math.PI/60;

		this.angleDiff = (this.rot - this.playerAngle > 0) ? (this.rot - this.playerAngle): (this.rot - this.playerAngle + Math.PI*2);
				
		if(this.angleDiff < Math.PI*3/2-this.faceAngle && this.angleDiff > Math.PI/2){	//		3*PI/2
			this.rot += this.rotSpeed * Delta;											//	2PI	Diff	PI
			if(this.rot >= Math.PI*2){													//		PI/2
				this.rot = 0;																
			}
		}else if(this.angleDiff < Math.PI/2 || this.angleDiff > Math.PI*3/2 + this.faceAngle){
			this.rot -= this.rotSpeed * Delta;
			if(this.rot <= 0){
				this.rot = Math.PI*2;
			}
		}else{
			if(this.currentFire >= this.fireNum && game.player.alive){
				this.fire(this.pos, this.rot, this.size);
			this.currentFire = 0;
			}
		}
				
		if(this.pos[0] < -200 || this.pos[0] > Canvas.width + 200 || this.pos[1] < -200 || this.pos[1] > Canvas.height+200){
			this.pos[0] -= Math.cos(this.playerAngle) * this.speed * Delta;
			this.pos[1] -= Math.sin(this.playerAngle) * this.speed * Delta;
		}else{
			
			if(this.left){
				this.pos[0] += Math.cos(this.rot) * this.speed * Delta;
				this.pos[1] += Math.sin(this.rot) * this.speed * Delta;
			}else if(!this.left){
				this.pos[0] += Math.cos(this.rot+Math.PI) * this.speed * Delta;
				this.pos[1] += Math.sin(this.rot+Math.PI) * this.speed * Delta;
			}
			
			this.pos[0] -= Math.cos(this.playerAngle) * this.speed/100 * (this.playerDist - playerDist) * Delta;
			this.pos[1] -= Math.sin(this.playerAngle) * this.speed/100 * (this.playerDist - playerDist) * Delta;
		}
		
		return [this.pos, this.rot, this.dead];
	}
	
	this.fire = function(pos, rot, size){

	this.pos = pos;
	this.rot = rot;
	this.size = size;
	this.bulletSize = [10,24];
	this.center = [this.pos[0]+this.size[0]/2-this.bulletSize[0]/2, this.pos[1]+this.size[1]/2-this.bulletSize[1]/2];
	
		this.bulletPool[this.getString](this.center, this.rot);

	}

};

function enemy2Ai(){
		
	this.animate = function(dt, rot, pos, speed, size, objectCenter){
			
		var Delta = dt;
		this.rot = rot;
		this.pos = pos;
		this.speed = speed;
		this.dead = false;
		this.size = size;
		this.objectCenter = objectCenter;
		this.rotSpeed = Math.PI;
		
		this.playerDist = Math.sqrt(Math.pow(game.player.objectCenter[0]-this.objectCenter[0], 2) + Math.pow(game.player.objectCenter[1]-this.objectCenter[1], 2));
		this.playerAngle = Math.atan2(this.objectCenter[1] - game.player.objectCenter[1], this.objectCenter[0] - game.player.objectCenter[0]);
		this.playerAngle = this.playerAngle > 0 ? this.playerAngle : this.playerAngle+Math.PI*2;
				
		this.rot += this.rotSpeed * 200/this.playerDist * Delta;
		
		if(this.pos[0] < 0 || this.pos[0] > Canvas.width-this.size[0] || this.pos[1] < this.size[1] || this.pos[1] > Canvas.height-this.size[1]){
			this.pos[0] -= Math.cos(this.playerAngle) * this.speed * Delta;
			this.pos[1] -= Math.sin(this.playerAngle) * this.speed * Delta;
		}else if(game.player.alive){
			this.pos[0] -= Math.cos(this.playerAngle) * this.speed * 150/this.playerDist * Delta;
			this.pos[1] -= Math.sin(this.playerAngle) * this.speed * 150/this.playerDist * Delta;
		}		
		
		return [this.pos, this.rot, this.dead];
	}
	
};

function enemy3Ai(bullPool){
	
	this.isPositionSet = false;
	this.isMoving = false;
	this.isFireing = false;
	this.isLiningUp = false;
	this.isFireAngleSet = false;
	this.bulletPool = bullPool;
	this.timer = 0;
	this.laserWidth = 1;
	this.laserColor = "#35eb20";
	
	this.animate = function(dt, rot, pos, speed, size, objectCenter){
		var Delta = dt;
		this.rot = rot;
		this.pos = pos;
		this.speed = speed;
		this.dead = false;
		this.size = size;
		this.objectCenter = objectCenter;
		this.rotSpeed = Math.PI/4;
		this.faceAngle = Math.PI/60;
		
		this.playerAngle = Math.atan2(this.objectCenter[1] - game.player.objectCenter[1], this.objectCenter[0] - game.player.objectCenter[0]);
		this.playerAngle = this.playerAngle > 0 ? this.playerAngle : this.playerAngle+Math.PI*2;
		
		if(game.player.alive){
		if(!this.isPositionSet){
			this.leftOrRight = Math.random() > .5 ? [100, Canvas.width/3] : [Canvas.width*2/3, Canvas.width-100];
			this.topOrBot = Math.random() > .5 ? [100, Canvas.height/3] : [Canvas.height*2/3, Canvas.height-100];
			
			this.destination = [Math.floor(Math.random()*(this.leftOrRight[1]-this.leftOrRight[0]+1)+this.leftOrRight[0]), Math.floor(Math.random()*(this.topOrBot[1]-this.topOrBot[0]+1)+this.topOrBot[0])];
			
			this.destinationAngle = Math.atan2(this.objectCenter[1] - this.destination[1], this.objectCenter[0] - this.destination[0]);
			this.destinationAngle = this.destinationAngle > 0 ? this.destinationAngle : this.destinationAngle+Math.PI*2;
						
			this.isPositionSet = true;
			this.isMoving = true;
		}
		
		if(this.isMoving){
			
			this.destDist = Math.sqrt(Math.pow(this.destination[0]-this.objectCenter[0], 2) + Math.pow(this.destination[1]-this.objectCenter[1], 2));
			this.angleDestDiff = (this.rot - this.destinationAngle > 0) ? (this.rot - this.destinationAngle): (this.rot - this.destinationAngle + Math.PI*2);
			
			if(this.angleDestDiff < Math.PI*3/2-this.faceAngle && this.angleDestDiff > Math.PI/2){	//		3*PI/2
				this.rot += this.rotSpeed * Delta;											//	2PI	Diff	PI
				if(this.rot >= Math.PI*2){														//		PI/2
					this.rot = 0;																
				}
			}else if(this.angleDestDiff < Math.PI/2 || this.angleDestDiff > Math.PI*3/2 + this.faceAngle){
				this.rot -= this.rotSpeed * Delta;
				if(this.rot <= 0){
					this.rot = Math.PI*2;
				}
			}
			
			if(this.pos[0] < -200 || this.pos[0] > Canvas.width + 200 || this.pos[1] < -200 || this.pos[1] > Canvas.height+200){
				this.pos[0] -= Math.cos(this.destinationAngle) * this.speed * Delta;
				this.pos[1] -= Math.sin(this.destinationAngle) * this.speed * Delta;
			}else if(this.destDist > 50){
				this.pos[0] -= Math.cos(this.destinationAngle) * this.speed * this.destDist/200 * Delta;
				this.pos[1] -= Math.sin(this.destinationAngle) * this.speed * this.destDist/200 * Delta;
			}else if(this.destDist < 50){
				this.isMoving = false;
				this.isLiningUp = true;
			}
		}
		
		if(this.isLiningUp){
			
			this.playerAngle = Math.atan2(this.objectCenter[1] - game.player.objectCenter[1], this.objectCenter[0] - game.player.objectCenter[0]);
			this.playerAngle = this.playerAngle > 0 ? this.playerAngle : this.playerAngle+Math.PI*2;
			
			this.angleDiff = (this.rot - this.playerAngle > 0) ? (this.rot - this.playerAngle): (this.rot - this.playerAngle + Math.PI*2);
				
			if(this.angleDiff < Math.PI*3/2-this.faceAngle && this.angleDiff > Math.PI/2 && !this.isFireAngleSet){
				this.rot += this.rotSpeed/3 * Delta;											
				if(this.rot >= Math.PI*2){												
					this.rot = 0;																
				}
			}else if(this.angleDiff < Math.PI/2 || this.angleDiff > Math.PI*3/2 + this.faceAngle && !this.isFireAngleSet){
				this.rot -= this.rotSpeed/3 * Delta;
				if(this.rot <= 0){
					this.rot = Math.PI*2;
				}
			}
			
			this.timer += Delta;
			this.laserWidth += Delta/4;
			
			if(this.timer > 10){this.isFireAngleSet = true; this.isLiningUp = false; this.timer = 0;};
		}
		
		if(this.isFireAngleSet){
			
			this.timer += Delta;
			
			if(this.timer >= .8){
				this.laserWidth += 95 * Delta;
			}
			
			if(this.timer > 1){
				this.fire(this.objectCenter, this.rot, this.size);
				this.isFireAngleSet = false;
				this.isFireing = true;
				this.timer = 0;
				this.laserWidth = 1;
			}
		}

		if(this.isFireing){
			this.timer += Delta;
						
			if(this.timer > 5){
				this.isFireing = false;
				this.isPositionSet = false;
				this.timer = 0;
			}
		}
		}else{
			this.isPositionSet = false;
			this.isMoving = false;
			this.isFireing = false;
			this.isLiningUp = false;
			this.isFireAngleSet = false;
		}
		
		return [this.pos, this.rot, this.dead];
	};

	this.fire = function(pos, rot, size){

		this.objectCenter = pos;
		this.rot = rot;
		
		this.bulletPool.getEnemy3(this.objectCenter, this.rot);
	};
	
};

function enemy5Ai(bullPool){
	
	this.isPositionSet = false;
	this.isMoving = false;
	this.isFireing = true;
	this.timer = 0;
	this.moveCounter = 0;
	this.isFireing = false;
	this.bulletPool = bullPool;
	this.hasFired = false;
	this.rotSpeed = Math.PI*3;
	this.faceAngle = Math.PI/30;

	this.animate = function(dt, rot, pos, speed, size, objectCenter){

		var Delta = dt;
		this.rot = rot;
		this.pos = pos;
		this.speed = speed;
		this.dead = false;
		this.size = size;
		this.objectCenter = objectCenter;

		this.playerAngle = Math.atan2(this.objectCenter[1] - game.player.objectCenter[1], this.objectCenter[0] - game.player.objectCenter[0]);
		this.playerAngle = this.playerAngle > 0 ? this.playerAngle : this.playerAngle+Math.PI*2;
		
		if(!this.isPositionSet && game.player.alive){
			this.leftOrRight = Math.random() > .5 ? [100, Canvas.width/3] : [Canvas.width*2/3, Canvas.width-100];
			this.topOrBot = Math.random() > .5 ? [100, Canvas.height/3] : [Canvas.height*2/3, Canvas.height-100];
			
			this.destination = [Math.floor(Math.random()*(this.leftOrRight[1]-this.leftOrRight[0]+1)+this.leftOrRight[0]), Math.floor(Math.random()*(this.topOrBot[1]-this.topOrBot[0]+1)+this.topOrBot[0])];
			
			this.destinationAngle = Math.atan2(this.objectCenter[1] - this.destination[1], this.objectCenter[0] - this.destination[0]);
			this.destinationAngle = this.destinationAngle > 0 ? this.destinationAngle : this.destinationAngle+Math.PI*2;
						
			this.isPositionSet = true;
			this.isMoving = true;
		}
		
		if(this.isMoving){	
			this.destDist = Math.sqrt(Math.pow(this.destination[0]-this.objectCenter[0], 2) + Math.pow(this.destination[1]-this.objectCenter[1], 2));
			
			if(this.pos[0] < -200 || this.pos[0] > Canvas.width + 200 || this.pos[1] < -200 || this.pos[1] > Canvas.height+200){
				this.pos[0] -= Math.cos(this.destinationAngle) * this.speed * Delta;
				this.pos[1] -= Math.sin(this.destinationAngle) * this.speed * Delta;
			}else if(this.destDist > 60){
				this.pos[0] -= Math.cos(this.destinationAngle) * this.speed * (this.destDist - 55) * Delta;
				this.pos[1] -= Math.sin(this.destinationAngle) * this.speed * (this.destDist - 55) * Delta;
			}else if(this.destDist < 60 && this.moveCounter < 3){
				this.isMoving = false;
				this.isPositionSet = false;
				this.moveCounter++;
				if(this.moveCounter >= 3){
					this.isPositionSet = true;
					this.isFireing = true;
					this.moveCounter = 0;
				}
			}
		}
		
		if(this.isFireing && this.timer < 1){
			this.timer += Delta;
			if(!this.hasFired){
				this.fire(this.objectCenter, this.rot, this.size);
				this.hasFired = true;
			}
		}else if(this.timer >= .5){
			this.isFireing = false;
			this.timer = 0;
			this.isPositionSet = false;
			this.hasFired = false;
		}
		
		if(!this.isFireing){
			this.playerAngle = Math.atan2(this.objectCenter[1] - game.player.objectCenter[1], this.objectCenter[0] - game.player.objectCenter[0]);
			this.playerAngle = this.playerAngle > 0 ? this.playerAngle : this.playerAngle+Math.PI*2;
			
			this.angleDiff = (this.rot - this.playerAngle > 0) ? (this.rot - this.playerAngle): (this.rot - this.playerAngle + Math.PI*2);
			
			if(this.angleDiff < Math.PI*3/2-this.faceAngle && this.angleDiff > Math.PI/2){
				this.rot += this.rotSpeed * Delta;											
				if(this.rot >= Math.PI*2){												
					this.rot = 0;																
				}
			}else if(this.angleDiff < Math.PI/2 || this.angleDiff > Math.PI*3/2 + this.faceAngle){
				this.rot -= this.rotSpeed * Delta;
				if(this.rot <= 0){
					this.rot = Math.PI*2;
				}
			}
		}
		

		return [this.pos, this.rot, this.dead];
	};

	this.fire = function(pos, rot, size){	
		this.bulletPool.getEnemy5(pos, rot, size);
	};
	
};