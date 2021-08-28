
router.get('/searchResults', requireAuth, asyncHandler(async(req, res, next) => {
    const { userId } = req.session.auth;
    const inputValue = document.getElementById('nav-search-input').value;
    const tasks = Task.findAll({
        where: {
            userId: userId,
        }
    });
    const lists = List.findAll({
        where: {
            ownerId: userId,
        }
    });

    const allListsTasks = [...tasks, ...lists];
    console.log(allListsTasks);
    const result = ultimate.filter(function(el) {
        if(el.name.includes(inputValue) || el.description.includes(inputValue)) {
            return el;
        }
    });
    res.render('search-results', {title: 'Search', inputValue, result} )

}))

//SEARCH
// router.get(
// 	"/search", requireAuth,
// 	asyncHandler(async (req, res) => {
// 		const { userId } = req.session.auth;
// 		const tasks = await db.Task.findAll({
//             where: {
//                 userId: userId,
//             },
//         });
//         const lists = await db.List.findAll({
//             where: {
//                 ownerId: userId,
//             },
//         });
//         const ultimate = [...tasks, ...lists]
//         const result = ultimate.filter(function(el) {
//             if(el.name.includes(inputValue) || el.description.includes(inputValue)) {
//                 return el;
//             }
//         });
//         if(!result) {
//             res.json(`Nothing found`);
//         }else{
//             res.json(result);
//         }
// 	})
// );
