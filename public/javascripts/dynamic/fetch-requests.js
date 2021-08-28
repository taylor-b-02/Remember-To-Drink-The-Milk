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

export { patchTask, deleteTask, postTask, toggleComplete };
