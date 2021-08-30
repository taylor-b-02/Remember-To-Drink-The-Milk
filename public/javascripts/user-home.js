import { listBuilder, bulkListBuilder } from "./dynamic/create-lists.js";
import { taskBuilder, bulkTaskBuilder } from "./dynamic/create-tasks.js";
import {
	showTaskButtons,
	taskBtnPOST,
	displayList,
	createListInput,
} from "./dynamic/event-callbacks.js";

import {
	getAllTasks,
	getLists,
	postList,
	patchTask,
} from "./dynamic/fetch-requests.js";

window.addEventListener("DOMContentLoaded", async (event) => {
	/*------------------------------------------------------------------------------*/
	/*------------------------------Create List Button------------------------------*/
	/*------------------------------------------------------------------------------*/
	const createListDiv = document.createElement("div");
	createListDiv.setAttribute("id", "create-list-div");

	const createListSpan = document.createElement("button");
	createListSpan.innerText = "Create a List";
	createListSpan.addEventListener("click", createListInput);

	createListDiv.appendChild(createListSpan);

	listDisplayDiv.appendChild(createListDiv);

	/*-------------------------------------------------------------------------------------------*/
	/*------------------------------Load all tasks on the main page------------------------------*/
	/*-------------------------------------------------------------------------------------------*/
	const clickRevealEventListener = {
		eventType: "click",
		callback: showTaskButtons,
	};

	// Get the div container for incomplete tasks
	const incompleteDiv = document.querySelector("#incomplete-task-div");

	// Fetch all of a users tasks as objects
	const allTasks = await getAllTasks();

	// Convert the task objects into HTML elements with event listeners
	const taskElementArray = bulkTaskBuilder(
		allTasks,
		clickRevealEventListener
	);

	// Add the HTML elements to the div
	taskElementArray.forEach((element) => {
		incompleteDiv.appendChild(element);
	});

	/*--------------------------------------------------------------------------------------*/
	/*------------------------------Enable The Add Task Button------------------------------*/
	/*--------------------------------------------------------------------------------------*/
	const addTaskBtn = document.getElementById("add-task-btn");
	addTaskBtn.addEventListener("click", taskBtnPOST);

	/*--------------------------------------------------------------------------------------*/
	/*------------------------------Load lists on left sidebar------------------------------*/
	/*--------------------------------------------------------------------------------------*/
	const listDisplayDiv = document.querySelector("#list-display-div");

	// Fetch all of a users lists as objects
	const allLists = await getLists();

	// Convert the list objecst into HTML elements with event listeners
	const clickShowList = {
		eventType: "click",
		callback: displayList,
	};
	const listElementArray = bulkListBuilder(allLists, clickShowList);
	// Add individual lists to the sidebar
	listElementArray.forEach((element) => {
		listDisplayDiv.appendChild(element);
	});

	/*-----------------------------------------------------------------------------------------------*/
	/*------------------------------Edit button for tasks on slide menu------------------------------*/
	/*-----------------------------------------------------------------------------------------------*/
	const editBtn = document.querySelector("#edit-button");
	editBtn.addEventListener("click", async (event) => {
		event.stopPropagation();
		const editField = document.querySelector("#editing");
		const newDescription = editField.value;
		const id = editField.getAttribute("data-task-id");
		console.log("ID", id);
		await patchTask(newDescription, id);
		const originalTask = document.querySelector(`[id='${id}']`);
		// console.log("originalTask", originalTask);
		originalTask.querySelector(".task-description-span").innerText =
			newDescription;
	});
});

document
	.getElementById("nav-search-input")
	.addEventListener("search", async (event) => {
		const search = event.target.value;
		window.location.href = `http://localhost:8080/lists/searchResults/${search}`;
	});
