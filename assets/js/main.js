const addBtn = document.getElementById("add-btn");
const formInputsContainer = document.getElementById("form-inputs");
const goalPeriod = document.querySelector("#goal-period");
let subtitle1 = document.querySelector("#subtitle1");
let subtitle2 = document.querySelector("#subtitle2");
const goalsContainer = document.querySelector(".goals");
const goals = document.querySelectorAll(".goal");
const clearBtn = document.querySelector('.clear-btn');
const goalsForm = document.getElementById("goals-form");
const submitBtn = document.getElementById("submit-btn");
const prompterContainer = document.querySelector(".prompter-container");
const goalsSection = document.querySelector(".goals-section");
const alert = document.querySelector(".alert");

const cancelMssg = document.getElementById("cancel-message");
const congratsMssg = document.getElementById("congrats-message");

//other important global variables
//let allGoals = [];
let updatedItem;
let addingItem = true;
let editingItem = false;
let editID = null;
let hideElements=false;
//let addedInputs = "";

/*
===========================
minor functionality codes
===========================
*/

//display all goals onload of window
window.addEventListener("DOMContentLoaded", displayAllGoals);
window.addEventListener("DOMContentLoaded", getPeriod);
//switch btn
/*switchBtn.addEventListener('click', (e) => {
    //console.log("click")
    e.currentTarget.classList.toggle("slide");
})*/

//change the period in title on change of option
goalPeriod.addEventListener("change", function(){
    let period = this.value;
    if(period === 'today'){
        subtitle2.textContent = period;
    }else{
        subtitle2.textContent = `the ${period}`;
    }
    //update local storage
    let items = getAllGoals();
    items.map(item => {
        item.period = period;
        item.dateEntered = today();
    });
    localStorage.setItem("goals", JSON.stringify(items));            
})


/*
==============================
end minor functionality codes
==============================
*/


/*
===========================
major functionality codes
===========================
*/
let formInputs=null;
//add more inputs
addBtn.addEventListener("click", function(e){
    e.preventDefault();
    hidePrompter();
    addNewInput();
    
    if(formInputsContainer.children.length > 0){
        submitBtn.style.display = "block";
    }
   
    //delete a form field previously added
    const removeInputBtns = document.querySelectorAll(".minus-btn");
    removeInputBtns.forEach((btn) => {
        btn.onclick = (e) => {
            e.preventDefault();
            e.currentTarget.parentNode.remove();
           if(formInputsContainer.children.length < 1){
                submitBtn.style.display = "none";
           } 
        }
    })

})

//submitting form
formInputs = document.querySelectorAll(".inputs");
goalsForm.addEventListener("submit", submitItem);
clearBtn.addEventListener("click", clearItems);
function submitItem(e){
    e.preventDefault();
    let showMessage; 
    if(addingItem && !editingItem){
        formInputs.forEach((input) => {
            const id = generateId();
            const goal = input.value;
            const period = goalPeriod.value;
            const achieved = false;
            const dateEntered = today();

            //console.log(dateEntered)
            if(goal){
                //format title
                //titleManipulation(period, dateEntered);
                subtitle2.textContent = period === 'today' ? period : `the ${period}`;
                
                const newGoal = document.createElement("div");
                newGoal.setAttribute("class", "goal-details");
                newGoal.setAttribute("id", id);

                newGoal.innerHTML = `
                    <button class="switch-btn">
                        <span><i class="far fa-times-circle"></i></span>
                        <span><i class="far fa-check-circle"></i></span>
                        <span class="switch"></span>
                    </button>
                    <div class="goal">
                        <p>${goal}</p>
                    </div> 
                    <button class="goal-action-btn">
                        <i class="delete-btn fas fa-trash-alt"></i>
                        <i class="edit-btn fas fa-edit"></i>
                    </button>
                `;
                
                //toggle switch btn
                const switchBtns = newGoal.querySelectorAll('.switch-btn');
                switchBtns.forEach((switchBtn) => {
                    switchBtn.addEventListener('click', toggleSwitchBtn);
                })
                //delete single item from list
                const deleteBtns = newGoal.querySelectorAll('.delete-btn');
                deleteBtns.forEach((deleteBtn) => {
                    deleteBtn.addEventListener("click", deleteItem)
                })

                //edit single item
                const editBtns = newGoal.querySelectorAll(".edit-btn");
                editBtns.forEach((editBtn) => {
                    editBtn.addEventListener("click", editItem);
                })

                goalsContainer.appendChild(newGoal);
                
                const goalDetails = document.querySelectorAll('.goal-details');
                goalDetails.length > 1 ? subtitle1.textContent = 'Goals' : subtitle1.textContent = 'Goal';
                    
                addToLocalStorage(id, goal, achieved, period, dateEntered);
                showHideGoalsContainer();
                defaultSettings(); 
                defaultFormSetting();
                showMessage = "successful addition";
            }else{
                showMessage = "empty field";
                return;
            }

        })
    }else if(editingItem && !addingItem){
        const formInput = document.querySelector(".inputs");
        const goal = formInput.value;
        //console.log(`editID:${editID} updatedItem:${updatedItem.textContent} goal:${goal}`);
        if(goal){
            updatedItem.innerHTML = goal;
            editLocalStorage(editID, goal);
            defaultSettings();
            defaultFormSetting();
            goalPeriod.style.display = "block";
            addBtn.style.display = "block";
            submitBtn.textContent = "submit";
            showMessage = "successful edit";
        }else{
            showMessage = "empty field";
            return;
        }

    }

    if(showMessage === "empty field"){
        displayAlert('danger', 'ban', 'please enter your goal');
        hideAlert();
    }else if(showMessage === "successful addition"){
        displayAlert('success', 'check', 'new goal successfully added');
        hideAlert();
    }else if(showMessage === "successful edit"){
        displayAlert('success', 'check', 'goal successfully updated');
        hideAlert();
    }
}



