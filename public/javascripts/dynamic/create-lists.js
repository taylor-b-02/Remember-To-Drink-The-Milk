function listBuilder(list, eventListener) {
	// Create and configure the wrawpper div for the individual list
	const listContainerDiv = document.createElement("div");
	listContainerDiv.setAttribute("class", "list-container-div");
	listContainerDiv.setAttribute("data-list-id", list.id);
	list.innerText = list.name;

	// Add the click event listener to the list div
	list.addEventListner(eventListener.eventType, eventListener.callback);
}

function bulkListBuilder(listArr, eventListener) {
	// Create an empty array to hold the elements
	let listElementArr = [];

	// Loop through the array of list objects
	listArr.forEach((list) => {
		// Convert the list object into an HTML element and append that to a bulk list of elements
		listElementArr.push(listBuilder(list, eventListener));
	});

	// Return the bulk array of HTML elements
	return listElementArr;
}

export { listBuilder, bulkListBuilder };
