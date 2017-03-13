
function levelFunk(currLvl){
	
	this.tempEnemPool = [];
	this.enemyPool = [];
	this.bulletPool = [];
			
	var	totEnem = currLvl,
		enemLvlRange = {"enemy1":[1,25], "enemy2":[3, 45], "enemy3":[15, 30], "enemy4":[10, 66], "enemy5":[20, 666]},
		enemTypeSize = Object.keys(enemLvlRange).length,
		enemiesToUse = [];

	for(var i = 0; i < currLvl; i++){	
		totEnem += Math.random() > Math.pow(currLvl, -.1) ? .5 : -.5;
	}
	totEnem = Math.round(totEnem);
	
	for(var i = 1; i <= enemTypeSize; i++){
		var enemString = "enemy"+i;
		if(enemLvlRange[enemString][0] <= currLvl && enemLvlRange[enemString][1] >= currLvl){
			enemiesToUse.push(["enemy"+i]);
		}
	}
		
	for(var i = 0; i < enemiesToUse.length; i++){
		if(i < enemiesToUse.length-1){
			var poolDist = Math.floor(Math.random() * totEnem/2) + 1;
				totEnem -= poolDist;
		}else{
			var poolDist = totEnem;
		}
			this.tempEnemPool.push([new enemyPool(poolDist), enemiesToUse[i]]);
	}
		
	for(var y = 0; y < this.tempEnemPool.length; y++){
		this.tempEnemPool[y][0].init(this.tempEnemPool[y][1]);
		if(typeof this.tempEnemPool[y][0] !== "undefined"){
			this.enemyPool.push(this.tempEnemPool[y][0]);
		}
	}
	
	for(var p = 0; p < this.enemyPool.length; p++){
		for(var i = 0; i < this.enemyPool[p].size; i++){
			var spawnPos = Math.random() * ((200 * i >= 1500 ? 1500: 200 * i) - 200) + 200;
			if(Math.random() > 0.5){
				xSpawn = Math.random() > 0.5 ? -spawnPos : Canvas.width + spawnPos,
				ySpawn = Math.floor(Math.random()*(750-50+1)+50),
				spawnRot = xSpawn > 0 ? Math.PI*3/2 : Math.PI/2;
			}else{
				xSpawn = Math.floor(Math.random()*(1424-100+1)+100),
				ySpawn = Math.random() > 0.5 ? -spawnPos : Canvas.height + spawnPos,
				spawnRot = ySpawn < 0 ? Math.PI : 0;
			}
			
			this.enemyPool[p].get([xSpawn, ySpawn], spawnRot);
			
		}
		for(var b = 0; b < this.enemyPool[p].size; b++){
			if(typeof this.enemyPool[p].getPool()[b].bulletPool !== "undefined"){
				this.bulletPool = this.bulletPool.concat(this.enemyPool[p].getPool()[b].bulletPool.getDead());
			}
		}
	}
	
};