/*
===============
ALL FUNCTIONS
===============
*/


function today(){
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const today = new Date(year, month, day);
    return today;
}

function displayAlert(alertStatus, icon, message){
    alert.classList.add("show-alert", `alert-${alertStatus}`);
    const alertIcon = document.querySelector(".alert-icon");
    const alertMessage = document.querySelector(".alert p");
    alertIcon.classList.add(`fa-${icon}`);
    alertMessage.textContent = message;

}

function hideAlert(){
    setTimeout(() => {
        alert.classList.remove("show-alert");
    }, 5000);
}

function addNewInput(){
    const inputDetails = document.createElement("div");
    inputDetails.setAttribute("class","input-details");
    
    const newInput = document.createElement("input");
    newInput.setAttribute("type", "text");
    newInput.setAttribute("class","inputs form-input-added");
    newInput.setAttribute("placeholder","Enter your goal");
    newInput.setAttribute("required", "required");
    
    const removeBtn = document.createElement("button");
    removeBtn.setAttribute("class", "minus-btn");
    removeBtn.setAttribute("title", "Remove goal");

    const removeIcon = document.createElement("i");
    removeIcon.setAttribute("class", "fas fa-minus");
    
    removeBtn.appendChild(removeIcon);
    inputDetails.append(newInput, removeBtn);
    formInputsContainer.appendChild(inputDetails);
    
    formInputs = document.querySelectorAll(".inputs");
}

//hide the prompter
function hidePrompter(){
   return prompterContainer.style.display = "none";
}

function getPeriod(){
    const allGoals = getAllGoals();
    let savedPeriod;
    let savedDate;
    allGoals.map(item => {
        savedPeriod = item.period;
        savedDate = item.dateEntered;
    })
    titleManipulation(savedPeriod, savedDate);
    //return subtitle2.textContent = savedPeriod === 'today' ? savedPeriod : `the ${savedPeriod}`;
    
}

