const express = require("express");
const router = express.Router();
const db = require("../db/models");
const bcrypt = require("bcryptjs");
const {
	csrfProtection,
	asyncHandler,
	handleValidationErrors,
} = require("../utils");

const { check } = require("express-validator");

const { User } = db;

const loginValidator = [
	check("login-identifier")
		.exists({ checkFalsy: true })
		.withMessage(
			"Please provide your Username or Email Address for authentication"
		),
	check("password")
		.exists({ checkFalsy: true })
		.withMessage("Please provide a value for Password"),
];

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
			return db.User.findOne({ where: { email: value } }).then(
				(user) => {
					if (user) {
						return Promise.reject(
							"The provided Email Address is already in use by another account"
						);
					}
				}
			);
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
	"/:id(\\d+)/edit", // add /profile?edit?
	asyncHandler(async (req, res, next) => {
		const userId = parseInt(req.params.id, 10);
		const user = await db.User.findByPk(userId);
		res.render("user-profile", { title: "User", user });
	})
);

//GET user main page
router.get(
    "/:id(\\d+)",
    asyncHandler(async(req, res, next) => {
        const userId = parseInt(req.params.id, 10);
		const user = await db.User.findByPk(userId);
        res.render("user-home", { title: "Home", user } )
    })
)

//GET registration page with form
router.get(
	"/register",
	csrfProtection,
	asyncHandler(async (req, res) => {
		res.render("user-register", { title: "Register", csrfToken: req.csrfToken() });
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
	asyncHandler(async (req, res) => {
		const { loginIdentifier, password } = req.body;

		let errors = [];
		const validatorErrors = validationResult(req);
		if (user) {
			if (loginIdentifier.includes("@")) {
				const user = await User.findOne({
					where: {
						email: loginIdentifier,
					},
				});
			} else {
				const user = await user.findOne({
					where: {
						username: loginIdentifier,
					},
				});
			}

			if (validatorErrors.isEmpty()) {
				// const match = await bcrypt.compare(password, user.hashedPassword);
				const passwordMatch = await bcrypt.compare(
					password,
					user.hashedPassword.toString()
				);

				if (passwordMatch) {
					loginUser(req, res, user);
					return res.redirect("/:id(\\d+)");
				}
				errors.push(
					"Login failed for the provided email address/username and password"
				);
			} else {
				errors = validatorErrors.array().map((error) => error.msg);
			}
		}

		res.render("user-login", {
			title: "Login",
			loginIdentifier,
			errors,
			csrfToken: req.csrfToken(),
		});
	})
);

//GET login page with form
router.get(
	"/logout",
	csrfProtection,
	asyncHandler(async (req, res) => {})
);

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

		await User.create({
			userName: username,
			email: email,
			hashedPassword: hashedPassword,
			dateOfBirth: dateOfBirth,
		});
		res.redirect("/"); //could be /:id(\\d+)
	})
);

module.exports = router;
