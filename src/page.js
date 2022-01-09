let add1 = document.getElementById('gamer1');
let add2 = document.getElementById('gamer2');
let start = document.getElementById('start');

let mainTitle = document.getElementById('mainTitle');
let curtain = document.getElementById('curtain');
let game = document.getElementById('game');
let winText = document.getElementById('win');

let int1 = document.getElementById('number1');
let int2 = document.getElementById('number2');

let integer1 = 0;
let integer2 = 0;

add1.addEventListener('click', function(){
    integer1 += 1;
    int1.innerHTML = integer1;

    checkWinner(integer1, 1);
});

add2.addEventListener('click', function(){
    integer2 += 1;
    int2.innerHTML = integer2;

    checkWinner(integer2, 2);
});

start.addEventListener('click', function(){
    mainTitle.style.display = "none";
    curtain.style.display = "none";
    start.style.display = "none";
    game.style.display = "inline";
});

function checkWinner(int, gamer){
    if (int >= 12){

        if (gamer == 1){
            winText.innerHTML = "Player 1 won"
        } else {
            winText.innerHTML = "Player 2 won"
        } 

        winText.style.display = "inline";
    }
}