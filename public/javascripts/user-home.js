window.addEventListener("DOMContentLoaded", async (event) => {
	// Load lists on left side bar
	const lists = await getLists();
	const nestedList = document.querySelector("#nested-list");
	lists.forEach((element) => {
		const listElement = document.createElement("li");
		listElement.setAttribute("data-list-id", element.id);
		listElement.innerHTML = `<div class="list-list-div">${element.name}</div`;

		listElement.addEventListener("click", async (event) => {
			event.stopPropagation();
			const taskContainer = document.getElementById("task-list-ul");
			taskContainer.innerHTML = "";
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

	// Load all tasks to start
	const tasks = document.querySelectorAll(".task-box");
	tasks.forEach((taskElement) => {
		taskElement.addEventListener("click", (event) => {
			event.stopPropagation();
			event.preventDefault();

			const taskId = taskElement.getAttribute("data-task-id");

			const buttons = taskElement.querySelectorAll(".task-btn");
			buttons.forEach((button) => {
				if (button.getAttribute("hidden")) {
					button.removeAttribute("hidden");
				} else {
					button.setAttribute("hidden", "hidden");
				}
			});

			const deleteBtn = buttons[1];
			deleteBtn.addEventListener("click", (event) => {
				// Calls a helper function to remove the task from the database
				deleteTask(taskId);
				// 'Physically' removes the element from the HTML (Webpage)
				taskElement.remove();
			});

			const editBtn = buttons[0];
			editBtn.addEventListener("click", (event) => {
				event.stopPropagation();
				const taskSpan = taskElement.querySelector("#description-span");
				console.log(taskSpan);
				taskSpan.setAttribute("hidden", "hidden");
				const taskEditInput = document.createElement("input");
				taskEditInput.setAttribute("type", "text");
				taskEditInput.setAttribute("id", "task-edit-input");
				taskEditInput.value = taskSpan.innerText;
				taskElement.appendChild(taskEditInput);
				taskEditInput.addEventListener("click", (event) => {
					event.stopPropagation();
				});

				deleteBtn.setAttribute("hidden", "hidden");
				editBtn.setAttribute("hidden", "hidden");

				const saveBtn = document.createElement("button");
				saveBtn.setAttribute("class", "task-btn green-btn");
				saveBtn.innerText = "Save";
				taskElement.appendChild(saveBtn);

				saveBtn.addEventListener("click", (event) => {
					event.stopPropagation();
					const description =
						taskElement.querySelector("#task-edit-input").value;
					editTask(description, taskId);
					saveBtn.remove();
					taskSpan.innerText = taskEditInput.value;
					taskSpan.removeAttribute("hidden");
					taskEditInput.remove();
				});
			});

			// const taskDetail = document.querySelector(".task-detail-container");
			// function openSlideMenu(){
			// 	taskDetail.style.width = "327px"
			// };
		});
	});
	// LIST ID IS HARD-CODED MAKE SURE TO UPDATE IN FUTURE
	// ADD IN EVENT LISTENER FOR DISPLAYING/HIDING BUTTONS, ABSTRACT LISTENERS FROM ABOVE
	const addTaskBtn = document.getElementById("add-task-btn");
	addTaskBtn.addEventListener("click", (event) => {
		const addTaskInput = document.getElementById("add-task-input");
		const description = addTaskInput.value;
		const listId = addTaskInput.getAttribute("data-list-id");

		const createdTaskObj = addTask(description, listId);

		const taskId = createdTaskObj.id;
		const taskListUL = document.getElementById("task-list-ul");
		const taskListLI = document.createElement("li");
		const taskHTML = `<div class='task-box' data-task-id='${taskId}'><input type="checkbox" name="isComplete" value="${createdTaskObj.isComplete}" required><span id="desciption-span">${description}<button hidden class="task-btn bule-btn">Edit</button><button hidden class="task-btn red-btn">Delete</button></span></input></div>`;
		taskListLI.innerHTML = taskHTML;
		taskListUL.appendChild(taskListLI);
	});
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

const deleteTask = async (id) => {
	const request = new Request(`http://localhost:8080/tasks/${id}`, {
		method: "DELETE",
	});

	await fetch(request);
	return;
};

const addTask = async (description, listId) => {
	const data = JSON.stringify({ description: description, listId: listId });
	const request = new Request("http://localhost:8080/tasks/", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: data,
	});

	const createdTask = await fetch(request);
	const jsonObject = await createdTask.json();
	// console.log(jsonObject);
	// return JSON.parse(jsonObject);
	return jsonObject;
};

const editTask = async (description, taskId) => {
	const data = JSON.stringify({ description: description });
	const request = new Request(`http://localhost:8080/tasks/${taskId}`, {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
		},
		body: data,
	});

	await fetch(request);
	return;
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
