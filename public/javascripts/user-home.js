window.addEventListener("DOMContentLoaded", (event) => {
	const tasks = getAllTasks();
	const taskListUL = document.getElementById("task-list-ul");
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
