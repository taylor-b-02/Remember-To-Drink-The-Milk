import { taskBuilder } from "./create-tasks.js";
import {
	patchTask,
	deleteTask,
	postTask,
	toggleComplete,
} from "./fetch-requests.js";

function saveCallback(event) {
	event.stopPropagation();
	const taskContainer = event.target.parentElement;
	const taskEditInput = taskContainer.querySelector("#task-edit-input");
	const taskId = taskContainer.getAttribute("data-task-id");

	patchTask(taskEditInput.value, taskId);

	const descriptionSpan = taskContainer.querySelector(
		".task-description-span"
	);

	descriptionSpan.innerText = taskEditInput.value;
	descriptionSpan.removeAttribute("hidden");

	event.target.remove();
	taskEditInput.remove();
}

function editCallback(event) {
	/*  event.stopPropagation() is not used here because this allows the click event to bubble up and
        hide the edit and delete buttons as a side effect of the taskContainer eventlistener
    */
	const taskContainer = event.target.parentElement;
	const descriptionSpan = taskContainer.querySelector(
		".task-description-span"
	);
	descriptionSpan.setAttribute("hidden", "hidden");
	const taskEditInput = document.createElement("input");
	taskEditInput.setAttribute("type", "text");
	taskEditInput.setAttribute("id", "task-edit-input");
	taskEditInput.value = descriptionSpan.innerText;
	taskContainer.appendChild(taskEditInput);

	const saveBtn = document.createElement("button");
	saveBtn.setAttribute("class", "task-btn green-btn");
	saveBtn.innerText = "Save";
	taskContainer.appendChild(saveBtn);

	saveBtn.addEventListener("click", saveCallback);
}

function deleteCallback(event) {
	event.stopPropagation();
	const taskContainer = event.target.parentElement;
	const taskId = taskContainer.getAttribute("data-task-id");

	deleteTask(taskId);

	event.target.parentElement.remove();
}

// TODO: Add intermediary stage between checking a task, and updating the DB entry as (un)complete
// TODO: Transfer 'complete' items from the incomplete div to the complete divs
function checkCallback(event) {
	event.stopPropagation();
	const taskContainer = event.target.parentElement;
	const taskId = taskContainer.getAttribute("data-task-id");

	let checkedValue;

	if (this.checked) {
		checkedValue = true;
	} else {
		checkedValue = false;
	}

	toggleComplete(taskId, checkedValue);
}

const showTaskButtons = (event) => {
	event.stopPropagation();
	const taskContainer = event.currentTarget;

	// A boolean that represents whether or not the div was the primary target of the click event
	const spanRegex = /\<span class="task-description-span"\>.*\<\/span\>/g;

	let intendedTarget = false;

	if (
		event.currentTarget === event.target ||
		spanRegex.test(event.target.outerHTML)
	) {
		intendedTarget = true;
	}

	// A boolean that represents whether or not there is an text input field
	const noInput = !taskContainer.querySelector("#task-edit-input");

	// Get the edit and delete buttons from the current task container
	const [editBtn, deleteBtn] = taskContainer.querySelectorAll(".task-btn");

	// If the buttons are hidden and there is not a text input field, reveal the buttons, else hide them
	if (editBtn.getAttribute("hidden") && intendedTarget && noInput) {
		editBtn.removeAttribute("hidden");
		deleteBtn.removeAttribute("hidden");
	} else {
		editBtn.setAttribute("hidden", "hidden");
		deleteBtn.setAttribute("hidden", "hidden");
	}

	editBtn.addEventListener("click", editCallback);
	deleteBtn.addEventListener("click", deleteCallback);

	// Get the checkbox input field from the current task container
	const checkBox = taskContainer.querySelector(".task-checkbox");

	//  Updates whether a task isChecked in the DB
	checkBox.addEventListener("change", checkCallback);
};

const taskBtnPOST = async (event) => {
	event.stopPropagation();
	const addTaskInput = document.querySelector("#add-task-input");
	const description = addTaskInput.value;
	const listId = addTaskInput.getAttribute("data-list-id");

	const createdTaskObj = await postTask(description, listId);

	const incompleteDiv = document.querySelector("#incomplete-task-div");
	const createdTaskElement = taskBuilder(createdTaskObj, showTaskButtons);
	incompleteDiv.appendChild(createdTaskElement);
};

export { showTaskButtons, taskBtnPOST };
