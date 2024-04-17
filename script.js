// Global variables and constants

let airplane = document.getElementById("airplane")
let gameSpace = document.getElementById("gameSpace")
let isPressed = {'ArrowLeft' : false, 'ArrowRight' : false}
let horizontalPos = 330
let scoreIncrease
let obstacleCreation
let heightDecrease
let isMoving
let isPaused = true
const RIGHT_BORDER = 650
const BOTTOM_PIXELS = 550
const COLLIDING_AREA = 500
const OBJECT_WIDTH = 50

// Game states

function startGame() {
	document.getElementById("startButton").remove()
	let infoBar = document.getElementById("infoBar")
	let pauseButton = document.createElement('button')
	pauseButton.id = "pauseGame"
	pauseButton.textContent = "Pause"
	pauseButton.onclick = pauseGame
	infoBar.appendChild(pauseButton)
	document.addEventListener("keydown", checkKeyPressed)
	document.addEventListener("keyup", stopMoving)
	document.addEventListener('visibilitychange', pauseTheGame)
	pauseGame();
}

function pauseGame() {
    if (isPaused) {
        scoreIncrease = setInterval(increaseScore, 1000)
        obstacleCreation = setInterval(createObstacle, 800)
        heightDecrease = setInterval(decreaseHeight, 10)
		isMoving = setInterval(movePlayer, 30)
		isPaused = false
		document.getElementById("pauseGame").textContent = "Pause"
    } else {
        clearInterval(scoreIncrease)
        clearInterval(obstacleCreation)
        clearInterval(heightDecrease)
		clearInterval(isMoving)
		isPaused = true
		document.getElementById("pauseGame").textContent = "Resume"
    }
}

function gameOver() {
	pauseGame();
	document.getElementById("pauseGame").remove()
	let infoBar = document.getElementById("infoBar")
	let result = document.getElementById("scoreText")
	result.textContent = `Game over. Your score is `
	let restart = document.createElement('button')
	restart.id = "pauseGame"
	restart.textContent = "Restart"
	restart.onclick = reloadPage
	infoBar.appendChild(restart)
}

function pauseTheGame() {
    if (document.visibilityState === 'hidden') {
        if (!isPaused) {
            pauseGame()
        }
    }
}

function reloadPage() {
	location.reload()
}

// Game updates

function createObstacle() {
	console.log("obstacle spawned")
	let obstacleSpawn = Math.random() * RIGHT_BORDER
	let obstacleVerticalPosition = 50
	let obstacle = document.createElement('div')
	obstacle.id = `${obstacleSpawn}`
	obstacle.className = "obstacle"
	obstacle.style.top = `${obstacleVerticalPosition}px`
	obstacle.style.left = `${obstacleSpawn}px`
	gameSpace.appendChild(obstacle)
}

function decreaseHeight() {
    let obstacles = document.querySelectorAll('.obstacle')
    obstacles.forEach(function(obstacle) {
        let height = obstacle.style.top
        height = height.slice(0, -2)
        height = Number(height);
        if (height < BOTTOM_PIXELS) {
            height += 1
            obstacle.style.top = `${height}px`
        } else {
            obstacle.remove()
        }
		let obstaclePos = obstacle.style.left
		obstaclePos = obstaclePos.slice(0, -2)
		obstaclePos = Number(obstaclePos);
		let airplanePos = airplane.style.left
		airplanePos = airplanePos.slice(0, -2)
		airplanePos = Number(airplanePos);
		if (height > COLLIDING_AREA && obstaclePos > airplanePos - OBJECT_WIDTH &&
			obstaclePos < airplanePos + OBJECT_WIDTH) {
			gameOver()
		}
    });
}

function movePlayer() {
	if (!isPaused){
		if (isPressed['ArrowLeft'] && horizontalPos > 0 && !isPaused) {
			horizontalPos += -5
		}
		if (isPressed['ArrowRight'] && horizontalPos < RIGHT_BORDER && !isPaused) {
			horizontalPos += 5
		}
		airplane.style.left = `${horizontalPos}px`
	}
}

function checkKeyPressed(e) {
    switch(e.key) {
        case 'ArrowLeft':
            isPressed['ArrowLeft'] = true
            break;
        case 'ArrowRight':
            isPressed['ArrowRight'] = true
            break;
    }
}

function stopMoving(e) {
    switch(e.key) {
        case 'ArrowLeft':
            isPressed['ArrowLeft'] = false
            break;
        case 'ArrowRight':
            isPressed['ArrowRight'] = false
            break;
    }
}

function increaseScore() {
	let scoreString = document.getElementById("score")
	score = Number(scoreString.innerText)
	scoreString.innerText = `${++score}`
}