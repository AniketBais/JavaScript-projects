let taskData = {}

const todo = document.querySelector("#todo")
const progress = document.querySelector("#progress")
const done = document.querySelector("#done")
const task = document.querySelectorAll(".task")
const toggleModalButton = document.querySelector("#toggle-modal")
const modal = document.querySelector(".modal")
const bg = document.querySelector(".bg")
const addTaskButton = document.querySelector("#add-new-task")



if(localStorage.getItem("task")){
    /*Converting tring into Object*/
    const data = JSON.parse(localStorage.getItem("task"));
    /*All task are stored in Array formate and this Array formate can have and hold multiple task,
    So, we apply Foreach loop to target every array*/
    for(const col in data){
        data[col].forEach(task =>{
            const column = document.querySelector(`#${col}`) //document.querySelector("#todo")  `#${col}` → "#progress"  When col = "done"`#${col}` → "#done"
            createTaskElement(task.title, task.desc, column)
        })
    }
}

let draggedTask = null;
task.forEach(task=>{
    task.addEventListener("dragstart",(e)=>{
        draggedTask = task;
    })
}) 


function addDragEventOnCloumn(column){
    column.addEventListener("dragenter",(e)=>{
        e.preventDefault();
        column.classList.add("hover-over")
    })
        column.addEventListener("dragover",(e)=>{
        e.preventDefault(); // required for dropping
        /*bydefault browser restrict element to move from their original place
            This will let allow user to move element from one place to another
            and Stop browser default behaviour*/
    })
    column.addEventListener("dragleave",(e)=>{
        e.preventDefault();
        column.classList.remove("hover-over")
    })
    column.addEventListener("drop",(e)=>{
        e.preventDefault()
        column.appendChild(draggedTask)
        column.classList.remove("hover-over")

        updateCounts()
    })
}
addDragEventOnCloumn(todo)
addDragEventOnCloumn(progress)
addDragEventOnCloumn(done)
//Modal related logic start


//modal start that blur the bg
toggleModalButton.addEventListener("click",(e)=>{
    modal.classList.toggle("active")
})

bg.addEventListener("click",()=>{
    modal.classList.remove("active")
})


//Place where New Task is created
addTaskButton.addEventListener("click",()=>{
    const taskTitle = document.querySelector("#task-title-input").value 
    const taskDesc = document.querySelector("#task-desc-input").value 

    createTaskElement(taskTitle, taskDesc, todo)
    updateCounts()
    
    modal.classList.remove("active")
    document.querySelector("#task-title-input").value =""
    document.querySelector("#task-desc-input").value = ""
})

//Modal related logic end



//function that update count on UI
function updateCounts(){
    [todo, progress, done].forEach(col=>{
        const tasks = col.querySelectorAll(".task")
        const count = col.querySelector(".right")
        count.innerText = tasks.length


        /*task is a div block and inside this some element is present so first I am converting it itno Array */ 
        taskData[col.id] = Array.from(tasks).map(t=>{
            return { title: t.querySelector("h2").innerText,
                     desc: t.querySelector("p").innerText
                   }
        })
        localStorage.setItem("task",JSON.stringify(taskData))
        /*converting object into string bcz local storage data only string*/
    })
}

function createTaskElement(title, desc, column){
    const div = document.createElement("div")

    div.classList.add("task")
    div.setAttribute("draggable","true")

    div.innerHTML = `
        <h2>${title}</h2>
        <p>${desc}</p>
        <button>Delete</button>
    `

    column.appendChild(div)

    div.addEventListener("dragstart",()=>{
        draggedTask = div
    })

    const deleteButton = div.querySelector("button")
    deleteButton.addEventListener("click",()=>{
        div.remove()
        updateCounts()
    })

    return div
}