import { listBuilder, bulkListBuilder } from "./dynamic/create-lists.js";
import { taskBuilder, bulkTaskBuilder } from "./dynamic/create-tasks.js";
import {
	showTaskButtons,
	taskBtnPOST,
	displayList,
	createListInput,
} from "./dynamic/event-callbacks.js";

import { getAllTasks, getLists, postList } from "./dynamic/fetch-requests.js";

window.addEventListener("DOMContentLoaded", async (event) => {
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

	/* +++++++++++++++++++++++++++++CODE ABOVE THIS LINE HAS BEEN REFACTORED++++++++++++++++++++++++++++++++ */

	// const listUL = document.getElementById("list-display-div");
	// const createList = document.createElement("div");
	// createList.setAttribute("id", "create-list-element");
	// createList.innerText = "Create a List";
	// createList.addEventListener("click", (event) => {
	// event.stopPropagation();
	// createList.setAttribute("hidden", "hidden");
	// const inputLI = document.createElement("li");
	// const listInputField = document.createElement("input");
	// listInputField.setAttribute("type", "text");
	// const listInputSubmit = document.createElement("button");
	// listInputSubmit.innerText = "Create List";
	// listInputSubmit.addEventListener("click", async (event) => {
	// 	const listName = listInputField.value;
	// 	const id = await postList(listName);
	// 	inputLI.remove();
	// 	createList.removeAttribute("hidden");
	// });
	// inputLI.appendChild(listInputField);
	// inputLI.appendChild(listInputSubmit);
	// listUL.appendChild(inputLI);
	// });

	const createListDiv = document.createElement("div");
	createListDiv.setAttribute("id", "create-list-div");

	const createListSpan = document.createElement("span");
	createListSpan.innerText = "Create a List";
	createListSpan.addEventListener("click", createListInput);

	createListDiv.appendChild(createListSpan);

	listDisplayDiv.appendChild(createListDiv);
});

document
	.getElementById("nav-search-input")
	.addEventListener("search", async (event) => {
		const search = event.target.value;
		window.location.href = `http://localhost:8080/lists/searchResults/${search}`;
	});
