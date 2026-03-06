
const checkBox = document.querySelectorAll('.gol')
const InputFieled = document.querySelectorAll('.txt')
const progressbar = document.querySelector('.progressbar')
const barbg = document.querySelector('.barbg')
const proges = document.querySelector('.proges')
const label = document.querySelector('.label')

const allQuotes = [
    'Raise the bar by completing your goals!',
    'well begun is half done',
    'just a step away, keep going!',
    'Whoa! you just completed all the goals, time for chill 😁'
]
// console.log(checkBox)
// console.log(InputFieled)

let everyInput = false

const allGoal = JSON.parse(localStorage.getItem('allGoal')) || {}

let completedGoalCount = Object.values(allGoal).filter((goal)=> goal.completed).length
console.log(completedGoalCount)

proges.style.width = `${completedGoalCount/3 * 100}%`

proges.firstElementChild.innerText = `${completedGoalCount}/3 completed`

label.innerText = allQuotes[completedGoalCount]




checkBox.forEach((checkBox)=>{
    checkBox.addEventListener("click",(e)=>{
       everyInput = [...InputFieled].every(function(input){
            return input.value
        })
        
        if(everyInput){
        checkBox.parentElement.classList.toggle('completed')
        // proges.style.width = '33.3%'
        


        const inputId = checkBox.nextElementSibling.id
        if(allGoal[inputId]){
            allGoal[inputId].completed = !allGoal[inputId].completed
            completedGoalCount = Object.values(allGoal).filter((goal)=> goal.completed).length
            proges.style.width = `${completedGoalCount/3 * 100}%`
            localStorage.setItem('allGoal', JSON.stringify(allGoal))
            proges.firstElementChild.innerText = `${completedGoalCount}/3 completed`
            label.innerText = allQuotes[completedGoalCount]
        }
        }


        else{
            progressbar.classList.add('showerror')
        }
    })
})
InputFieled.forEach((input)=>{

    if(allGoal[input.id]){
    input.value = allGoal[input.id].name
    }
    // console.log(allGoal[input.id])
    if(allGoal[input.id] && allGoal[input.id].completed){
        input.parentElement.classList.add('completed')
    }

    input.addEventListener('focus',()=>{  
        progressbar.classList.remove('showerror')
    })

    input.addEventListener('input',(e)=>{
        if(allGoal[input.id] && allGoal[input.id].completed){
            input.value = allGoal[input.id].name
            return
        }
        allGoal[input.id] = {
            name: e.target.value,
            completed: false
        }
        // console.log(allGoal)
        localStorage.setItem('allGoal',JSON.stringify(allGoal))
    })
})


localStorage.removeItem('allGoals')


