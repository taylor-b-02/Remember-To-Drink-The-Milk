const express = require("express");
const router = express.Router();
const db = require("../db/models");
const bcrypt = require("bcryptjs");
const path = require("path");
const { loginUser, logoutUser, restoreUser, requireAuth } = require("../auth");

const {
	csrfProtection,
	asyncHandler,
	handleValidationErrors,
} = require("../utils");

const { check } = require("express-validator");
const { profile } = require("console");

const { User } = db;

router.use(express.static("public"));

const loginValidator = [
	check("loginIdentifier")
		.exists({ checkFalsy: true })
		.withMessage(
			"Please provide your Username or Email Address for authentication"
		),
	check("password")
		.exists({ checkFalsy: true })
		.withMessage("Please provide a value for Password"),
];

const passwordValidator = [
    check("password")
		.exists({ checkFalsy: true })
		.withMessage("Please provide a value for Password")
		.isLength({ max: 50 })
		.withMessage("Password must not be more than 50 characters long")
		.matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/, "g")
		.withMessage(
			'Password must contain at least 1 lowercase letter, uppercase letter, number, and special character (i.e. "!@#$%^&*")'
		),
	check("confirmPassword")
		.exists({ checkFalsy: true })
		.withMessage("Please provide a value for Confirm Password")
		.isLength({ max: 50 })
		.withMessage(
			"Confirm Password must not be more than 50 characters long"
		)
]

const userValidators = [
	check("username")
		.exists({ checkFalsy: true })
		.withMessage("Please provide a value for User Name")
		.isLength({ max: 50 })
		.withMessage("User Name must not be more than 50 characters long"),
	check("email")
		.exists({ checkFalsy: true })
		.withMessage("Please provide a value for Email Address")
		.isLength({ max: 150 })
		.withMessage("Email Address must not be more than 150 characters long")
		.isEmail()
		.withMessage("Email Address is not a valid email")
		.custom((value) => {
			return db.User.findOne({ where: { email: value } }).then((user) => {
				if (user) {
					return Promise.reject(
						"The provided Email Address is already in use by another account"
					);
				}
			});
		}),
	check("password")
		.exists({ checkFalsy: true })
		.withMessage("Please provide a value for Password")
		.isLength({ max: 50 })
		.withMessage("Password must not be more than 50 characters long")
		.matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/, "g")
		.withMessage(
			'Password must contain at least 1 lowercase letter, uppercase letter, number, and special character (i.e. "!@#$%^&*")'
		),
	check("confirmPassword")
		.exists({ checkFalsy: true })
		.withMessage("Please provide a value for Confirm Password")
		.isLength({ max: 50 })
		.withMessage(
			"Confirm Password must not be more than 50 characters long"
		),
	check("dateOfBirth")
		.exists({ checkFalsy: true })
		.withMessage("Please provide your date of birth"),
];

/* GET users listing. */
//GET user profile
router.get(
	"/:id(\\d+)/profile", // add /profile?edit?
	requireAuth,
	asyncHandler(async (req, res, next) => {
		const userId = parseInt(req.params.id, 10);
		const user = await db.User.findByPk(userId);
		res.render("user-profile", { title: "User", user });
	})
);

//GET user main page
router.get(
	"/:id(\\d+)",
	requireAuth,
	asyncHandler(async (req, res, next) => {
		const userId = parseInt(req.params.id, 10);
		const user = await db.User.findByPk(userId);
		res.render("user-home", { title: "Home", user });
	})
);

//GET registration page with form
router.get(
	"/register",
	csrfProtection,
	asyncHandler(async (req, res) => {
		res.render("user-register", {
			title: "Register",
			csrfToken: req.csrfToken(),
		});
	})
);

//GET login page with form
router.get(
	"/login",
	csrfProtection,
	asyncHandler(async (req, res) => {
		res.render("user-login", {
			title: "Login",
			csrfToken: req.csrfToken(),
		});
	})
);

//POST to login page (log in)
router.post(
	"/login",
	csrfProtection,
	loginValidator,
	handleValidationErrors,
	asyncHandler(async (req, res, next) => {
		const { loginIdentifier, password } = req.body;
		let user;
            if (loginIdentifier.includes("@")) {
                user = await User.findOne({
                    where: {
                        email: loginIdentifier,
                    },
                });
            } else {
                user = await user.findOne({
                    where: {
                        username: loginIdentifier,
                    },
                });
            }

		// const match = await bcrypt.compare(password, user.hashedPassword);
		const passwordMatch = await bcrypt.compare(
			password,
			user.hashedPassword.toString()
		);

		if (passwordMatch) {
			loginUser(req, res, user);
			return res.redirect(`/users/${user.id}`); //:id(\\d+
        }
		// errors(
		// 	"Login failed for the provided email address/username and password"
		// );
		// next()

		res.render("user-login", {
			title: "Login",
			loginIdentifier,
			errors,
			csrfToken: req.csrfToken(),
		});
	})
);

//POST logout page with form
router.post("/logout", (req, res) => {
	logoutUser(req, res);
	res.redirect("/");
});

//POST new users (register)
router.post(
	"/register",
	csrfProtection,
	userValidators,
	handleValidationErrors,
	asyncHandler(async (req, res, next) => {
		const { username, email, password, dateOfBirth } = req.body;
		console.log(username);
		console.log(email);
		console.log(password);
		console.log(dateOfBirth);

		const hashedPassword = await bcrypt.hash(password, 10);

		const newUser = await User.create({
			userName: username,
			email: email,
			hashedPassword: hashedPassword,
			dateOfBirth: dateOfBirth,
		});
		res.redirect(`/users/${newUser.id}`); //could be /:id(\\d+)
	})
);

//GET profile edit page
router.get('/:id(\\d+)/profile/edit', requireAuth, csrfProtection, asyncHandler(async(req, res, next) => {
    const userId = parseInt(req.params.id, 10);
	const user = await db.User.findByPk(userId);
    res.render('user-edit-profile', { title: "edit-profile", user, csrfToken: req.csrfToken()})
}));

//PATCH edit to profile
router.post('/:id(\\d+)/profile/edit', requireAuth, csrfProtection, asyncHandler(async(req, res, next) => {
    const userId = parseInt(req.params.id, 10);
    const userToUpdate = await db.User.findByPk(userId);

    const {
        userName,
        email
    } = req.body;

    const user = {
        userName,
        email
    }

    await userToUpdate.update(user);
    res.redirect(`/${userId}/profile`);

}));

router.get('/:id(\\d+)/edit-password', requireAuth, csrfProtection, asyncHandler(async(req, res, next) => {
    const userId = parseInt(req.params.id, 10);
	const user = await db.User.findByPk(userId);
    res.render('user-edit-password', { title: "edit-password", user, csrfToken: req.csrfToken()})
}));

router.post('/:id(\\d+)/edit-password', requireAuth, passwordValidator, csrfProtection, asyncHandler(async(req, res, next) => {
    const userId = parseInt(req.params.id, 10);
    const userToUpdate = await db.User.findByPk(userId);

    const {
        newPassword
    } = req.body;

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const user = {
        hashedPassword
    }

    await userToUpdate.update(user);
    res.redirect(`/users/${userId}/profile`);

}));

module.exports = router;
