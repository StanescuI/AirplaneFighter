// Global variables and constants

const RIGHT_BORDER = 650;
const BOTTOM_PIXELS = 550;
const COLLIDING_AREA = 500;
const OBJECT_WIDTH = 50;
let airplane = document.getElementById("airplane");
let gameSpace = document.getElementById("gameSpace");
let difficulyText = document.getElementById("difficulty");
let isPressed = {"ArrowLeft" : false, "ArrowRight" : false, "ArrowUp" : false};
let horizontalPos = 350;
let bulletWidth = 10;
let bulletHeight = 15;
let activeBullets = 0;
let scoreIncrease;
let timeScore = 0;
let dodgeScore = 0;
let shootScore = 0;
let obstacleCreation;
let heightDecrease;
let isMoving;
let isPaused = true;
let difficultySpike = 10;
let obstacleSpawnSpeed = 80;
let gameTime = 0;
let difficultyThreshold = 300;
let difficultyLevel = 1;

// Game states

function gameType(nr) {
    if (nr === 1) {
        timeScore = 1;
    } else if (nr === 2) {
        dodgeScore = 1;
    } else {
        shootScore = 1;
    }
}

function startGame() {
    document.getElementById("startButton").remove();
    document.getElementById("startButton2").remove();
    document.getElementById("startButton3").remove();
    let infoBar = document.getElementById("infoBar");
    let pauseButton = document.createElement("button");
    pauseButton.id = "pauseGame";
    pauseButton.textContent = "Pause";
    pauseButton.onclick = pauseGame;
    infoBar.appendChild(pauseButton);
    document.addEventListener("keydown", checkKeyPressed);
    document.addEventListener("keyup", stopMoving);
    document.addEventListener("visibilitychange", pauseTheGame);
    pauseGame();
}

function pauseGame() {
    if (isPaused) {
        scoreIncrease = setInterval(increaseScore, 1000);
        obstacleCreation = setInterval(createObstacle, obstacleSpawnSpeed * difficultySpike);
        heightDecrease = setInterval(decreaseHeight, difficultySpike);
        collisionInterval = setInterval(bulletCollision, 10);
        gameSpikeInterval = setInterval(gameSpike, 10);
        isMoving = setInterval(movePlayer, 30);
        isPaused = false;
        document.getElementById("pauseGame").textContent = "Pause";
    } else {
        clearInterval(scoreIncrease);
        clearInterval(obstacleCreation);
        clearInterval(heightDecrease);
        clearInterval(collisionInterval);
        clearInterval(isMoving);
        clearInterval(gameSpikeInterval);
        isPaused = true;
        document.getElementById("pauseGame").textContent = "Resume";
    }
}

function gameOver() {
    pauseGame();
    document.getElementById("pauseGame").remove();
    let infoBar = document.getElementById("infoBar");
    let result = document.getElementById("scoreText");
    result.textContent = "Game over. Your score is ";
    let restart = document.createElement("button");
    restart.id = "pauseGame";
    restart.textContent = "Restart";
    restart.onclick = reloadPage;
    infoBar.appendChild(restart);
}

function pauseTheGame() {
    if (document.visibilityState === "hidden" && !isPaused) {
        pauseGame();
    }
}

function reloadPage() {
    location.reload();
}

// Game updates

function shootObstacle() {
    let bullet = document.createElement("div");
    bullet.id = `${Math.random() * 5}`;
    bullet.classList.add("bullets");
    bullet.style.left = `${horizontalPos + (OBJECT_WIDTH / 2 - bulletWidth / 2)}px`;
    bullet.style.top = `${COLLIDING_AREA}px`;
    gameSpace.appendChild(bullet);
    ++activeBullets;
}

function gameSpike() {
    if (difficultyThreshold < gameTime && difficultySpike > 2) {
        --difficultySpike;
        gameTime = 0;
        pauseGame();
        pauseGame();
        ++difficultyLevel;
        difficulyText.textContent = `Difficulty : ${difficultyLevel}`;
    }
    ++gameTime;
}

