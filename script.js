const inputBox = document.getElementById("submit-list");
const listContainer = document.getElementById("list-container")

function addActivity(){
    if(inputBox.value === ''){
        alert("Please write something");
    } else {
        let li = document.createElement("li");
        li.innerHTML = `${inputBox.value}<span></span>`; 
        listContainer.appendChild(li);
    }
    inputBox.value = "";
};

listContainer.addEventListener("click", function(n){
    if(n.target.tagName === "LI"){
        n.target.classList.add("checked");
    } else if(n.target.tagName === "SPAN"){
        n.target.parentElement.remove();
    }
});