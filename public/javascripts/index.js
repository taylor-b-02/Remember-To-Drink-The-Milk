window.addEventListener("DOMContentLoaded", (event) => {
    document
	.getElementById("nav-search-input")
	.addEventListener("search", async(event) => {
        const search = event.target.value;
        window.location.href=`http://localhost:8080/lists/searchResults/${search}`
    });
})
