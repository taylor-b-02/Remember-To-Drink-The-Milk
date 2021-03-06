import { listBuilder } from "./create-lists.js";
import { bulkTaskBuilder, taskBuilder } from "./create-tasks.js";
import {
	patchTask,
	deleteTask,
	postTask,
	toggleComplete,
	getListById,
	postList,
} from "./fetch-requests.js";

function saveCallback(event) {
	event.stopPropagation();
	const taskContainer = event.target.parentElement;
	const taskEditInput = taskContainer.querySelector("#task-edit-input");
	const taskId = taskContainer.getAttribute("id");

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
	const taskId = taskContainer.getAttribute("id");

	deleteTask(taskId);

	event.target.parentElement.remove();
	//when user click on Add Task button, Tasks Sum decrement by 1.
	const taskSum = document.querySelector("#tasks-sum");
	if (taskSum.innerHTML > 0) {
		taskSum.innerHTML -= 1;
	}
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
	if (deleteBtn.getAttribute("hidden") && intendedTarget && noInput) {
		// editBtn.removeAttribute("hidden");
		deleteBtn.removeAttribute("hidden");
	} else {
		// editBtn.setAttribute("hidden", "hidden");
		deleteBtn.setAttribute("hidden", "hidden");
	}

	// editBtn.addEventListener("click", editCallback);
	deleteBtn.addEventListener("click", deleteCallback);

	// Get the checkbox input field from the current task container
	const checkBox = taskContainer.querySelector(".task-checkbox");

	//  Updates whether a task isChecked in the DB
	checkBox.addEventListener("change", checkCallback);

	const editField = document.querySelector("#editing");
	editField.setAttribute(
		"data-task-id",
		event.currentTarget.getAttribute("id")
	);
	let currentDescription;
	if (event.currentTarget.innerHTML) {
		currentDescription = event.currentTarget.innerHTML;
		currentDescription = currentDescription.split(
			'<span class="task-description-span">'
		)[1];
		currentDescription = currentDescription.split("</span>")[0];
	} else {
		currentDescription = event.currentTarget.innerText;
	}
	editField.value = currentDescription;
};

const taskBtnPOST = async (event) => {
	//when user click on Add Task button, Tasks Sum increment by 1.
	let incrementTask = document.querySelector("#tasks-sum");
	let sumStr = incrementTask.innerHTML;
	sumStr = Number(sumStr) + 1;
	incrementTask.innerHTML = sumStr;

	event.stopPropagation();
	const addTaskInput = document.querySelector("#add-task-input");
	const description = addTaskInput.value;
	const listId = addTaskInput.getAttribute("data-list-id");
	const createdTaskObj = await postTask(description, listId);
	const incompleteDiv = document.querySelector("#incomplete-task-div");
	const clickRevealEventListener = {
		eventType: "click",
		callback: showTaskButtons,
	};
	const createdTaskElement = taskBuilder(
		createdTaskObj,
		clickRevealEventListener
	);
	incompleteDiv.appendChild(createdTaskElement);

	const newTaskSum = createdTaskObj.unfinishedTasks.length;
	const numTasks = document.querySelector("#tasks-sum");
	numTasks.innerHTML = newTaskSum;
};

