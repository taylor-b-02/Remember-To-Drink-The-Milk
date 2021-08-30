function taskBuilder(task, eventListener) {
	// Create and configure the wrapper div for the individual task
	const taskContainerDiv = document.createElement("div");
	taskContainerDiv.setAttribute("class", "task-container-div");
	// replaced the data-task-id to id to access taskId, renamed all data-task-id to id
	taskContainerDiv.setAttribute("id", task.id);
	// Create the checkbox for the task
	const taskCheckbox = document.createElement("input");
	taskCheckbox.setAttribute("type", "checkbox");
	taskCheckbox.setAttribute("class", "task-checkbox");
	taskCheckbox.checked = task.isComplete;

	// Create the span (for the description) of the task
	const taskDescriptionSpan = document.createElement("span");
	taskDescriptionSpan.setAttribute("class", "task-description-span");
	taskDescriptionSpan.innerText = task.description;

	// Create the edit and delete buttons for the task (hidden until clicked)
	const taskEditBtn = document.createElement("button");
	const taskDeleteBtn = document.createElement("button");

	taskEditBtn.setAttribute("class", "task-btn blue-btn"); // Set the class of the button and hide it
	taskEditBtn.innerText = "Edit";
	taskEditBtn.setAttribute("hidden", "hidden");

	taskDeleteBtn.setAttribute("class", "task-btn red-btn"); // Set the class of the button and hide it
	taskDeleteBtn.innerText = "Delete";
	taskDeleteBtn.setAttribute("hidden", "hidden");

	// Place all newly generated elements into the taskContainerDiv
	taskContainerDiv.appendChild(taskCheckbox); // Append the checkbox
	taskContainerDiv.appendChild(taskDescriptionSpan); // Append the description span
	taskContainerDiv.appendChild(taskEditBtn); // Append the edit and delete buttons
	taskContainerDiv.appendChild(taskDeleteBtn);

	// Add the provided event listener to the div
	taskContainerDiv.addEventListener(
		eventListener.eventType,
		eventListener.callback
	);

	// Return the newly created task Div
	return taskContainerDiv;
}

function bulkTaskBuilder(taskArr, eventListener) {
	// Create an empty array to hold the elements
	let taskElementArr = [];

	// Loop through the array of task objects
	taskArr.forEach((task) => {
		// Convert the task object into an HTML element and append that to a bulk list of elements
		taskElementArr.push(taskBuilder(task, eventListener));
	});

	// Return the bulk array of HTML elements
	return taskElementArr;
}

export { taskBuilder, bulkTaskBuilder };
