
function detectCollision(dt){
	var objects = [],
		Delta = dt;
	game.quadTree.getCollidableObjects(objects);
			
	for(var x = 0, len = objects.length; x < len; x++){

		objects[x].getHitBox();
		game.quadTree.findObjects(obj = [], objects[x])

		for(var y = 0, leng = obj.length; y < leng; y++){

			obj[y].getHitBox();

			for(var z = 0; z < obj[y].isCollidableWith.length; z++){
				if(obj[y].isCollidableWith[z] == objects[x].type[0]){
										
					if(checkCollision(obj[y], objects[x])){
						
						if(obj[y].currentShield <= 0){
							if(obj[y].type[2]){
								obj[y].healthPartition = (obj[y].currentHp - objects[x].damage * Delta)/obj[y].maxHealth;
							}
							obj[y].currentHp -= objects[x].damage * Delta;
						}else{
							obj[y].shieldPartition = (obj[y].currentShield - objects[x].damage * Delta)/obj[y].maxShield;
							obj[y].currentShield -= objects[x].damage * Delta;
						}

						if(objects[x].currentShield <= 0){
							if(objects[x].type[2]){
								objects[x].healthPartition = (objects[x].currentHp - obj[y].damage * Delta)/objects[x].maxHealth;
							}
							objects[x].currentHp -= obj[y].damage * Delta;
						}else{
							objects[x].shieldPartition = (objects[x].currentShield - obj[y].damage * Delta)/objects[x].maxShield;
							objects[x].currentShield -= obj[y].damage * Delta;
						}
						
						obj[y].shieldTimer = 0;
						objects[x].shieldTimer = 0;
												
						if(obj[y].currentHp <= 0 && obj[y].type[1] !== "beam"){
							obj[y].alive = false;
							var expPos = [
											obj[y].pos[0]-(obj[y].explosion.size[0]-obj[y].size[0])/2,
											obj[y].pos[1]-(obj[y].explosion.size[1]-obj[y].size[1])/2
											]
							obj[y].explosion.spawn(expPos, Math.random() * Math.PI*2);
							if(objects[x].type[0] !== "player" && objects[x].type[0] == "playerBullet"){
								game.scoreBank += obj[y].worth;
							}
						}
						if(objects[x].currentHp <= 0 && objects[x].type[1] !== "beam"){
							objects[x].alive = false;
							var expPos = [
											objects[x].pos[0]-(objects[x].explosion.size[0]-objects[x].size[0])/2,
											objects[x].pos[1]-(objects[x].explosion.size[1]-objects[x].size[1])/2
											]
							
							objects[x].explosion.spawn(expPos, Math.random() * Math.PI*2);
							if(obj[y].type[0] !== "player" && obj[y].type[0] == "playerBullet"){
								game.scoreBank += objects[x].worth;
							}
						}
					}
				}
			}
		}
	}
};

function checkCollision(object1, object2){
	
	var obj1Center = object1.objectCenter,
		obj1Corners = object1.corners,
		obj1HitBox = object1.hitBoxSize;
				
	var obj2Center = object2.objectCenter,
		obj2Corners = object2.corners,
		obj2HitBox = object2.hitBoxSize;
		
	var vectP = [(obj1Corners[0][0] - obj1Corners[3][0])/obj1HitBox[0], (obj1Corners[0][1] - obj1Corners[3][1])/obj1HitBox[0]],
		vectQ = [(obj1Corners[1][0] - obj1Corners[0][0])/obj1HitBox[1], (obj1Corners[1][1] - obj1Corners[0][1])/obj1HitBox[1]],
		vectR = [(obj2Corners[0][0] - obj2Corners[3][0])/obj2HitBox[0], (obj2Corners[0][1] - obj2Corners[3][1])/obj2HitBox[0]],
		vectS = [(obj2Corners[1][0] - obj2Corners[0][0])/obj2HitBox[1], (obj2Corners[1][1] - obj2Corners[0][1])/obj2HitBox[1]];

	//drawAxes(obj1Corners[3], obj1Corners[0], obj2Corners[3], obj2Corners[0], vectP, vectQ, vectR, vectR, vectS);
		
	//var collisionOnP = objOnAxis(vectP, obj1Corners[3], obj2Corners, obj1HitBox[0], "#ff2eaf");
		
	//var collisionOnQ = objOnAxis(vectQ, obj1Corners[0], obj2Corners, obj1HitBox[1], "#ff2eaf");

	//var collisionOnR = objOnAxis(vectR, obj2Corners[3], obj1Corners, obj2HitBox[0], "#00e5ff");

	//var collisionOnS = collisionOnR = objOnAxis(vectR, obj2Corners[3], obj1Corners, obj2HitBox[0], "#00e5ff");
		
	if(objOnAxis(vectP, obj1Corners[3], obj2Corners, obj1HitBox[0], "#ff2eaf") && objOnAxis(vectQ, obj1Corners[0], obj2Corners, obj1HitBox[1], "#ff2eaf")
		&& objOnAxis(vectR, obj2Corners[3], obj1Corners, obj2HitBox[0], "#00e5ff") && objOnAxis(vectR, obj2Corners[3], obj1Corners, obj2HitBox[0], "#00e5ff")){
			return true;
	}else{
		return false;
	}
	
};

