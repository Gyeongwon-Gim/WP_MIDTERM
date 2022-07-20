var canvas = document.getElementById('gameCanvas');
var ctx = canvas.getContext('2d');

//오디오 객체 선언
var audio_themeMusic = new Audio('src/sound/Theme_music.mp3');
var audio_bullet = new Audio('src/sound/Throwing fireball.wav');
    audio_bullet.volume=0.03;
var audio_ship_collision = new Audio('src/sound/smw_powerdown.wav');
    audio_ship_collision.volume=0.07;
var audio_explosion = new Audio('src/sound/Stomp.wav');
    audio_explosion.volume=0.07;
var audio_gameover = new Audio('src/sound/GameOver.wav');
    audio_gameover.volume=0.7;
;
//start 버튼을 누르면 화면이 전환된다.
var soundButton_off = document.getElementById('soundButton_off');
var soundButton_on = document.getElementById('soundButton_on');

var rightPressed = false;
var leftPressed = false;
var upPressed = false;
var downPressed = false;
var spacePressed = false;

var kill = 0;   

var fireImg = new Image();
fireImg.src = "src/imgs/explosion.png";

//우주선 객체 선언
var shipSize = 80;
var shipImg = new Image();
shipImg.src = "src/imgs/spaceship.png";
var ship = {
    x: (canvas.width - shipSize) / 2,
    y: canvas.height - shipSize,
    w: shipSize,
    h: shipSize,
    radius: shipSize/2
};

//적 객체 선언
var enemySize = 60;
var enemyImg = new Image();
enemyImg.src = "src/imgs/cute_enemy0.png";
var enemyCount = 7;
var enemyStatus = [];
for (var i = 0; i < enemyCount; i++) {
    enemyStatus[i] = {
        x: 0,
        y: 0,
        w: enemySize,
        h: enemySize,
        img: enemyImg,
        status: 0
    };
}

var enemySize2 = 60;
var enemyImg2 = new Image();
enemyImg2.src = "src/imgs/cute_enemy1.png";
var enemyCount2 = 7;
var enemyStatus2 = [];
for (var i = 0; i < enemyCount2; i++) {
    enemyStatus2[i] = {
        x: 0,
        y: 0,
        w: enemySize2,
        h: enemySize2,
        img: enemyImg2,
        status: 0
    };
}

//총알 객체 선언
var bulletSize = 10;
var bulletCount = 50;
var bulletStatus = [];
for (var i = 0; i < bulletCount; i++) {
    bulletStatus[i] = {
        x: ship.x,
        y: canvas.height - bulletSize,
        w: bulletSize-4,
        h: bulletSize*3,
        status: 0
    };
}


document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);

function keyDownHandler(e) {
    if (e.code == 'ArrowRight') {
        rightPressed = true;
        console.log("R");
    } 
    else if (e.code == 'ArrowLeft') {
        leftPressed = true;
        console.log("L");
    }
    else if (e.code == 'ArrowUp') {
        upPressed = true;
        console.log("Up_d");
    }
    else if (e.code == 'ArrowDown') {
        downPressed = true;
        console.log("Down_d");
    }
    
    if (e.code == "Space") {
        spacePressed = true;
        console.log("Space");
    }
}

function keyUpHandler(e) {
    if (e.code == 'ArrowRight') {
        rightPressed = false;
    }
    else if (e.code == 'ArrowLeft') {
        leftPressed = false;
    }
    else if (e.code == 'ArrowUp') {
        upPressed = false;
        console.log("Up_u");
    }
    else if (e.code == 'ArrowDown') {
        downPressed = false;
        console.log("Down_u");
    }

    if (e.code == "Space") {
        spacePressed = false;
    }
}

function snd_on() {
    audio_themeMusic.volume = 0.1;
    soundButton_on.style.display= 'none';
    soundButton_off.style.display = 'block';
}
function snd_off(){
    audio_themeMusic.volume = 0;
    soundButton_on.style.display = 'block';
    soundButton_off.style.display = 'none';
}

