document.addEventListener("keydown",keyPush);
ctx = gc.getContext("2d");
scoreDisplay = document.getElementById("score");
highScore = 0;
trail=[];
gs=tc=22; //field size

//sounds
const pauseSound = document.querySelector("#p");
const gameOverSound = document.querySelector("#ds");
const appleSound = document.querySelector("#dr");

timeInterval = 1000/20;
Time = setInterval (game, timeInterval);
reset();

function reset() {
    score = 0;
    px = py = 10; // player starting point
    ax = ay = 15; // apple starting point
    tail = 5; // tail length
    xv = yv = 0;  // velocity
    scoreDisplay.innerHTML = 0; // reset score
    tmpX = px;
    tmpY = py;
    isMoving = false;
    gamePaused = false;
    blockingKeys = false;
    document.getElementById("pauseState").innerHTML = "Running".fontcolor("blue");
}

function game() {
    movingCheck();
    collisonCheck();
    field();
    apple();
    snake();
    velocity();
    blockKeys();
}

function movingCheck() {
    if (xv !== 0 || yv !== 0) {
        setTimeout(() => {
            isMoving = true;
        }, 100); 
    }
}

function addScore(n) {
    tail++;
    score += n;
    scoreDisplay.innerHTML = score;
}

function pauseGame(){
    if (!gamePaused) {
        clearInterval(Time);
        gamePaused = true;
        document.getElementById("pauseState").innerHTML = "Paused".fontcolor("yellow");
    }
    else if (gamePaused) {
        Time = setInterval(game, timeInterval);
        gamePaused = false;
        document.getElementById("pauseState").innerHTML = "Running".fontcolor("blue");
    }
    pauseSound.play();
}

function gameover() {
    gameOverSound.play();
    if(score>highScore){
        highScore=score;
        document.getElementById("Hscore").innerHTML = highScore;
    }
    reset();
}

function collisonCheck() {
    // grid collision check
    if(px<0)    { gameover();  }
    if(px>tc-1) { gameover();  }
    if(py<0)    { gameover();  }
    if(py>tc-1) { gameover();  }
}

function velocity() {
    px += xv; //moving horizontaly
    py += yv; //moving verticaly
}

function field() {
    ctx.fillStyle = "grey";
    ctx.fillRect(0, 0, gc.width, gc.height);
}

function apple() {
    if(ax==px && ay==py) {
        addScore(1);
        appleSound.play();
        ax=Math.floor(Math.random()*tc);
        ay=Math.floor(Math.random()*tc);
    }
    ctx.fillStyle="red";
    ctx.fillRect(ax*gs,ay*gs,gs-2,gs-2);
}

function snake() {
    ctx.fillStyle="green";
    for(var i=0; i<trail.length; i++) {
        ctx.fillRect(trail[i].x*gs, trail[i].y*gs, gs-2, gs-2);
        if( (trail[i].x==px && trail[i].y==py) && isMoving==true) {
            gameover();
        }
    }
    trail.push({x:px,y:py});
    while(trail.length>tail) {
        trail.shift();    
    }
}

// Blocking keys to prevent scrolling
var keys = {};
window.addEventListener("keydown",
function(e){
    keys[e.keyCode] = true;
    switch(e.keyCode){
        case 37: case 39: case 38:  case 40: // Arrow keys
        case 32: e.preventDefault(); break; // Space
        default: break; // do not block other keys
    }
},false);

// Input keys
function keyPush(evt) {
    switch(evt.keyCode) {
        case 37: //left arrow
            if(xv==0 && !blockingKeys){
                tmpX=px;xv=-1;yv=0;blockingKeys=true;
            }
            break;
        case 38: //up arrow
            if(yv==0 && !blockingKeys){
                tmpY=py;xv=0;yv=-1;blockingKeys=true;
            }
            break;
        case 39: //right arrow
            if(xv==0 && !blockingKeys){
                tmpX=px;xv=1;yv=0;blockingKeys=true;
            }
            break;
        case 40: //down arrow
            if(yv==0 && !blockingKeys){
                tmpY=py;xv=0;yv=1;blockingKeys=true;
            }
            break;
        case 27: //Esc
            pauseGame();
            break;
    }
}

function blockKeys() {
    if(tmpX!=px){
        blockingKeys = false;
    }
    if (tmpY!=py){
        blockingKeys = false;
    }
}
