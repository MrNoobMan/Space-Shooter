function bulletPool(maxSize){
	this.size = maxSize;
	var pool = [];
		
	this.getPool = function(){
		var obj = [];
		for(var i = 0; i < this.size; i++){
			if(pool[i].alive){
				obj.push(pool[i]);
			}
		}
		return obj;
	};
	
	this.getDead = function(){
		var deadObj = [];
		for(var i = 0; i < this.size; i++){
			if(!pool[i].alive){
				deadObj.push(pool[i]);
			}
		}
		return deadObj;
	}
		
	this.init = function(object){
		if(object == "playerBullet1"){
			for(var i = 0; i < this.size; i++){
				var bullet = new Sprite(imageRepo.imgs[1],
								[0,0],
								[8,48],
								0,
								[0],
								false,
								.08,
								700,
								["playerBullet", "bullet", false],
								"size",
								["enemyShip"],
								50,
								0,
								0
							);
				bullet.alive = false;
				bullet.explosion = new Sprite(imageRepo.imgs[3],
								[0,284],
								[16, 16],
								9,
								[0,1,2,3],
								true,
								1,
								1,
								["playerbulletexp", "explosion", false, false],
								"size",
								[],
								0,
								0,
								0
							);
				bullet.ai = new bulletAi();
				pool[i] = bullet;
			}
		}else if(object == "playerBullet2"){
			for(var i = 0; i < this.size; i++){
				var bullet = new Sprite(imageRepo.imgs[1],
								[38,0],
								[6,36],
								0,
								[0],
								false,
								.06,
								1000,
								["playerBullet", "bullet", false],
								"size",
								["enemyShip"],
								30,
								0,
								0
							);
				bullet.alive = false;
				bullet.explosion = new Sprite(imageRepo.imgs[3],
								[0,284],
								[16, 16],
								9,
								[0,1,2,3],
								true,
								1,
								1,
								["playerbulletexp", "explosion", false, false],
								"size",
								[],
								1,
								0,
								0
							);
				bullet.ai = new bulletAi();
				pool[i] = bullet;
			}
		}else if(object == "playerBullet3"){
			for(var i = 0; i < this.size; i++){
				var bullet = new Sprite(imageRepo.imgs[1],
								[54,0],
								[20,62],
								10,
								[0,1,2,3,4],
								false,
								3000,
								600,
								["playerBullet", "bullet", false, false],
								[15,50],
								["enemyShip"],
								80,
								0,
								0
							);
				bullet.alive = false;
				bullet.explosion = new Sprite(imageRepo.imgs[3],
								[0,284],
								[16, 16],
								9,
								[0,1,2,3],
								true,
								1,
								1,
								["playerbulletexp", "explosion", false, false],
								"size",
								[],
								1,
								0,
								0
							);
				bullet.ai = new bulletAi();
				pool[i] = bullet;
			}
		}else if(object == "enemy1bullet"){
			for(var i = 0; i < this.size; i++){
				var bullet = new Sprite(imageRepo.imgs[1],
								[18,0],
								[10,24],
								0,
								[0],
								false,
								.1,
								400,
								["enemyProj", "enemyBullet", false, false],
								"size",
								["playerShip"],
								5,
								0,
								0
							);
				bullet.explosion = new Sprite(imageRepo.imgs[3],
								[140,284],
								[16, 16],
								9,
								[0,1,2,3],
								true,
								1,
								1,
								["enemybullet1exp", "explosion", false, false],
								"size",
								[],
								1
							);
				bullet.ai = new bulletAi();
				pool[i] = bullet;
			}
		}else if(object == "enemy3beam"){
			for(var i = 0; i < this.size; i++){
				var beam = new Sprite(imageRepo.imgs[6],
							[0,0],
							[20,1600],
							0,
							[0],
							false,
							10000,
							0,
							["enemyProj", "beam", false, false],
							[18, 1600],
							["playerShip"],
							.5,
							0,
							0
							);
				beam.ai = new beamAi();
				pool[i] = beam;
			}
		}else if(object == "enemy5bullet"){
			for(var i = 0; i < this.size; i++){
				var bullet = new Sprite(imageRepo.imgs[1],
								[0,74],
								[30,30],
								14,
								[0,1,2,3,4,5,6,7],
								false,
								1000,
								200,
								["enemyProj", "enemyBullet", false, false],
								[20,20],
								["playerShip"],
								5,
								0,
								0
							);
				bullet.explosion = new Sprite(imageRepo.imgs[3],
								[140,284],
								[16, 16],
								9,
								[0,1,2,3],
								true,
								1,
								1,
								["enemybullet1exp", "explosion", false, false],
								"size",
								[],
								1
							);
				bullet.ai = new bulletAi();
				pool[i] = bullet;
			}
		}
	}
	
	this.get = function(pos, rot) {
		if(!pool[this.size - 1].alive) {
			pool[this.size - 1].spawn(pos, rot);
			pool.unshift(pool.pop());
		}
	};
	
	this.getPlayer1 = function(pos, rot){
		
		this.rot = rot;
		this.pos = pos;
				
		var vectorLength = 36.5005494,		//sqrt(10^2 + 35^2)
			angleToGet1 = this.rot + Math.atan(0.2857142857143),	// 10/35
			angleToGet2 = this.rot + Math.atan(-0.2857142857143)+Math.PI;

		this.pos1 = [
					(this.pos[0]) + Math.cos(angleToGet1) * vectorLength,
					(this.pos[1]) + Math.sin(angleToGet1) * vectorLength
					];
		this.pos2 = [
					(this.pos[0]) + Math.cos(angleToGet2) * vectorLength,
					(this.pos[1]) + Math.sin(angleToGet2) * vectorLength
					];

		if(!pool[this.size - 1].alive && !pool[this.size - 2].alive){
			this.get(this.pos1, rot);
			this.get(this.pos2, rot);
		}
	};
	
	this.getPlayer2 = function(pos, rot){
		
		this.rot = rot;
		this.pos = pos;
		
		this.pos[0] += Math.cos(this.rot - Math.PI/2) * 45;
		this.pos[1] += Math.sin(this.rot - Math.PI/2) * 45;
		this.rot += Math.random() > .5 ? Math.random() * Math.PI/10: -Math.random() * Math.PI/10; 
		
		this.get(this.pos, this.rot)
	};
	
	this.getPlayer3 = function(pos, rot){
		
		this.rot = rot;
		this.pos = pos;
		
		this.pos[0] += Math.cos(this.rot - Math.PI/2) * 30;
		this.pos[1] += Math.sin(this.rot - Math.PI/2) * 30;

		this.get(this.pos, this.rot);
	};
	
	this.getEnemy1 = function(pos, rot){
		
		this.rot = rot;
		this.pos = pos;
		
		var startheigth = -50,
			startwidth = 15;
			
		var vectorLength = 52.20153254455,	//sqrt(-50^2 + 15^2)
			angleToGet = this.rot + Math.atan(startheigth/startwidth);
		
		this.pos1 = [
					(this.pos[0]) + Math.cos(angleToGet) * vectorLength,
					(this.pos[1]) + Math.sin(angleToGet) * vectorLength
					];
					
		if(!pool[this.size - 1].alive){
			this.get(this.pos1, rot);
		}

	};
	
	this.getEnemy3 = function(pos, rot){
		
		this.rot = rot;
		this.pos = pos;
						

		this.drawPosY = Math.cos(this.rot) * 800 + this.pos[1]-800;
		this.drawPosY -= Math.cos(this.rot) * 1600;

		this.drawPos = [
						Math.sin(this.rot) * 800 + this.pos[0]-10,
						this.drawPosY
						]
										
		if(!pool[this.size - 1].alive){
			this.get(this.drawPos, this.rot);
		}
	};
	
	this.getEnemy4 = function(pos, rot){
		
		this.rot = rot;
		this.pos = pos;
		
		var width = -50,
			height = 28;
		
		var vectorLength = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2)),
			angleToGet1 = this.rot + Math.atan(width/height),	// 10/35
			angleToGet2 = this.rot + Math.atan(-width/height)+Math.PI;

		this.pos1 = [
					(this.pos[0]) + Math.cos(angleToGet1) * vectorLength,
					(this.pos[1]) + Math.sin(angleToGet1) * vectorLength
					];
		this.pos2 = [
					(this.pos[0]) + Math.cos(angleToGet2) * vectorLength,
					(this.pos[1]) + Math.sin(angleToGet2) * vectorLength
					];

		if(!pool[this.size - 1].alive && !pool[this.size - 2].alive){
			this.get(this.pos1, rot);
			this.get(this.pos2, rot);
		}
	};
	
	this.getEnemy5 = function(pos, rot){
		
		this.rot = rot;
		this.pos = [pos[0]-15, pos[1]-15];
		
		this.pos[0] += Math.cos(this.rot - Math.PI/2) * 45;
		this.pos[1] += Math.sin(this.rot - Math.PI/2) * 45;
		
		this.get(this.pos, this.rot);
	}

};