const displayList = async (event) => {
	// 1. stopPropogation()
	event.stopPropagation();

	const listTitle = document.querySelector("#list-title");
	listTitle.innerText = event.target.innerText;

	// 2. Clear taskDivs so that the list specifc tasks can be displayed
	const incompleteDiv = document.querySelector("#incomplete-task-div");
	// const incompleteDiv = document.getElementById("incomplete-task-div");
	while (incompleteDiv.firstChild) {
		incompleteDiv.firstChild.remove();
	}

	// 3. GET the list specific tasks
	const listId = event.target.getAttribute("data-list-id");
	const tasks = await getListById(listId);
	const clickRevealEventListener = {
		eventType: "click",
		callback: showTaskButtons,
	};

	const taskElementArray = bulkTaskBuilder(tasks, clickRevealEventListener);

	taskElementArray.forEach((div) => {
		let checkbox = div.firstChild;
		// checkbox.checked = true;
		checkbox.addEventListener("click", async (event) => {
			// add stopPropagation so if user click on checkbox, the task detail will not slide out.
			event.stopPropagation();
			let completedSum = document.querySelector("#completed-sum");
			let completedVal = Number(completedSum.innerHTML);
			if (event.target.checked) {
				completedVal += 1;
				completedSum.innerHTML = completedVal;
			} else {
				completedVal -= 1;
				completedSum.innerHTML = completedVal;
			}

			//updating the database
			const response = await fetch(
				`/tasks/${event.target.parentNode.id}/toggleComplete/`,
				{
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						isComplete: true,
					}),
				}
			);
		});
	});

	// when users click on each raw of task, task detail page slide out
	const taskEdit = document.querySelector(".task-detail-container");
	taskElementArray.forEach((div) => {
		div.addEventListener("click", (event) => {
			taskEdit.style.animationName = "slideout";
			setTimeout(() => {
				taskEdit.style.left = 0;
			}, 300);
		});
	});

	// when users click on All Tasks and the left arrow in task detail page, the page slide back in
	const closeBtn = document.querySelector(".btn-close");
	closeBtn.addEventListener("click", (e) => {
		taskEdit.style.animationName = "slidein";
		setTimeout(() => {
			taskEdit.style.left = "100%";
		}, 300);
	});

	// when user click on each list, update list name dynamically in task detail page.
	const listName = event.target.innerHTML;
	let listSpan = document.querySelector(".list-content");
	listSpan.innerHTML = listName;

	// 4. Display the list specific tasks in their respective taskDivs
	taskElementArray.forEach((element) => {
		incompleteDiv.appendChild(element);
	});

	// 5. Set the add-task-input to the id of the current list
	const taskInput = document.querySelector("#add-task-input");
	taskInput.setAttribute("data-list-id", listId);

	// when a user click on a particular list name, task sum is updated to the total tasks of that list
	const listTasks = document.querySelector("#tasks-sum");
	listTasks.innerHTML = tasks.length;

	// when a user click on a particular list name, completed sum is updated dynamically
	const completedTasks = document.querySelector("#completed-sum");
	const completedTaskArr = tasks.filter((taskObj) => taskObj.isComplete);
	completedTasks.innerHTML = completedTaskArr.length;
};

// TODO: Add intermediary stage between checking a task, and updating the DB entry as (un)complete
// TODO: Transfer 'complete' items from the incomplete div to the complete divs
function checkCallback(event) {
	event.stopPropagation();
	const taskContainer = event.target.parentElement;
	const taskId = taskContainer.getAttribute("id");

	let checkedValue;

	if (this.checked) {
		checkedValue = true;
	} else {
		checkedValue = false;
	}

	toggleComplete(taskId, checkedValue);
}

const createListInput = (event) => {
	event.stopPropagation();
	const createListSpan = event.target;
	createListSpan.setAttribute("hidden", "hidden");
	const listInputField = document.createElement("input");
	listInputField.setAttribute("type", "text");
	const listInputSubmit = document.createElement("button");
	listInputSubmit.innerText = "Create List";

	const submitNewList = async (event) => {
		const listName = listInputField.value;

		const id = await postList(listName);
		const clickShowList = {
			eventType: "click",
			callback: displayList,
		};
		const listDiv = listBuilder({ name: listName, id: id }, clickShowList);
		createListSpan.parentElement.appendChild(listDiv);
		listInputSubmit.remove();
		listInputField.remove();
		createListSpan.removeAttribute("hidden");
	};

	listInputSubmit.addEventListener("click", submitNewList);
	event.target.parentElement.appendChild(listInputSubmit);
	event.target.parentElement.appendChild(listInputField);
};

export { showTaskButtons, taskBtnPOST, displayList, createListInput };
