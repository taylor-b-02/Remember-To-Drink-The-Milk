import Scroll from "./scroll.js";

// window.addEventListener("load", (event)=>{
//     console.log("hello from javascript!")
// })

window.addEventListener("load", (event) => {
	new Scroll().play();
});

window.addEventListener("DOMContentLoaded", (event) => {
	document
		.getElementById("nav-search-input")
		.addEventListener("search", async (event) => {
			const search = event.target.value;
			window.location.href = `https://remeber-to-drink-the-milk.herokuapp.com/lists/searchResults/${search}`;
		});
});
