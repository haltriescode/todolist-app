import { calculatePriority } from '../src/utils/prioritization.js';

const inputBox = document.getElementById("submit-list");
const listContainer = document.getElementById("list-container");
const finishedTaskList = document.querySelector('.box-tasklog ul');

window.addActivity = function(){
    if(inputBox.value === ''){
        alert("Please write something");
    } else {
        const impact = parseInt(document.getElementById('impact').value);
        const ease = parseInt(document.getElementById('ease').value);
        const priority = calculatePriority(impact, ease);

        let li = document.createElement("li");
        li.innerHTML = `
            <span class="task-text">${inputBox.value}</span>
            <span class="priority-tag ${priority.label.toLowerCase().replace(' ', '-')}" style="background-color: ${priority.color}">
                ${priority.label}
            </span>
            <span class="delete-btn"></span>
        `; 
        listContainer.appendChild(li);
        inputBox.value = "";
        saveData();
    }
};

function taskComplete(element){
    const taskText = element.querySelector('.task-text').textContent;
    const priorityTag = element.querySelector('.priority-tag').outerHTML;

    element.remove();

    const finishedTask = document.createElement('li');
    finishedTask.innerHTML =`
       <span class="task-text">${taskText}</span>
        ${priorityTag}
    `;

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

listContainer.addEventListener("click", function(e) {
    const li = e.target.closest('li');
    if (!li) return;
    
    if (e.target.classList.contains('delete-btn')) {
        li.remove();
        saveData();
    } else {
        if (!li.classList.contains('checked')) {
            li.classList.add('checked');
            taskComplete(li);
        }
    }
});

const clearFinishedBtn = document.getElementById('clearFinished-Btn');

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