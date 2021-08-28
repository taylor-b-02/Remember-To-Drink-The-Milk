import { taskBuilder, bulkTaskBuilder } from "./dynamic/create-tasks.js";
import { showTaskButtons, taskBtnPOST } from "./dynamic/event-callbacks.js";

window.addEventListener("DOMContentLoaded", async (event) => {
	const clickRevealEventListener = {
		eventType: "click",
		callback: showTaskButtons,
	};

	// Get the div container for incomplete tasks
	const incompleteDiv = document.querySelector("#incomplete-task-div");

	// Fetch all of a users tasks as objects
	const allTasks = await getAllTasks();

	// Convert the task objects to HTML elements with event listeners
	const taskElementArray = bulkTaskBuilder(
		allTasks,
		clickRevealEventListener
	);

	// Add the HTML elements to the div
	taskElementArray.forEach((element) => {
		incompleteDiv.appendChild(element);
	});

	// Add tasks to the current list
	const addTaskBtn = document.getElementById("add-task-btn");
	addTaskBtn.addEventListener("click", taskBtnPOST);

	/* ++++++++++++++++++CODE ABOVE THIS LINE HAS BEEN REFACTORED+++++++++++++++++++++++++++++++++++++++++ */

	// Load lists on left side bar
	const lists = await getLists();
	const nestedList = document.querySelector("#nested-list");
	lists.forEach((element) => {
		const listElement = document.createElement("li");
		listElement.setAttribute("data-list-id", element.id);
		listElement.innerHTML = `<div class="list-list-div">${element.name}</div`;

		listElement.addEventListener("click", async (event) => {
			event.stopPropagation();
			const taskContainer = document.getElementById(
				"incomplete-task-div"
			);
			taskContainer.innerHTML = ""; //TODO: Switch from deleting with .innerHTML, to .remove() for efficiency purposes
			const listId = listElement.getAttribute("data-list-id");
			const tasks = await getListById(listId);
			tasks.forEach((task) => {
				const taskHTML = `<div class='task-box' data-task-id='${task.id}'><input type="checkbox" name="isComplete" value="${task.isComplete}" required><span id="desciption-span">${task.description}<button hidden class="task-btn bule-btn">Edit</button><button hidden class="task-btn red-btn">Delete</button></span></input></div>`;
				taskContainer.innerHTML = taskContainer.innerHTML += taskHTML;
			});
			const taskInput = document.getElementById("add-task-input");
			taskInput.setAttribute("data-list-id", listId);
			//
		});
		nestedList.appendChild(listElement);
	});

	const listUL = document.getElementById("list-ul");
	const createList = document.createElement("li");
	createList.setAttribute("id", "create-list-element");
	createList.innerText = "Create a List";
	createList.addEventListener("click", (event) => {
		event.stopPropagation();
		createList.setAttribute("hidden", "hidden");
		const inputLI = document.createElement("li");
		const listInputField = document.createElement("input");
		listInputField.setAttribute("type", "text");
		const listInputSubmit = document.createElement("button");
		listInputSubmit.innerText = "Create List";
		listInputSubmit.addEventListener("click", async (event) => {
			const listName = listInputField.value;
			const id = await postList(listName);
			inputLI.remove();
			createList.removeAttribute("hidden");
		});
		inputLI.appendChild(listInputField);
		inputLI.appendChild(listInputSubmit);
		listUL.appendChild(inputLI);
	});
	listUL.appendChild(createList);
});

const getAllTasks = async () => {
	// const headers = new Headers();
	const request = new Request("http://localhost:8080/tasks", {
		method: "GET",
	});

	const response = await fetch(request);
	const responseArray = await response.json();

	return responseArray;
};

const getLists = async () => {
	const listReq = new Request("http://localhost:8080/lists", {
		method: "GET",
	});

	const taskLists = await fetch(listReq);
	const resJSON = await taskLists.json();
	const resArray = [...resJSON];
	return resArray;
};

const getListById = async (listId) => {
	const listReq = new Request(`http://localhost:8080/lists/${listId}/tasks`, {
		method: "GET",
	});

	const tasks = await fetch(listReq);
	const tasksJSON = await tasks.json();
	return tasksJSON;
};

const postList = async (listName) => {
	const data = JSON.stringify({ name: listName });
	const req = new Request("http://localhost:8080/lists/", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: data,
	});

	const id = await fetch(req);
	const idNum = await id.json();
	// console.log("ID:", idNum);
	// console.log(typeof idNum);
	return idNum;
};

//SEARCH
const getSearchResults = async () => {
	const searchReq = new Request("http://localhost:8080/lists/search", {
		method: "GET",
	});

	const searchList = await fetch(searchReq);
	const resJSON = await searchList.json();
	const resArray = [...resJSON];
	return resArray;
};
document
	.getElementById("nav-search-input")
	.addEventListener("search", getSearchResults);
