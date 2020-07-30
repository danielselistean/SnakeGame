let canvas = document.getElementById('snake');
let context = canvas.getContext('2d');
let box = 28;
let snake = [];
// snake starts in the midle of canvas
snake[0] = {
    x: 8 * box,
    y: 8 * box
}
let direction; // the game is onPause until the user press one of the movement key
let food = {
    x: Math.floor(Math.random() * 15 + 1) * box,
    y: Math.floor(Math.random() * 15 + 1) * box
}
let score = 0;
let level = 1;
let speed = 200;
let border = false;
let over = false;
let black = false;

let content = document.getElementById('content');
let btnScore = document.getElementById('btnScore');
let btnLevel = document.getElementById('btnLevel');
let btnBorder = document.getElementById('btnBorder');
let btnTheme = document.getElementById('btnTheme');

let spanLevel = document.getElementById('spanLevel');
let spanBorder = document.getElementById('spanBorder');
let spanScore = document.getElementById('spanScore');
let spanTheme = document.getElementById('spanTheme');

let gameover = document.getElementById('gameover');

btnScore.onclick = function () {
    if (over) {
        window.location.reload();
    }
}

btnBorder.onclick = function () {
    if (!over) {
        if (!border) {
            border = true;
            canvas.classList.add('border');
            spanBorder.innerHTML = 'Yes';
        } else {
            border = false;
            canvas.classList.remove('border');
            spanBorder.innerHTML = 'No';
        }
    }
}

btnLevel.onclick = function () {
    if (!over) {
        if (level < 10) {
            level++;
            speed = speed - 12;
        } else if (level == 10) {
            level = 1;
            speed = 200;
        }
        if (level != 10) {
            spanLevel.innerHTML = level;
        } else {
            spanLevel.innerHTML = level + "!";
        }
        clearInterval(game);
        game = setInterval(startGame, speed);
    }
}

btnTheme.onclick = function () {
    if (!black) {
        black = true;
        content.classList.add('black');
        spanTheme.innerHTML = 'Black';
    } else {
        black = false;
        content.classList.remove('black');
        spanTheme.innerHTML = 'White';
    }
}

function createBG() {
    context.fillStyle = 'lightgreen';
    context.fillRect(0, 0, 16 * box, 16 * box);
}

function createSnake() {
    for (i = 0; i < snake.length; i++) {
        context.fillStyle = 'green';
        context.fillRect(snake[i].x, snake[i].y, box, box)
        context.strokeStyle = 'lightgreen';
        context.strokeRect(snake[i].x, snake[i].y, box, box)
    }
}

function drawFood() {
    context.fillStyle = "red";
    context.fillRect(food.x, food.y, box, box);
    context.strokeStyle = 'lightgreen';
    context.strokeRect(food.x, food.y, box, box)
}

document.addEventListener('keydown', update);

function update(event) {
    if (!over) {
        if (event.keyCode == 37 && direction != "right") direction = "left";
        if (event.keyCode == 38 && direction != "down") direction = "up";
        if (event.keyCode == 39 && direction != "left") direction = "right";
        if (event.keyCode == 40 && direction != "up") direction = "down";
    }
}

function startGame() {

    if (!border) {
        // without border - if the snake reaches the end of the canvas it comes out and enters on the opposite side;
        if (snake[0].x > 15 * box && direction !== "left") snake[0].x = 0;
        if (snake[0].x < 0 && direction != "right") snake[0].x = 15 * box;
        if (snake[0].y > 15 * box && direction != "up") snake[0].y = 0;
        if (snake[0].y < 0 && direction != "down") snake[0].y = 15 * box;
    } else {
        //with border - if the snake head (snake[0]) touch de border => game over !
        if (snake[0].x > 15 * box) gameOver();
        if (snake[0].x < 0) gameOver();
        if (snake[0].y > 15 * box) gameOver();
        if (snake[0].y < 0) gameOver();
    }


    // if the snake had touch the body => game over !
    for (i = 1; i < snake.length; i++) {
        if (snake[0].x == snake[i].x && snake[0].y == snake[i].y) gameOver();
    }

    createBG();
    createSnake();
    drawFood();

    // snake head position ;
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    // snake mouvement ;
    if (direction == "right") snakeX += box;
    if (direction == "left") snakeX -= box;
    if (direction == "up") snakeY -= box;
    if (direction == "down") snakeY += box;

    // growing of the snake
    if (snakeX != food.x || snakeY != food.y) {

        //if the snake's position is different from the food, it continues to move (removing an item from the array).

        snake.pop();
    } else {

        //otherwise, do not remove the item from the array (increase in size) and the food changes to another random position

        food.x = Math.floor(Math.random() * 15 + 1) * box;
        food.y = Math.floor(Math.random() * 15 + 1) * box;

        score++;
        spanScore.innerHTML = score;
    }

    let newHead = {
        x: snakeX,
        y: snakeY
    }

    snake.unshift(newHead);
}

function gameOver() {
    clearInterval(game);        // stop movement;
    over = true;                 // define the game is over (to stop the other buttons from working);
    gameover.style.display = "flex";
}

let game = setInterval(startGame, speed);