function createObstacle() {
    let obstacleSpawn = Math.random() * RIGHT_BORDER;
    let obstacleVerticalPosition = 50;
    let obstacle = document.createElement("div");
    obstacle.id = obstacleSpawn;
    obstacle.className = "obstacle";
    obstacle.style.top = `${obstacleVerticalPosition}px`;
    obstacle.style.left = `${obstacleSpawn}px`;
    gameSpace.appendChild(obstacle);
}

function bulletCollision() {
    let bullets = document.querySelectorAll(".bullets");
    bullets.forEach(function(bullet) {
        let bulletPos = bullet.style.top;
        bulletPos = bulletPos.slice(0, -2);
        bulletPos = Number(bulletPos);
        let bulletLeft = bullet.style.left;
        bulletLeft = bulletLeft.slice(0, -2);
        bulletLeft = Number(bulletLeft);
        if (bulletPos > 0 + OBJECT_WIDTH) {
            bulletPos -= 1;
            bullet.style.top = `${bulletPos}px`
        } else {
            bullet.remove()
            --activeBullets;
        }
        let obstacles = document.querySelectorAll(".obstacle");
        obstacles.forEach(function(obstacle) {
            let height = obstacle.style.top;
            height = height.slice(0, -2);
            height = Number(height);
            let width = obstacle.style.left;
            width = width.slice(0, -2);
            width = Number(width);
            if (bulletPos > height && bulletPos < height + OBJECT_WIDTH &&
                bulletLeft > width && bulletLeft < width + OBJECT_WIDTH) {
                bullet.remove();
                --activeBullets;
                obstacle.remove();
                let scoreString = document.getElementById("score");
                let currentScore = Number(scoreString.innerText);
                scoreString.innerText = `${currentScore + shootScore}`;
            }
        })
    });
}

function decreaseHeight() {
    let obstacles = document.querySelectorAll(".obstacle");
    obstacles.forEach(function(obstacle) {
        let height = obstacle.style.top;
        height = height.slice(0, -2);
        height = Number(height);
        if (height < BOTTOM_PIXELS) {
            height += 1;
            obstacle.style.top = `${height}px`;
        } else {
            obstacle.remove();
            let scoreString = document.getElementById("score");
            let currentScore = Number(scoreString.innerText);
            scoreString.innerText = `${currentScore + dodgeScore}`;
        }
        let obstaclePos = obstacle.style.left;
        obstaclePos = obstaclePos.slice(0, -2);
        obstaclePos = Number(obstaclePos);
        let airplanePos = airplane.style.left;
        airplanePos = airplanePos.slice(0, -2);
        airplanePos = Number(airplanePos);
        if (height > COLLIDING_AREA && obstaclePos > airplanePos - OBJECT_WIDTH &&
            obstaclePos < airplanePos + OBJECT_WIDTH) {
            gameOver();
        }
    });
}

function movePlayer() {
    if (isPressed["ArrowLeft"] && horizontalPos > 0 && !isPaused) {
        horizontalPos += -5;
    }
    if (isPressed["ArrowRight"] && horizontalPos < RIGHT_BORDER && !isPaused) {
        horizontalPos += 5;
    }
    airplane.style.left = `${horizontalPos}px`;
}

function checkKeyPressed(e) {
    if(e.key === "ArrowLeft") {
        isPressed["ArrowLeft"] = true;
    }
    if (e.key === "ArrowRight") {
        isPressed["ArrowRight"] = true;
    }
    if (e.key === "ArrowUp") {
        if (activeBullets < 3 && shootScore === 1) {
            isPressed["ArrowUp"] = true;
            shootObstacle();
        }
    }
}

function stopMoving(e) {
    if(e.key === "ArrowLeft") {
        isPressed["ArrowLeft"] = false;
    }
    if (e.key === "ArrowRight") {
        isPressed["ArrowRight"] = false;
    }
}

function increaseScore() {
    let scoreString = document.getElementById("score");
    let currentScore = Number(scoreString.innerText);
    scoreString.innerText = `${currentScore + timeScore}`;
}
