window.addEventListener("DOMContentLoaded", event => {

    // Everytime a user clicks on Add Task button, tasks summary will increment by 1.
    const addTaskBtn = document.getElementById("add-task-btn");
    let taskSum = document.getElementById("tasks-sum");
    let taskSumInt = parseInt(localStorage.getItem("tasksRecord"));

    if(!taskSumInt) {
        taskSumInt = 0;
        localStorage.setItem("tasksRecord", taskSumInt);
    }

    addTaskBtn.addEventListener("click", event => {
        taskSumInt += 1;
        localStorage.setItem("tasksRecord", taskSumInt);
        taskSum.innerHTML = taskSumInt;
    });

    //Everytime a user clicks on the Delete button, tasks summary will decrement by 1.
    const deleteTaskBtnArr = document.querySelectorAll(".task-btn.red-btn");
    // console.log(deleteTaskBtn);
    // console.log(typeof(taskSumInt));
    deleteTaskBtnArr.forEach(deleteBtn => {
        deleteBtn.addEventListener("click", event => {
            if(taskSumInt > 0) {
                taskSumInt -= 1;
                // console.log(taskSumInt);
                localStorage.setItem("tasksRecord", taskSumInt);
                taskSum.innerHTML = taskSumInt;
            }
        })
    })

    let tasksRecord = localStorage.getItem("tasksRecord");
    if(tasksRecord) {
        taskSum.innerHTML = tasksRecord;
    }



    // When a user clicks on the checkbox, completed increment by 1.
    // acquire the checkbox by its id
    // acquire completed calculator by its id, then key into innerHTML
    const completionCheckbox = document.querySelectorAll("#completion-checkbox");
    let completionSum = document.querySelector("#completed-sum");
    let completionSumInt = parseInt(localStorage.getItem("completed-tasks"));

    if(!completionSumInt) {
        completionSumInt = 0;
        localStorage.setItem("completed-tasks", completionSumInt);
    }

    completionCheckbox.forEach(checkbox => {
        checkbox.addEventListener("click", event => {
            completionSumInt += 1;
            localStorage.setItem("completed-tasks", completionSumInt);
            completionSum.innerHTML = completionSumInt;
        })
    })

    let completedTasksRecord = localStorage.getItem("completed-tasks");
    if(completedTasksRecord) {
        completionSum.innerHTML = completedTasksRecord;
    }
});


document
	.getElementById("nav-search-input")
	.addEventListener("search", async(event) => {
        const search = event.target.value;
        window.location.href=`http://localhost:8080/lists/searchResults/${search}`
    });