function drawAxes(cor13, cor10, cor23, cor20, vectP, vectQ, vectR, vectR, vectS){
	
	Context.strokeStyle = "blue";
	Context.beginPath();
	Context.moveTo(cor13[0] + vectP[0] * 2000, cor13[1] + vectP[1] * 2000);
	Context.lineTo(cor13[0] + vectP[0] * -4000, cor13[1] + vectP[1] * -4000);
	Context.stroke();
		
	Context.beginPath();
	Context.moveTo(cor10[0] + vectQ[0] * 2000, cor10[1] + vectQ[1] * 2000);
	Context.lineTo(cor10[0] + vectQ[0] * -4000, cor10[1] + vectQ[1] * -4000);
	Context.stroke();
	
	Context.fillStyle = "#00e5ff";
	Context.fillText("P", cor13[0] + vectP[0] * 150, cor13[1] + vectP[1] * 150);
	Context.fillText("Q", cor10[0] + vectQ[0] * -80, cor10[1] + vectQ[1] * -80);
		
	Context.strokeStyle = "red";
	Context.beginPath();
	Context.moveTo(cor23[0] + vectR[0] * 2000, cor23[1] + vectR[1] * 2000);
	Context.lineTo(cor23[0] + vectR[0] * -4000, cor23[1] + vectR[1] * -4000);
	Context.stroke();
		
	Context.beginPath();
	Context.moveTo(cor20[0] + vectS[0] * 2000, cor20[1] + vectS[1] * 2000);
	Context.lineTo(cor20[0] + vectS[0] * -4000, cor20[1] + vectS[1] * -4000);
	Context.stroke();
	
	Context.fillStyle = "#bf00ff";
	Context.fillText("R", cor23[0] + vectR[0] * 150, cor23[1] + vectR[1] * 150);
	Context.fillText("S", cor20[0] + vectS[0] * -80, cor20[1] + vectS[1] * -80);
};

function objOnAxis(axis, start, ends, side, style){
		
	var vect0 = [ends[0][0] - start[0], ends[0][1] - start[1]],
		vect1 = [ends[1][0] - start[0], ends[1][1] - start[1]],
		vect2 = [ends[2][0] - start[0], ends[2][1] - start[1]],
		vect3 = [ends[3][0] - start[0], ends[3][1] - start[1]];

	var vect0onAxis = (vect0[0] * axis[0] + vect0[1] * axis[1]),
		vect1onAxis = (vect1[0] * axis[0] + vect1[1] * axis[1]),
		vect2onAxis = (vect2[0] * axis[0] + vect2[1] * axis[1]),
		vect3onAxis = (vect3[0] * axis[0] + vect3[1] * axis[1]);
					
	var minMaxOnAxis = [vect0onAxis, vect1onAxis, vect2onAxis, vect3onAxis];
	
	var leftSide = [],
		rightSide = [];
	
	for(var i = 0; i < 4; i++){
		if(minMaxOnAxis[i] < 0){
			rightSide.push(minMaxOnAxis[i]);
			if(rightSide.length > 0){
				rightSide.sort(function(a,b){return a-b});
			}
		}else if(minMaxOnAxis[i] >= 0){
			leftSide.push(minMaxOnAxis[i]);
			if(leftSide.length > 0){
				leftSide.sort(function(a,b){return b-a});
			}
		}
	}
	
	//drawProj(ends, start, axis, vect0onAxis, vect1onAxis, vect2onAxis, vect3onAxis, style, minMaxOnAxis);
			
	if(rightSide.length === 0 && leftSide[3] < side){
		return true;
	}else if(leftSide.length < 4 && rightSide.length !== 4){
		return true;
	}else{
		return false;
	}

};

