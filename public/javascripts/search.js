const db = require("../db/models");
const { User, Task } = db;

async function searchFunction() {
    const input = document.getElementById("nav-search-input");
    const inputValue = input.value;
    const userId = parseInt(req.params.id, 10);
    const tasks = await db.Task.findAll({
        where: {
            userId: userId,
            description: { $like: inputValue}
        },
    });
}
document.getElementById("nav-search-input").addEventListener('search', searchFunction);
