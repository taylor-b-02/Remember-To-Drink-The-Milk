document.getElementById("nav-search-input").addEventListener('search', searchFunction);

function searchFunction() {
    const input = document.getElementById("nav-search-input");
    const inputValue = input.value;
    console.log(inputValue);
}