function drawProj(ends, start, axis, vect0onAxis, vect1onAxis, vect2onAxis, vect3onAxis, style){
	Context.strokeStyle = style;
	Context.beginPath();
	Context.moveTo(ends[0][0], ends[0][1]);
	Context.lineTo(start[0] + axis[0] * vect0onAxis, start[1] + axis[1] * vect0onAxis);
	Context.stroke();
	Context.beginPath();
	Context.moveTo(ends[1][0], ends[1][1]);
	Context.lineTo(start[0] + axis[0] * vect1onAxis, start[1] + axis[1] * vect1onAxis);
	Context.stroke();
	Context.beginPath();
	Context.moveTo(ends[2][0], ends[2][1]);
	Context.lineTo(start[0] + axis[0] * vect2onAxis, start[1] + axis[1] * vect2onAxis);
	Context.stroke();
	Context.beginPath();
	Context.moveTo(ends[3][0], ends[3][1]);
	Context.lineTo(start[0] + axis[0] * vect3onAxis, start[1] + axis[1] * vect3onAxis);
	Context.stroke();
	
	Context.fillText(Math.floor(vect0onAxis), start[0] + axis[0] * vect0onAxis, start[1] + axis[1] * vect0onAxis);
	Context.fillText(Math.floor(vect1onAxis), start[0] + axis[0] * vect1onAxis, start[1] + axis[1] * vect1onAxis);
	Context.fillText(Math.floor(vect2onAxis), start[0] + axis[0] * vect2onAxis, start[1] + axis[1] * vect2onAxis);
	Context.fillText(Math.floor(vect3onAxis), start[0] + axis[0] * vect3onAxis, start[1] + axis[1] * vect3onAxis);
};

function getItAll(){
	
	game.quadTree.clear();
	
	game.quadTree.insert(game.player.bulletPool1.getPool());
	game.quadTree.insert(game.player.bulletPool2.getPool());
	game.quadTree.insert(game.player.bulletPool3.getPool());
		
	for(var i = 0; i < game.level.enemyPool.length; i++){
		game.quadTree.insert(game.level.enemyPool[i].getPool());
		for(var e = 0; e < game.level.enemyPool[i].getDead().length; e++){
			game.quadTree.insert(game.level.enemyPool[i].getDead()[e].explosion);
		}
	}

	game.quadTree.insert(game.level.bulletPool);

	if(game.player.alive){
		game.quadTree.insert(game.player);
	}else if(!game.player.alive){
	game.quadTree.insert(game.player.explosion);
	}

	for(var t = 0; t < game.level.bulletPool.length; t++){
		game.quadTree.insert(game.level.bulletPool[t].explosion);
	}
	for(var b = 0; b < game.player.bulletPool1.getDead().length; b++){
		game.quadTree.insert(game.player.bulletPool1.getDead()[b].explosion);
	}
	for(var b = 0; b < game.player.bulletPool2.getDead().length; b++){
		game.quadTree.insert(game.player.bulletPool2.getDead()[b].explosion);
	}
	for(var b = 0; b < game.player.bulletPool3.getDead().length; b++){
		game.quadTree.insert(game.player.bulletPool3.getDead()[b].explosion);
	}
		
};