function startGame() {
    isPlay = true;
    start = document.getElementById('start');
    start.style.display = 'none';
    draw();

    audio_themeMusic.volume=0.1;
    audio_themeMusic.play();
}

function gameOver(){
    ctx.clearRect(ship.x, ship.y, ship.w, ship.h); 
        audio_themeMusic.pause();
        audio_gameover.play();
        score.style.display='none';
        gameover = document.getElementById('GameOver');
        gameover.style.display = 'inline-block';
        document.getElementById("final_score").innerHTML = "Score : " +kill*10;
}

//충돌 감지 함수
function checkCrash(item1, item2) {
        item1.rx = item1.x + item1.w;
        item1.by = item1.y + item1.h; 
        item2.rx = item2.x + item2.w;
        item2.by = item2.y + item2.h;
        if ((item1.x >= item2.x && item1.x <= item2.rx) ||
            (item1.rx >= item2.x && item1.rx <= item2.rx)) {
            if ((item1.y >= item2.y && item1.y <= item2.by) ||
                (item1.by >= item2.y && item1.by <= item2.by)) {
                return 1;
            }
        }
        return 0;
    }

// 우주선과 적1 충돌 감지
function checkEnemyCollision1() {
    for (var i = 0; i < enemyCount; i++) {
        var enemy = enemyStatus[i];
        var collision = checkCrash(ship, enemyStatus[i]);
        if (enemy.status == 0) {
            continue;
        }
        if (collision){
            enemy.status = 0;
            console.log("crash");
            ctx.drawImage(fireImg, ship.x, ship.y, ship.w, ship.h);
            audio_ship_collision.play();
            isPlay = false;
        }
    }
}
// 우주선과 적2 충돌 감지
function checkEnemyCollision2() {
    for (var i = 0; i < enemyCount2; i++) {
        var enemy = enemyStatus2[i];
        var collision = checkCrash(ship, enemyStatus2[i]);
        if (enemy.status == 0) {
            continue;
        }
        if (collision){
            enemy.status = 0;
            console.log("crash");
            ctx.drawImage(fireImg, ship.x, ship.y, ship.w, ship.h);
            audio_ship_collision.play();
            isPlay = false;
        }
    }
}

 // 총알과 적1 충돌 감지
function checkBulletCollision1() {
    for (var i = 0; i < bulletCount; i++) {
        var bullet = bulletStatus[i];
        
        for(var j = 0; j < enemyCount; j++){
            var enemy = enemyStatus[j];
            var collision = checkCrash(bullet, enemy);
            if (enemy.status == 0) { //
                continue;
            }
            if(bullet.status==0){
                continue;
            }
            if(collision){
                console.log('Clear');
                ctx.drawImage(fireImg, enemy.x, enemy.y, enemy.w, enemy.h);
                audio_explosion.play();
                enemy.status = 0;
                bullet.status = 0;
                kill += 1;
            }
        }                
    }
}

 // 총알과 적2 충돌 감지
function checkBulletCollision2() {
    for (var i = 0; i < bulletCount; i++) {
        var bullet = bulletStatus[i]; 
        
        for(var j = 0; j < enemyCount2; j++){
            var enemy2 = enemyStatus2[j];
            var collision = checkCrash(bullet, enemy2);
            if (enemy2.status == 0) { 
                continue;
            }
            if(bullet.status==0){
                continue;
            }
            if(collision){
                console.log('Clear');
                ctx.drawImage(fireImg, enemy2.x, enemy2.y, enemy2.w, enemy2.h);
                audio_explosion.play();
                enemy2.status = 0;
                bullet.status = 0;
                kill += 1;              
            }
        }                
    }
}

