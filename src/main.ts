const todoInput = document.getElementById("add") as HTMLInputElement;
const completed = document.getElementById("completed") as HTMLInputElement;
const list = document.getElementById("list") as HTMLDListElement;
const body = document.getElementsByTagName("body")[0] as HTMLBodyElement;
const left = document.getElementById("left") as HTMLParagraphElement;
const allFilter = document.getElementById("allFilter") as HTMLParagraphElement;
const activeFilter = document.getElementById("activeFilter") as HTMLParagraphElement;
const completedFilter = document.getElementById("completedFilter") as HTMLParagraphElement;
const clearCompleted = document.getElementById("clearCompleted") as HTMLParagraphElement;

const theme_toggle = document.getElementById("toggle-img") as HTMLImageElement;


interface Task {
    id: number,
    todo: string,
    completed: boolean
}


let tasks: Task[] = loadTasks();
tasks.forEach(task => {
    addListItem(task);
})

left.textContent = `${tasks.length} items left`;

todoInput?.addEventListener("keydown", (event: KeyboardEvent) => {

    if (event.key === "Enter") {
        if (todoInput.value == "" || todoInput.value == null) return;

        const newTask: Task = {
            id: Math.random() * Math.random() * Math.random(),
            todo: todoInput.value,
            completed: completed.checked
        }
        tasks.push(newTask);
        saveTasks();
        addListItem(newTask);
        
        todoInput.value = "";
        

        left.textContent = `${tasks.length} items left`;
        console.log(tasks)
    }
    
})
    
// Drag functionality
let draggedItem: null | HTMLLIElement = null;
list.addEventListener("dragover", (event) => {
    event.preventDefault();
})



function addListItem(task: Task) {
    const listItem = document.createElement("li");
    listItem.classList.add("list-item");
    listItem.draggable = true;
    list.prepend(listItem);

    // Drag functionality
    listItem.addEventListener("dragstart", () => {
        draggedItem = listItem
    })

    listItem.addEventListener("dragend", () => {
        draggedItem = null;
    })


    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.name = "completed";
    checkbox.classList.add("completed");
    checkbox.checked = task.completed;
    listItem.append(checkbox);


    const customCheckbox = document.createElement("span");
    customCheckbox.classList.add("custom-checkbox");
    listItem.append(customCheckbox);

    const todoItem = document.createElement("p");
    todoItem.classList.add("todo");
    todoItem.textContent = task.todo;
    todoItem.style.textDecoration = task.completed ? "line-through" : "none";
    listItem.append(todoItem);

    const deleteTask = document.createElement("img"); 
    deleteTask.src = "/images/icon-cross.svg";
    deleteTask.classList.add("delete")
    listItem.append(deleteTask);

    checkbox.addEventListener("change", () => {
        todoItem.style.textDecoration = !task.completed ? "line-through" : "none";
        task.completed = !task.completed;  
    })

    deleteTask.addEventListener("click", () => {
        listItem.remove();
        let index = tasks.indexOf(task);
        tasks.splice(index, 1);
        saveTasks();
        left.textContent = `${tasks.length} items left`;
    })

    list.addEventListener("drop", (event: DragEvent) => {
        event.preventDefault();
        if (draggedItem === null) {
            return;
        }
        (event.target as HTMLLinkElement).parentNode?.insertBefore(draggedItem, (event.target as HTMLLinkElement));
        let index = tasks.indexOf(task);
        console.log(index);
    })
}


allFilter.addEventListener("click", () => {
    removeTasks();
    tasks.forEach(addListItem);
    left.textContent = `${tasks.length} items left`;
})

activeFilter.addEventListener("click", () => {
    const activeTasks = tasks.filter(task => task.completed === false);
    removeTasks();
    activeTasks.forEach(addListItem);
    left.textContent = `${activeTasks.length} items left`;
})

completedFilter.addEventListener("click", () => {
    const completedTasks = tasks.filter(task => task.completed === true);
    removeTasks();
    completedTasks.forEach(addListItem);
    left.textContent = `${completedTasks.length} items left`;
})

clearCompleted.addEventListener("click", () => {
    tasks = tasks.filter((task: Task) => task.completed === false);
    removeTasks();
    tasks.forEach(addListItem);
    left.textContent = `${tasks.length} items left`;
})

function removeTasks() {
    while(list?.firstChild) {
        list.removeChild(list.firstChild);
    }
}

function saveTasks() {
    localStorage.setItem("TASKS", JSON.stringify(tasks));
}

function loadTasks() {
    const tasksJSON = localStorage.getItem("TASKS");
    if (tasksJSON == null) return [];
    return JSON.parse(tasksJSON);
}



let darkTheme = loadTheme();
if (darkTheme) {
    body.classList.add("dark-theme");
    theme_toggle.src = "./images/icon-moon.svg";
} else {
    body.classList.remove("dark-theme");
    theme_toggle.src = "./images/icon-sun.svg";
}
theme_toggle?.addEventListener("click", (event) => {
    body.classList.toggle("dark-theme");
    darkTheme = !darkTheme;
    (event.target as HTMLImageElement).src = darkTheme ?  "./images/icon-moon.svg" : "./images/icon-sun.svg";
    localStorage.setItem("THEME", JSON.stringify(darkTheme));
})

function loadTheme() {
    const themeJSON = localStorage.getItem("THEME");
    if (themeJSON === null) return false;
    return JSON.parse(themeJSON);
}

export {}