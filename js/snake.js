const box = { size:48 ,scale:16 }
const endArea = ((box.scale -1) * box.size);

let game = 0 ;
let snake = undefined;
let food  = undefined;
let canvas = document.getElementById('snake');
let contex = canvas.getContext('2d');
let goSnake = {
    'LEFT':(bodySnake)=>{return {x :bodySnake.x - box.size,  y : bodySnake.y}}//left 37
    ,'UP':(bodySnake)=>{return {x :bodySnake.x,  y : bodySnake.y - box.size}}//Top 38
    ,'RIGHT':(bodySnake)=>{return {x :bodySnake.x + box.size,  y : bodySnake.y}}//rigth 39
    ,'DOWN':(bodySnake)=>{return {x :bodySnake.x , y : bodySnake.y + box.size}}//down 40 
    ,'STOP':(bodySnake)=>{return {x :bodySnake.x , y : bodySnake.y}}//down 40 
}
let gameInformations = { score:0 ,record:0 }

//Devolve uma  coordenada Randomica 
function coorRandom(){
    return Math.floor(Math.random() * 15 + 1) * box.size 
}

//cria a cobra
function Snake(){
    return {
        body:Array(1).fill({ x: 8 * box.size , y :8 * box.size})
        ,direction:'RIGHT'
        ,color: ['black','white','red']
    };
}

//cria a comida
function Food(){
    return { x: coorRandom() , y: coorRandom()}
}

//Rederiza  a Area
function renderArea(){
    contex.fillStyle = 'lightgreen';
    contex.fillRect(0,0, box.scale * box.size, box.scale * box.size) ;
}

//Rederiza a comida
function renderFood(){
    contex.fillStyle = 'red';
    contex.fillRect(food.x,food.y, box.size, box.size);
}

//Cria o corpo da cobra
function renderSnakeBody(){
    var idColor = 0;
    for(let i=0; i < snake.body.length; i++){
        contex.fillStyle = snake.color[idColor];
        contex.fillRect(snake.body[i].x,snake.body[i].y, box.size, box.size)
        // > se colocar length -1 ele zebrar
        // > as 2 primeiras posições serão pretas para diferenciar do resto do corpo 
        idColor = i < 1? 0: idColor < snake.color.length ? idColor + 1: 0;   
    }
}

//Responsavel pelo posicionamento da cobra removendo o 1ª px e adicionado 1 px no fim da lista
function posicionHandler(){
    let newPosition = goSnake[snake.direction](snake.body[0]);
    //eat
    if (newPosition.x !== food.x || newPosition.y !== food.y) {
        snake.body.pop(); 
    }else{
        food = Food();
        //Increment Score
        gameInformations.score = parseInt(document.getElementById('current-score').innerText)+1;
        gameInformations.score = gameInformations.score < 10? `0${gameInformations.score}`: gameInformations.score;
       document.getElementById('current-score').innerHTML = gameInformations.score;
    }

    //end-game    
    snake.body.slice(1,-1).forEach(bodyPiece =>{
        if(snake.body[0].x == bodyPiece.x && snake.body[0].y == bodyPiece.y){
            clearInterval(game);
            snake = Snake();
            if( gameInformations.score > gameInformations.record){
                gameInformations.record =  gameInformations.score;
                localStorage.setItem('current-record',gameInformations.record )
                alert(`Congratulations. NEW RECORD [${gameInformations.record}]. KEEP PLAYING` );
                document.getElementById('current-record').innerHTML = gameInformations.record;
            }else{
                alert("END GAME. TRY AGAIN!");
            }
            document.getElementById('btnStart').hidden = false;
        }
    })
    snake.body.unshift(newPosition);
}

//Detectar o direção indica pelo usuário
function buttonsDetecter(event){
    let gameControl = 
    ([37,65].includes(event.keyCode)) ? 'LEFT' :
    ([38,87].includes(event.keyCode)) ? 'UP' :
    ([39,68].includes(event.keyCode)) ? 'RIGHT' :
    ([40,83].includes(event.keyCode)) ? 'DOWN' : 
    ([32].includes(event.keyCode)) ? 'STOP' :undefined;
    const gameControlDirection ={
      'LEFT':(currentDirection, keysDirection)=>{ return (currentDirection != keysDirection[2])?  keysDirection[0]: currentDirection}  
      ,'UP':(currentDirection, keysDirection)=>{ return (currentDirection != keysDirection[3])? keysDirection[1]: currentDirection}  
      ,'RIGHT':(currentDirection, keysDirection)=>{ return (currentDirection != keysDirection[0])? keysDirection[2]: currentDirection}  
      ,'DOWN':(currentDirection, keysDirection)=>{ return (currentDirection != keysDirection[1])? keysDirection[3]: currentDirection}  
      ,'STOP': (currentDirection, keysDirection)=>{ return keysDirection[4]}
    }

    snake.direction = gameControl? gameControlDirection[gameControl](snake.direction, Object.keys(goSnake)) : snake.direction; 
}

//Define o limite da area
function areaLimit(){
    snake.body[0].x  = (snake.body[0].x > endArea && snake.direction == 'RIGHT')? 0: snake.body[0].x;
    snake.body[0].x  = (snake.body[0].x < 0 && snake.direction == 'LEFT')? endArea: snake.body[0].x;
    snake.body[0].y  = (snake.body[0].y > endArea && snake.direction == 'DOWN')? 0: snake.body[0].y;
    snake.body[0].y  = (snake.body[0].y < 0 && snake.direction == 'UP')? endArea: snake.body[0].y;
}

//Events Listener
document.addEventListener('keydown',buttonsDetecter);
//Main GAME START
function gameMain(){
    renderArea();
    renderSnakeBody();
    renderFood();
    posicionHandler();
    areaLimit();
}
function gameStart(){
    //Intervalo de Quadros que o game renderiza
    document.getElementById('btnStart').hidden = true;
    
    document.getElementById('current-score').innerHTML  = '00'
    document.getElementById('current-record').innerHTML = localStorage.getItem('current-record') ? localStorage.getItem('current-record'): '00'
    
    gameInformations.score = document.getElementById('current-score').innerText;
    gameInformations.record = document.getElementById('current-record').innerText;
    
    snake = Snake();
    food = Food();
    game = setInterval(()=>{gameMain()},150);
}

function endGame(){

}