function titleManipulation(savedPeriod=null, savedDate=null){
    const t =  today();
    const timeDiff = t - new Date(savedDate);
    const oneDay = 24 * 60 * 60 * 1000;
    const numberOfDays = Math.floor(timeDiff / oneDay);
    //console.log(numberOfDays)
    if(savedPeriod === "today"){
        if(numberOfDays === 0){
            subtitle2.textContent = "Today";
            //console.log("today");
        }
        else if(numberOfDays === 1){
            subtitle2.textContent = "Yesterday";
            //console.log("yesterday");
        }else if(numberOfDays > 1){
            subtitle2.textContent = `Last ${numberOfDays} Days`;
            //console.log(`${numberOfDays} day(s) ago`);
        }
    }else if(savedPeriod === "week"){
        if(numberOfDays === 0 || numberOfDays < 7){
            subtitle2.textContent = "the Week";
            //console.log("week");
        }else
        if(numberOfDays >= 7 && numberOfDays < 14){
            subtitle2.textContent = "Last Week";
            //console.log("last week");
        }else if(numberOfDays % 7 === 0){
            subtitle2.textContent = `Last ${numberOfDays / 7} Weeks`;
            //console.log(`${numberOfDays/7} weeks ago`);
        }else if(numberOfDays > 14 && numberOfDays % 7 > 0){
            subtitle2.textContent = `Last ${Math.floor(numberOfDays / 7)} Weeks`;
            //console.log(`${numberOfDays/7} weeks ago`);
        }
        else{
            subtitle2.textContent = `Last ${numberOfDays} Days`;
            //console.log(`${numberOfDays} day(s) ago`);
        }
    }else if(savedPeriod === "month"){
        if(numberOfDays === 0 || numberOfDays < 30){
            subtitle2.textContent = "the Month";
            //console.log("month");
        }else
        if(numberOfDays >= 30 && numberOfDays < 60){
            subtitle2.textContent = "Last Month";
            //console.log("last month");
        }else if(numberOfDays % 30 === 0){
            subtitle2.textContent = `Last ${numberOfDays / 30} Months`;
            //console.log(`${numberOfDays/30} months ago`);
        }else if(numberOfDays > 60 && numberOfDays % 30 > 0){
            subtitle2.textContent = `Last ${Math.floor(numberOfDays / 30)} Months`;
            //console.log(`${numberOfDays/7} weeks ago`);
        }else{
            subtitle2.textContent = `Last ${numberOfDays} Days`;
            //console.log(`${numberOfDays} day(s) ago`);
        }

    }else if(savedPeriod === "year"){
        if(numberOfDays === 0 || numberOfDays < 365){
            subtitle2.textContent = "the Year";
            //console.log("year");
        }else
        if(numberOfDays >= 365 && numberOfDays < 730){
            subtitle2.textContent = "Last Year";
            //console.log("last year");
        }else if(numberOfDays % 365 === 0){
            subtitle2.textContent = `Last ${numberOfDays / 365} Years`;
            //console.log(`${numberOfDays/365} years ago`);
        }else if(numberOfDays > 730 && numberOfDays % 365 > 0){
            subtitle2.textContent = `Last ${Math.floor(numberOfDays / 365)} Years`;
            //console.log(`${numberOfDays/7} weeks ago`);
        }else{
            subtitle2.textContent = `Last ${numberOfDays} Days`;
            //console.log(`${numberOfDays} day(s) ago`);
        }

    }
                
}

function toggleSwitchBtn(e){
    const id = e.currentTarget.parentElement.id;
    e.currentTarget.classList.toggle("slide");
    const goalItem = e.currentTarget.nextElementSibling.firstElementChild;
    goalItem.classList.toggle("achieved-goal");

    //update local storage
    const items = getAllGoals();
    items.map(item => {
        if(item.id === id){
            item.achieved = !item.achieved;
        }
        return item;
    })

    localStorage.setItem("goals", JSON.stringify(items));
    if(e.currentTarget.classList.contains("slide")){
        displayAlert('success', 'check', 'achieved');
        hideAlert();
    }

    //show/hide congrats message if all is checked
    const enteredGoals = document.querySelectorAll(".goal-details");
    const achievedGoals = document.querySelectorAll(".achieved-goal");
    if(achievedGoals.length === enteredGoals.length){
        showCongratsMessage()
    }else{
        closeCongratsMessage();
    }

    cancelMssg.addEventListener("click", closeCongratsMessage);
    document.addEventListener("click", (e) => {
        if(e.target === congratsMssg){
            closeCongratsMessage();
        }
    }) 

    function closeCongratsMessage(){
        congratsMssg.style.display = "none";
        stopConfetti();
    }
    function showCongratsMessage(){
        congratsMssg.style.display = "block";
        startConfetti();
    }
}

function deleteItem(e){
    e.preventDefault();
    if(confirm("Are you want to delete this item from the list")){
        const id = e.currentTarget.parentNode.parentNode.id;
        e.currentTarget.parentElement.parentElement.remove();
        showHideGoalsContainer();
        deleteFromLocalStorage(id);
        defaultSettings();
        defaultFormSetting();
        
        const goalDetails = document.querySelectorAll('.goal-details');
        goalDetails.length === 1 ? subtitle1.textContent = 'Goal' : subtitle1.textContent = 'Goals';
        
        displayAlert('success', 'check', 'goal successfully deleted');
        hideAlert();
    }
       
}

function editItem(e){
    e.preventDefault();
    submitBtn.style.display = "block";
    hidePrompter();
    const id = e.currentTarget.parentNode.parentNode.id;
    updatedItem = e.currentTarget.parentElement.previousElementSibling.firstElementChild;
    prevContent = updatedItem.textContent;
    editingItem = true;
    addingItem = false;
    editID = id;
    submitBtn.textContent = "edit";
    //console.log(id, updatedItem, editing, editID, prevContent)
    //hide select field and add button
    goalPeriod.style.display = "none";
    formInputsContainer.innerHTML = "";
    addBtn.style.display = "none";
    
    //add the edit input element
    const newInput = document.createElement("input");
    newInput.setAttribute("type", "text");
    newInput.setAttribute("placeholder", "Update goal");
    newInput.setAttribute("class", "inputs form-input");
    newInput.setAttribute("value", prevContent);
    newInput.setAttribute("required", "required");

    formInputsContainer.appendChild(newInput);
}

