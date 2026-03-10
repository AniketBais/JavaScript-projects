const board = document.querySelector('.board');

const startButton = document.querySelector('.btn-start')
const modal = document.querySelector('.modal')
const startGameModal = document.querySelector(".start-game") 
const gameOverModal = document.querySelector(".game-over") 
const restartButton = document.querySelectorAll(".btn-restart")
const snakeBite = document.querySelector(".hit")

const highScoreElement = document.querySelector("#high-score")
const scoreElement = document.querySelector("#score")
const timeElement = document.querySelector("#time")

let highScore = Number(localStorage.getItem("highScore")) || 0
let score = 0
let time = `00-00`
let timerIntervalId = null;


highScoreElement.innerHTML = highScore

const blockHeight = 30;
const blockWidth = 30;
//whatever the width of .board is divided by blockwidth

const cols = Math.floor(board.clientWidth / blockWidth);
const rows = Math.floor(board.clientHeight / blockHeight);


const divBlockArray = [];
let snake = [ {
                    x:1,y:4
                },
                {
                    x:1,y:3
                }]

let direction = 'right'
let intervelId = null
food = generateFood()

// for(let i=0; i<rows*cols;i++){
//     const block = document.createElement('div');
//     block.classList.add("block")
//     board.appendChild(block)
// }

for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {  
        const block = document.createElement('div')
        block.classList.add("block") 
        board.appendChild(block)
        // block.innerText = `${row}-${col}`
        block.style.fontSize = "xx-small"
        block.style.color = "black"
        divBlockArray[`${row}-${col}`] = block
        // Save the created block inside boardArray at its grid position.
        // Example: boardArray[2][5] gives the block at row 2, column 5
    }
}

 //Generate Food for snake logic
function generateFood(){
    let newFood;
    let onSnake;

    do{
        newFood = {
            x: Math.floor(Math.random()*rows),
            y: Math.floor(Math.random()*cols)
        }

        onSnake = snake.some(segment =>
            segment.x === newFood.x && segment.y === newFood.y
        )
        // check if ANY snake segment is at the same position. If yes → regenerate food.

    } while(onSnake)

    return newFood
}





function render(){

    snake.forEach(Segment=>{
    divBlockArray[`${Segment.x}-${Segment.y}`].classList.remove("fill","snake-head")
        })


    let head = null
    divBlockArray[`${food.x}-${food.y}`].classList.add("food")


     //Direction logic
    if(direction === 'left' ){
        head = {x: snake[0].x, y: snake[0].y - 1}
    }
    else if(direction == 'right'){
        head = {x: snake[0].x, y: snake[0].y + 1}
    }
    else if(direction == 'down' ){
        head = {x: snake[0].x +1, y: snake[0].y }
    }
    else if(direction == 'up' ){
        head = {x: snake[0].x -1, y: snake[0].y }
    }

        // snake[0] is the head of the snake.
        // We use its position to calculate the new head when the snake moves.

    if(head.x<0 || head.x>=rows || head.y<0 || head.y >=cols){
        clearInterval(intervelId)
        clearInterval(timerIntervalId)
        modal.style.display = "flex"
        startGameModal.style.display = "none" 
        gameOverModal.style.display = "flex"
        snakeBite.style.display = "none"
        return
        
    }
/*some() If one element matches → true
If none match → false*/

//snake.slice(0, snake.length - 1) It creates a new array without the last segment (tail).
        const hitSelf = snake.slice(0, snake.length - 1).some(segment =>
            segment.x === head.x && segment.y === head.y
        )
        // Snake Bit Himself
        if(hitSelf){
            clearInterval(intervelId)
            clearInterval(timerIntervalId)
            modal.style.display = "flex"
            startGameModal.style.display = "none" 
            gameOverModal.style.display = "none" 
            snakeBite.style.display = "flex"
            return
        }
    //Food Consume Logic
    if(head.x == food.x && head.y == food.y){
        divBlockArray[`${food.x}-${food.y}`].classList.remove("food")

        food = generateFood()

        snake.unshift(head)
        
        score +=10
        scoreElement.innerText = `${score}`
        if(score>highScore){
            highScore = score
            localStorage.setItem("highScore",highScore.toString())
            highScoreElement.innerText = highScore
        }

    } else{
        snake.unshift(head)
        snake.pop()
    }


    
        //  console.log(blockSegment)
        // divBlockArray[`${blockSegment.x}-${blockSegment.y}`]
        // blockSegment is one part of the snake like {x:1, y:3}
        // blockSegment.x gives the row and blockSegment.y gives the column
        // We combine them to form the key "row-col" (like "1-3") to find that block in divBlockArray
        snake.forEach((blockSegment,index)=>{
            const block = divBlockArray[`${blockSegment.x}-${blockSegment.y}`]

            if(index === 0){
                block.classList.add("snake-head")
            }else{
                block.classList.add("fill")
            }
        })
    }
// intervelId = setInterval(()=>{
// render()
// },500)

addEventListener("keydown",(event)=>{
    // console.log(event.key)
    if(event.key=='ArrowUp' && direction !== 'down'){direction = 'up'}
    else if(event.key=='ArrowRight' && direction !== 'left'){direction = 'right'}
    else if(event.key=='ArrowLeft' && direction !== 'right'){direction = 'left'}
    else if(event.key=='ArrowDown' && direction !== 'up'){direction = 'down'}
})

startButton.addEventListener('click',()=>{
    modal.style.display = "none"
    clearInterval(timerIntervalId)
    intervelId = setInterval(()=>{render()},300)
      let seconds = 0;

        timerIntervalId = setInterval(()=>{
            seconds++

            const min = String(Math.floor(seconds / 60)).padStart(2,"0")
            const sec = String(seconds % 60).padStart(2,"0")

            timeElement.innerText = `${min}:${sec}`
        },1000)
        })

restartButton.forEach(button=>{
    button.addEventListener("click", restartGame)
})


function restartGame(){
    clearInterval(intervelId)
    clearInterval(timerIntervalId)
    modal.style.display = "none"
    snakeBite.style.display = "none" 
    gameOverModal.style.display = "none"

    document.querySelectorAll(".block").forEach(block=>{
        block.classList.remove("fill","food")
    })
    snake = [{x:1,y:4},{x:1,y:3}]
    direction = "right"
    food = generateFood()
    intervelId = setInterval(()=>{render()},300)
    score = 0 
    time = `0-0`
    scoreElement.innerText = score
    timeElement.innerText = "00:00"
    // restart timer
    let seconds = 0

    timerIntervalId = setInterval(()=>{
        seconds++

        const min = String(Math.floor(seconds / 60)).padStart(2,"0")
        const sec = String(seconds % 60).padStart(2,"0")

        timeElement.innerText = `${min}:${sec}`
    },1000)


}



