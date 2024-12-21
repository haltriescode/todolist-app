const inputBox = document.getElementById("submit-list");
const listContainer = document.getElementById("list-container");
const finishedTaskList = document.querySelector('.box-tasklog ul');

function addActivity(){
    if(inputBox.value === ''){
        alert("Please write something");
    } else {
        let li = document.createElement("li");
        li.innerHTML = `${inputBox.value}<span></span>`; 
        listContainer.appendChild(li);
    }
    inputBox.value = "";
    saveData();
};

function taskComplete(element){
    const taskText = element.textContent;
    element.parentElement.removeChild(element);
    const finishedTask = document.createElement('li');
    finishedTask.innerHTML = taskText;
    finishedTask.classList.add('finished');
    finishedTaskList.appendChild(finishedTask);
    updateClearButton();

    saveData();
}


function saveData(){
    localStorage.setItem("activeTasksData", listContainer.innerHTML);
    localStorage.setItem("finishedTasksData", finishedTaskList.innerHTML);
}

function loadData(){
    listContainer.innerHTML = localStorage.getItem("activeTasksData") || "";
    finishedTaskList.innerHTML = localStorage.getItem("finishedTasksData") || "";
    updateClearButton();
}

document.addEventListener('DOMContentLoaded', loadData);

listContainer.addEventListener('click', function(e){
        if(e.target.tagName === "LI"){
            if(!e.target.classList.contains('checked')){
                e.target.classList.add('checked');
                taskComplete(e.target);
            }
        }
});

listContainer.addEventListener("click", function(e){
    if(e.target.tagName === "LI"){
        if(!e.target.classList.contains('checked')){
            e.target.classList.add('checked');
            taskComplete(e.target);
        }
    } else if(e.target.tagName === "SPAN"){
        e.target.parentElement.remove();
        updateStorage();
    }
});

const clearFinishedBtn = document.getElementById('clearFinished');

clearFinishedBtn.addEventListener('click', function() {
    finishedTaskList.innerHTML = '';
    updateClearButton();
    saveData();
});

function updateClearButton() {
    const hasFinishedTasks = finishedTaskList.children.length > 0;
    clearFinishedBtn.disabled = !hasFinishedTasks;
    clearFinishedBtn.style.opacity = hasFinishedTasks ? '1' : '0.5';
    clearFinishedBtn.style.cursor = hasFinishedTasks ? 'pointer' : 'not-allowed';
}


function updateStorage() {

    const activeTasks = document.querySelectorAll('#list-container li');
    const finishedTasks = document.querySelectorAll('.box-tasklog li');
    const finishedTaskList = document.querySelector('.box-tasklog ul');
    localStorage.setItem("finishedTasks", finishedTaskList.innerHTML);
    localStorage.setItem("data1", listContainer.innerHTML);
    
    localStorage.setItem('activeTasks', JSON.stringify(Array.from(activeTasks).map(task => task.textContent)));
    localStorage.setItem('finishedTasks', JSON.stringify(Array.from(finishedTasks).map(task => task.textContent)));
}

function showDate() {
    const dateElement = document.getElementById("date-time");
    const date = new Date();
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const today = days[date.getDay()];
    dateElement.innerHTML = `Today is ${today}`;
}

showDate();