//적의 위치를 생성하고 랜덤으로 지정하는 함수
function createNewEnemy1(probWeight, gameLevel) {
    if (Math.floor(Math.random() * probWeight) < gameLevel) { 
        for (var i = 0; i < enemyCount; i++) {
            var enemy = enemyStatus[i];
            if (enemy.status == 0) { //status가 0일 경우 enemy의 위치 지정
                enemy.y = 0;
                enemy.x = Math.floor(Math.random() * canvas.width);
                if (enemy.x + enemySize > canvas.width) { //enemy가 캔버스를 벗어나는 경우 위치
                    enemy.x = canvas.width - enemySize;
                }
                enemy.status = 1; // status를 1로 바꿔준다.
                break;
            }
        }
    }
}

function createNewEnemy2(probWeight, gameLevel) {
    if (Math.floor(Math.random() * probWeight) < gameLevel) {
        for (var i = 0; i < enemyCount2; i++) {
            var enemy = enemyStatus2[i]; 
            if (enemy.status == 0) { 
                enemy.y = 0;
                enemy.x = Math.floor(Math.random() * canvas.width);
                if (enemy.x + enemySize2 > canvas.width) { //enemy가 캔버스를 벗어나는 경우 위치
                    enemy.x = canvas.width - enemySize2;
                }
                enemy.status = 1; 
                break;
            }
        }
    }
}

//총알을 생성하고 위치를 지정하는 함수
function createNewBullet() {
    for (var i = 0; i < bulletCount; i++) {
        var bullet = bulletStatus[i]; 

        if (bullet.status == 0 && spacePressed) { //status가 0일 경우 bullet의 위치 지정
            audio_bullet.play();
            bullet.y = ship.y + bullet.h;
            bullet.x = ship.x + (shipSize/2);
            bullet.status = 1; 
            spacePressed = false;
            break;
        }
        
    }
}

//적을 그려내는 함수
function drawAllEnemies1() {
    for (var i = 0; i < enemyCount; i++) {
        var enemy = enemyStatus[i];
        if (enemy.status == 0) {
            continue;
        }
        enemy.y += 5;
        if (enemy.y + enemySize <= canvas.height) {
            ctx.drawImage(enemy.img, enemy.x, enemy.y, enemy.w, enemy.h);
        }
        else {
            enemy.status = 0;
        }
    }
    createNewEnemy1(30, 1);
}

function drawAllEnemies2() {
    for (var i = 0; i < enemyCount2; i++) {
        var enemy = enemyStatus2[i];
        if (enemy.status == 0) {
            continue;
        }
        enemy.y += 3;
        if (enemy.y + enemySize2 <= canvas.height) {
            ctx.drawImage(enemy.img, enemy.x, enemy.y, enemy.w, enemy.h);
        }
        else {
            enemy.status = 0;
        }
    }
    createNewEnemy2(30, 1); 
}

//총알 그리는 함수
function drawBullet() {
    for (var i = 0; i < bulletCount; i++) {
        var bullet = bulletStatus[i];
        if (bullet.status == 0) {
            continue;
        }
        bullet.y -= 18;
        if (bullet.y >= 0) {
            ctx.fillStyle = '#fcba03';
            ctx.fillRect(bullet.x, bullet.y, bullet.w, bullet.h);
        }
        else {
            bullet.status = 0;
        }
    }
    createNewBullet();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); 
    drawAllEnemies1();
    drawAllEnemies2();
    drawBullet();
    ctx.drawImage(shipImg, ship.x, ship.y, ship.w, ship.h); 
    
    if (rightPressed && ship.x < canvas.width - shipSize) {
        ship.x += 15;
    } 
    else if (leftPressed && ship.x > 0) {
        ship.x -= 15;
    } 
    else if (upPressed && ship.y > 0) {
        ship.y -= 15;
    }
    else if (downPressed && ship.y < canvas.height -shipSize) {
        ship.y += 15;
    }          
    checkEnemyCollision1();
    checkEnemyCollision2();

    checkBulletCollision1();
    checkBulletCollision2();     
    document.getElementById("score").innerHTML = "SCORE : " +kill*10;

    if(isPlay == false){
        gameOver();
        return 0;
    }
    requestAnimationFrame(draw);       
} 
