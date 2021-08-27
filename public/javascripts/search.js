// const db = require("../db/models");
// const { User, Task, List } = db;

// async function searchFunction(req, res) {
//     const input = document.getElementById("nav-search-input");
//     const inputValue = input.value;
//     const userId = parseInt(req.params.id, 10);
//     const tasks = await db.Task.findAll({
//         where: {
//             userId: userId,
//         },
//     });
//     const lists = await db.List.findAll({
//         where: {
//             userId: userId,
//         },
//     });
//     const ultimate = [...tasks, ...lists]
//     const result = ultimate.filter(function(el) {
//         if(el.name.includes(inputValue) || el.description.includes(inputValue)) {
//             return el;
//         }
//     });
//     console.log(result);
// }
// document.getElementById("nav-search-input").addEventListener('search', searchFunction);