function QuadTree(boundBox, lvl){
	
	var maxObjects = 10,
		objects = [],
		level = lvl || 0,
		maxLevels = 5;
		
	this.bounds = boundBox || {x: 0, y: 0, width: 0, height: 0};
	this.nodes = [];
	
	this.clear = function(){
		objects = [];
		for(var i = 0; i < this.nodes.length; i++){
			this.nodes[i].clear();
		}
		this.nodes = [];
	}

	this.getAllobjects = function(returnedObjects){
		
		for(var i = 0; i < this.nodes.length; i++){
			this.nodes[i].getAllobjects(returnedObjects);
		}
		for(var i = 0, len = objects.length; i < len; i++){
			if(objects[i].alive){
				returnedObjects.push(objects[i]);
			}
		}
		
		return returnedObjects;
	}
	
	this.getCollidableObjects = function(returnedObjects){
		
		for(var i = 0; i < this.nodes.length; i++){
			this.nodes[i].getCollidableObjects(returnedObjects);
		}
		for(var i = 0, len = objects.length; i < len; i++){
			if(objects[i].alive && objects[i].type[1] !== "explosion" && !(
			objects[i].topLeftRightBottom[0] > Canvas.height + 200 ||
			objects[i].topLeftRightBottom[1] < -200 					||
			objects[i].topLeftRightBottom[2] > Canvas.width + 200 	||
			objects[i].topLeftRightBottom[3] < -200
			)){
				returnedObjects.push(objects[i]);
			}
		}
		
		return returnedObjects;
	}
	
	this.findObjects = function(returnedObjects, obj) {
		if(typeof obj === "undefined") {
			console.log("UNDEFINED OBJECT; PANIC!");
			return;
		}
		
		var index = this.getIndex(obj);
		
		if(index !== -1 && this.nodes.length && !(index instanceof Array)){
			this.nodes[index].findObjects(returnedObjects, obj);
		}else if(index !== -1 && this.nodes.length && index instanceof Array){
			for(var t = 0; t < this.nodes.length; t++){
				this.nodes[t].findObjects(returnedObjects, obj);
			}
		}
		for (var i = 0, len = objects.length; i < len; i++) {
			if(objects[i].alive && objects[i].type[1] !== "explosion"){
				returnedObjects.push(objects[i]);
			}
		}
		return returnedObjects;
	};
	
	this.insert = function(obj) {
		if (typeof obj === "undefined"){
			return;
		}
		if (obj instanceof Array) {
			for (var i = 0, len = obj.length; i < len; i++) {
				this.insert(obj[i]);
			}
			return;
		}
		if (this.nodes.length) {
			var index = this.getIndex(obj);
			if (index !== -1 && !(index instanceof Array)){
				this.nodes[index].insert(obj);
				return;
			}else if(index !== -1 && index instanceof Array){
				for(var q = 0; q < index.length; q++){
					this.nodes[q].insert(obj);
				}
			}
		}
		objects.push(obj);
		if (objects.length > maxObjects && level < maxLevels) {
			if (this.nodes[0] == null){
				this.split();
			}
			var i = 0;
			while (i < objects.length) {
				var index = this.getIndex(objects[i]);

				if (index !== -1){
					if(index instanceof Array){
						for(var c = 0; c < this.nodes.length; c++){
							this.nodes[c].insert(objects[i]);
						}
						objects.splice(i,1);
					}else{
						this.nodes[index].insert((objects.splice(i,1))[0]);
					}
				}else{
					i++;
				}
			}
		}
	};
	
	this.getIndex = function(obj) {
				
		var index = -1;
		var verticalMidpoint = this.bounds.x + this.bounds.width/2;
		var horizontalMidpoint = this.bounds.y + this.bounds.height/2;
		var topQuadrant = (obj.topLeftRightBottom[3] <= horizontalMidpoint);
		var bottomQuadrant = (obj.topLeftRightBottom[0] > horizontalMidpoint);
		if (obj.topLeftRightBottom[2] <= verticalMidpoint){
			if (topQuadrant) {
				index = 1;
			}
			else if (bottomQuadrant) {
				index = 2;
			}
		}else if (obj.topLeftRightBottom[1] > verticalMidpoint){
			if (topQuadrant) {
				index = 0;
			}
			else if (bottomQuadrant) {
				index = 3;
			}
		}
		if(obj.type[1] == "beam"){
			index = [0,1,2,3];
		}
		return index;
	};
	
	this.split = function() {							//		|
		var subWidth = (this.bounds.width/2) | 0;		//	 1	|  0
		var subHeight = (this.bounds.height/2) | 0;		//	----|----
		this.nodes[0] = new QuadTree({					//	 2	|  3
			x: this.bounds.x + subWidth,				//		|
			y: this.bounds.y,
			width: subWidth,
			height: subHeight
		}, level+1);
		this.nodes[1] = new QuadTree({
			x: this.bounds.x,
			y: this.bounds.y,
			width: subWidth,
			height: subHeight
		}, level+1);
		this.nodes[2] = new QuadTree({
			x: this.bounds.x,
			y: this.bounds.y + subHeight,
			width: subWidth,
			height: subHeight
		}, level+1);
		this.nodes[3] = new QuadTree({
			x: this.bounds.x + subWidth,
			y: this.bounds.y + subHeight,
			width: subWidth,
			height: subHeight
		}, level+1);
	};
	
};