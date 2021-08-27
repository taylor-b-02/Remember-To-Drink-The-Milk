window.addEventListener("DOMContentLoaded", async (event) => {
	const lists = await getLists();
	const nestedList = document.querySelector("#nested-list");

	lists.forEach((element) => {
		const listElement = document.createElement("li");
		listElement.setAttribute("data-list-id", element.id);
		listElement.innerHTML = `<div class="list-list-div">${element.name}</div`;

		listElement.addEventListener("click", (event) => {
			event.stopPropagation();
			const taskContainer = document.getElementById("task-container");
			taskContainer.innerHTML = "";
			console.log("taskContainer:", taskContainer);
			console.log("Clicked on a list");
			nestedList.appendChild(listElement);
		});
	});

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
		});
	});
	// LIST ID IS HARD-CODED MAKE SURE TO UPDATE IN FUTURE
	// ADD IN EVENT LISTENER FOR DISPLAYING/HIDING BUTTONS, ABSTRACT LISTENERS FROM ABOVE
	const addTaskBtn = document.getElementById("add-task-btn");
	addTaskBtn.addEventListener("click", (event) => {
		const addTaskInput = document.getElementById("add-task-input");
		const description = addTaskInput.value;
		const listId = 1;

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
	const jsonTask = await createdTask.json();
	console.log(jsonTask);
	return JSON.parse(jsonTask);
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
