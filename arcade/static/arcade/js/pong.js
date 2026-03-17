const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballDX = 4;
let ballDY = 4;
let ballRadius = 10;

// paddles
let paddleHeight = 100;
let paddleWidth = 10;
let paddleSpeed = 8;
let leftPaddleY = (canvas.height - paddleHeight) / 2;
let rightPaddleY = (canvas.height - paddleHeight) / 2;

// scores
let leftScore = 0;
let rightScore = 0;

// key states
let wPressed = false;
let sPressed = false;
let upPressed = false;
let downPressed = false;

// prevent scroll
window.addEventListener("keydown", function(e) {
    if(["ArrowUp","ArrowDown","Space"].indexOf(e.code) > -1) {
        e.preventDefault();
    }
}, false);

document.addEventListener("keydown", (e) => {
    if(e.key == "w" || e.key == "W") wPressed = true;
    if(e.key == "s" || e.key == "S") sPressed = true;
    if(e.key == "ArrowUp") upPressed = true;
    if(e.key == "ArrowDown") downPressed = true;
});

document.addEventListener("keyup", (e) => {
    if(e.key == "w" || e.key == "W") wPressed = false;
    if(e.key == "s" || e.key == "S") sPressed = false;
    if(e.key == "ArrowUp") upPressed = false;
    if(e.key == "ArrowDown") downPressed = false;
});

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw Center Net
    ctx.beginPath();
    ctx.setLineDash([10, 15]);
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.closePath();
    
    // Draw Scores
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.font = "40px 'Press Start 2P', monospace";
    ctx.fillText(leftScore, canvas.width / 4, 80);
    ctx.fillText(rightScore, 3 * canvas.width / 4, 80);

    // Draw Ball
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = "#fff";
    ctx.shadowBlur = 10;
    ctx.shadowColor = "#fff";
    ctx.fill();
    ctx.shadowBlur = 0; // reset
    ctx.closePath();

    // Draw Left Paddle (Neon Pink)
    ctx.fillStyle = "var(--neon-pink)";
    ctx.shadowBlur = 10;
    ctx.shadowColor = "var(--neon-pink)";
    ctx.fillRect(10, leftPaddleY, paddleWidth, paddleHeight);
    
    // Draw Right Paddle (Neon Blue)
    ctx.fillStyle = "var(--neon-blue)";
    ctx.shadowBlur = 10;
    ctx.shadowColor = "var(--neon-blue)";
    ctx.fillRect(canvas.width - paddleWidth - 10, rightPaddleY, paddleWidth, paddleHeight);
    ctx.shadowBlur = 0;

    // Ball Wall Collision (Top/Bottom)
    if(ballY + ballDY > canvas.height - ballRadius || ballY + ballDY < ballRadius) {
        ballDY = -ballDY;
    }
    
    // Left Paddle Collision
    if(ballX - ballRadius < 10 + paddleWidth && ballY > leftPaddleY && ballY < leftPaddleY + paddleHeight) {
        ballDX = -ballDX;
        // Increase speed slightly
        ballDX *= 1.05;
    }
    
    // Right Paddle Collision
    if(ballX + ballRadius > canvas.width - paddleWidth - 10 && ballY > rightPaddleY && ballY < rightPaddleY + paddleHeight) {
        ballDX = -ballDX;
        // Increase speed slightly
        ballDX *= 1.05;
    }
    
    // Scoring
    if(ballX < 0) {
        rightScore++;
        if (rightScore >= 20) {
            alert("Player 2 (Right) Wins!");
            document.location.reload();
            return;
        }
        resetBall();
    } else if(ballX > canvas.width) {
        leftScore++;
        if (leftScore >= 20) {
            alert("Player 1 (Left) Wins!");
            document.location.reload();
            return;
        }
        resetBall();
    }

    // Move Paddles
    if (wPressed && leftPaddleY > 0) leftPaddleY -= paddleSpeed;
    if (sPressed && leftPaddleY < canvas.height - paddleHeight) leftPaddleY += paddleSpeed;
    if (upPressed && rightPaddleY > 0) rightPaddleY -= paddleSpeed;
    if (downPressed && rightPaddleY < canvas.height - paddleHeight) rightPaddleY += paddleSpeed;

    ballX += ballDX;
    ballY += ballDY;
    requestAnimationFrame(draw);
}

function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    // reset speed and launch in random direction
    let dir = Math.random() > 0.5 ? 1 : -1;
    ballDX = 4 * dir;
    ballDY = 4 * (Math.random() > 0.5 ? 1 : -1);
}

draw();