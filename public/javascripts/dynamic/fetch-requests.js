const patchTask = async (description, taskId) => {
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

const deleteTask = async (id) => {
	const request = new Request(`http://localhost:8080/tasks/${id}`, {
		method: "DELETE",
	});

	await fetch(request);
	return;
};

const postTask = async (description, listId) => {
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

const toggleComplete = async (taskId, checkedValue) => {
	const data = JSON.stringify({ isComplete: checkedValue });
	const request = new Request(
		`http://localhost:8080/tasks/${taskId}/toggleComplete`,
		{
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
			},
			body: data,
		}
	);

	await fetch(request);
	return;
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

const getListById = async (listId) => {
	const listReq = new Request(`http://localhost:8080/lists/${listId}/tasks`, {
		method: "GET",
	});

	const tasks = await fetch(listReq);
	const tasksJSON = await tasks.json();
	return tasksJSON;
};

const getAllTasks = async () => {
	// const headers = new Headers();
	const request = new Request("http://localhost:8080/tasks", {
		method: "GET",
	});

	const response = await fetch(request);
	const responseArray = await response.json();
	console.log(responseArray);
	const allTasksSum = document.querySelector("#tasks-sum");
	allTasksSum.innerHTML = responseArray.length;

	const completedTasks = document.querySelector("#completed-sum");
	const completedTaskArr = responseArray.filter(taskObj => taskObj.isComplete)
	completedTasks.innerHTML = completedTaskArr.length;

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

export {
	patchTask,
	deleteTask,
	postTask,
	toggleComplete,
	getListById,
	getAllTasks,
	getLists,
	postList,
};
