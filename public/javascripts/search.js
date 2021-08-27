
function searchFunction() {
    const input = document.getElementById("nav-search-input");
    const inputValue = input.value;
    console.log(inputValue);
}
document.getElementById("nav-search-input").addEventListener('search', searchFunction);
