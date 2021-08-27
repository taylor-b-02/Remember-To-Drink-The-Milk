window.addEventListener("DOMContentLoaded", event => {

    // Everytime a user clicks on Add Task button, tasks summary will increment by 1.
    const addTaskBtn = document.querySelector("#add-task-btn");
    let TaskSum = document.querySelector("#tasks-sum");
    let TaskSumInt = parseInt(TaskSum.innerHTML);

    addTaskBtn.addEventListener("click", (event) => {
        TaskSumInt += 1;
        TaskSum.innerHTML = TaskSumInt;
    });

    // Everytime a user clicks on the Delete button, tasks summary will decrement by 1.
    const deleteTaskBtn = document.querySelector(".task-btn.red-btn");

    deleteTaskBtn.addEventListener("click", (event) => {
        TaskSumInt -= 1;
        TaskSum.innerHTML = TaskSumInt;
    })

    // When a user clicks on the checkbox, completed increment by 1.
    // acquire the checkbox by its id
    // acquire completed calculator by its id, then key into innerHTML
    const completionCheckbox = document.querySelector("#completion-checkbox");
    let completionSum = document.querySelector("#completed-sum");
    console.log(`Is there a sum: ${completionSum}`);
    let completionSumInt = parseInt(completionSum.innerHTML);

    completionCheckbox.addEventListener("click", (event) => {
        completionSumInt += 1;
        completionSum.innerHTML = completionSumInt;
    })

});