function defaultSettings(){
    editingItem = false;
    addingItem = true;
    editID = null;
    updatedItem = null;
    hideElements = false;
    submitBtn.style.display = "none";
}
function defaultFormSetting(){
    formInputsContainer.innerHTML = "";
    goalPeriod.style.display = "block";
    addBtn.style.display = "block";
    submitBtn.textContent = "submit";
    //submitBtn.style.display = "none";
}

function clearItems(e){
    e.preventDefault();
    if(confirm("Are you sure you want to clear all items on this list?")){
        const goals = document.querySelectorAll(".goal-details");
        goals.forEach((item) => {
            item.remove()
            showHideGoalsContainer();
        })
        clearLocalStorage();
        defaultSettings();
        defaultFormSetting();

        displayAlert('success', 'check', 'goals successfully deleted');
        hideAlert();
    }
    
}

function generateId(){
    //const characters = [0,1,2,3,4,5,6,7,8,9,'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','~','!','@','#','$','%','^','&','*','(',')','[',']','{','}','|','?'];
    const characters = [0,1,2,3,4,5,6,7,8,9,'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
    let generatedID=""; 
    for(let i = 0; i < 10; i++){
        let random = Math.floor(Math.random() * characters.length);
        generatedID += characters[random];
    }
    return generatedID+nanoid() ;
}

/*
=======================
Local storgw functions
=======================
*/

function getAllGoals(){
    if(localStorage.getItem("goals")){
        return JSON.parse(localStorage.getItem("goals"))
    }else{
        return [];
    }
}

function addToLocalStorage(id, goal, achieved, period, dateEntered){
    let allGoals = getAllGoals();
    const addedGoal = {id, goal, achieved, period, dateEntered};
    allGoals.push(addedGoal);
    return localStorage.setItem("goals", JSON.stringify(allGoals))
}

function deleteFromLocalStorage(id){
    let allGoals = getAllGoals();
    const updatedGoals = allGoals.filter((item) => item.id !== id);
    return localStorage.setItem("goals", JSON.stringify(updatedGoals));
}

function clearLocalStorage(){
    return localStorage.removeItem("goals");
}

function editLocalStorage(id, goal){
    let allGoals = getAllGoals();
    const updatedGoals = allGoals.map(item => {
        if(id === item.id){
            item.goal = goal;
        }
        return item
    })

    return  localStorage.setItem("goals", JSON.stringify(updatedGoals));
}

function displayAllGoals(){
    const allGoals = getAllGoals();
    if(allGoals && allGoals.length > 0){
        //console.log("yes")
        allGoals.forEach((item) => {
            const { id, goal, achieved, period, dateEntered } = item;
            const newGoal = document.createElement("div");
                newGoal.setAttribute("class", "goal-details");
                newGoal.setAttribute("id", id);

                newGoal.innerHTML = `
                    <button class="switch-btn ${achieved ? 'slide' : ''}">
                        <span><i class="far fa-times-circle"></i></span>
                        <span><i class="far fa-check-circle"></i></span>
                        <span class="switch"></span>
                    </button>
                    <div class="goal">
                        <p class=${achieved ? 'achieved-goal' : ''}>${goal}</p>
                    </div> 
                    <button class="goal-action-btn">
                        <i class="delete-btn fas fa-trash-alt"></i>
                        <i class="edit-btn fas fa-edit"></i>
                    </button>
                `;

                //toggle switch btn
                const switchBtns = newGoal.querySelectorAll('.switch-btn');
                switchBtns.forEach((switchBtn) => {
                    switchBtn.addEventListener('click', toggleSwitchBtn);
                })
                //delete single item from list
                const deleteBtns = newGoal.querySelectorAll('.delete-btn');
                deleteBtns.forEach((deleteBtn) => {
                    deleteBtn.addEventListener("click", deleteItem)
                })

                //edit single item
                const editBtns = newGoal.querySelectorAll(".edit-btn");
                editBtns.forEach((editBtn) => {
                    editBtn.addEventListener("click", editItem);
                })

                goalsContainer.appendChild(newGoal);


        });
        goalsSection.style.display = "grid";
        const goalDetails = document.querySelectorAll('.goal-details');
        goalDetails.length > 1 ? subtitle1.textContent = 'Goals' :  subtitle1.textContent = 'Goal'
            
        
        
    }else{
        goalsSection.style.display = "none";
    }
}

function showHideGoalsContainer(){
    //console.log(goalsContainer.children.length);
     goalsContainer.children.length < 1 ? goalsSection.style.display = "none" : goalsSection.style.display = "grid";
}
/*
===============
END ALL FUNCTIONS
===============
*/

/*
==============================
end major functionality codes
==============================
*/