function enemyPool(maxSize){
	this.size = maxSize;
	var pool = [];
		
	this.getPool = function(){
		var obj = [];
		for(var i = 0; i < this.size; i++){
			if(pool[i].alive){
				obj.push(pool[i]);
			}
		}
		return obj;
	};
	
	this.getDead = function(){
		var deadObj = [];
		for(var i = 0; i < this.size; i++){
			if(!pool[i].alive){
				deadObj.push(pool[i]);
			}
		}
		return deadObj;
	}
		
	this.init = function(object){
		if(object == "enemy1"){
			for(var i = 0; i < this.size; i++){
				var enemy = new Sprite (imageRepo.imgs[0],
								[0,132],
								[90, 120],
								8,
								[0,1,2,3,4,5,6],
								false,
								55,
								50,
								["enemy1", "enemyShip", true, true],
								[80 ,110],
								["playerBullet"],
								1,
								200
							);
				enemy.alive = false;
				enemy.bulletPool = new bulletPool(2);
				enemy.bulletPool.init("enemy1bullet");
				enemy.explosion = new Sprite(imageRepo.imgs[3],
								[0,142],
								[130, 130],
								13,
								[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14],
								true,
								1,
								1,
								["enemy1exp", "explosion", false, false],
								"size",
								[],
								1
							);
				enemy.ai = new enemy1Ai(enemy.bulletPool, 300, 1);
				pool[i] = enemy;
			}
		}else if(object == "enemy2"){
			for(var i = 0; i < this.size; i++){
				var enemy = new Sprite (imageRepo.imgs[0],
								[0,264],
								[60,60],
								15,
								[0,1,2,3,4],
								false,
								.1,
								125,
								["enemyProj", "enemyShip", false, false],
								"size",
								["playerBullet", "playerShip"],
								25,
								150
							);
				enemy.ai = new enemy2Ai();
				enemy.explosion = new Sprite(imageRepo.imgs[3],
								[1230,0],
								[80, 80],
								14,
								[0,1,2,3,4,5,6],
								true,
								1,
								1,
								["enemy2exp", "explosion", false, false],
								"size",
								[],
								1
							);
				pool[i] = enemy;
			}
		}else if(object == "enemy3"){
			for(var i = 0; i < this.size; i++){
				var enemy = new Sprite(imageRepo.imgs[0],
								[0,336],
								[120,115],
								7,
								[0,1,2,3,4,5,6],
								false,
								200,
								50,
								["enemy3", "enemyShip", true, true, "beamer"],
								[110,110],
								["playerBullet"],
								1,
								350,
								25
							);
				enemy.bulletPool = new bulletPool(1);
				enemy.bulletPool.init("enemy3beam");
				enemy.ai = new enemy3Ai(enemy.bulletPool);
				enemy.explosion = new Sprite(imageRepo.imgs[3],
								[0,312],
								[130, 130],
								14,
								[0,1,2,3,4,5,6,7],
								true,
								1,
								1,
								["enemy3exp", "explosion", false, false],
								"size",
								[],
								1
							);
				pool[i] = enemy;
			}
		}else if(object == "enemy4"){
			for(var i = 0; i < this.size; i++){
				var enemy = new Sprite (imageRepo.imgs[0],
								[0,463],
								[120, 120],
								8,
								[0,1,2,3,4,5,6],
								false,
								35,
								100,
								["enemy4", "enemyShip", true, true],
								[100 ,110],
								["playerBullet"],
								1,
								250,
								20
							);
				enemy.alive = false;
				enemy.bulletPool = new bulletPool(4);
				enemy.bulletPool.init("enemy1bullet");
				enemy.explosion = new Sprite(imageRepo.imgs[3],
								[0,142],
								[130, 130],
								13,
								[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14],
								true,
								1,
								1,
								["enemy1exp", "explosion", false, false],
								"size",
								[],
								1
							);
				enemy.ai = new enemy1Ai(enemy.bulletPool, 350, 4);
				pool[i] = enemy;
			}
		}else if(object == "enemy5"){
			for(var i = 0; i < this.size; i++){
				var enemy = new Sprite (imageRepo.imgs[0],
								[0,595],
								[104, 120],
								14,
								[0,1,2,3,4,5,6],
								false,
								25,
								10,
								["enemy5", "enemyShip", true, true],
								[70 ,110],
								["playerBullet"],
								1,
								300
							);
				enemy.alive = false;
				enemy.bulletPool = new bulletPool(4);
				enemy.bulletPool.init("enemy5bullet");
				enemy.explosion = new Sprite(imageRepo.imgs[3],
								[0,454],
								[115, 117],
								13,
								[0,1,2,3,4,5,6,7,8,9,10,11],
								true,
								1,
								1,
								["enemy5exp", "explosion", false, false],
								"size",
								[],
								1
							);
				enemy.ai = new enemy5Ai(enemy.bulletPool);
				pool[i] = enemy;
			}
		}
	};
	
	this.get = function(pos, rot) {
		if(!pool[this.size - 1].alive) {
			pool[this.size - 1].spawn(pos, rot);
			pool.unshift(pool.pop());
		}
	};
	
};