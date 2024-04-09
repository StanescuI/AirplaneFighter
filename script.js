let airPlane = document.getElementById("airplane");
let horizontalPos = 50;
let gameSpace = document.getElementById("gameSpace");
const RIGHT_BORDER = 93;
const BOTTOM_PIXELS = 550;
document.addEventListener("keydown", moveHorizontally);

function moveHorizontally(e) {
var keyCode = e.keyCode;
    if(keyCode== 37 && horizontalPos > 0) {
        --horizontalPos;
        airPlane.style.left = `${horizontalPos}%`;
    } else if (keyCode== 39 && horizontalPos < RIGHT_BORDER) {
        ++horizontalPos;
        airPlane.style.left = `${horizontalPos}%`;
    }
}

setInterval(createObstacle, 1000);
setInterval(decreaseHeight, 10);

function createObstacle() {
	console.log("obstacle spawned");
	let obstacleSpawn = Math.random() * RIGHT_BORDER;
	let obstacleVerticalPosition = 0;
	let obstacle = document.createElement('div');
	obstacle.id = `${obstacleSpawn}`;
	obstacle.className = "obstacle";
	obstacle.style.top = `${obstacleVerticalPosition}%`;
	obstacle.style.left = `${obstacleSpawn}%`;
	gameSpace.appendChild(obstacle);
}

function decreaseHeight() {
	thing = document.querySelectorAll('.obstacle');
	thing.forEach(function(obstacle) {
		obstacle.style.top = `${reduceHeight(obstacle)}px`;
	});
}

function reduceHeight(obstacle) {
	let height = obstacle.style.top;
	height = height.slice(0, -2);
	height = Number(height);
	if (height < BOTTOM_PIXELS) {
		height += 1;
		return height;
	} else {
		obstacle.remove();
	}
}