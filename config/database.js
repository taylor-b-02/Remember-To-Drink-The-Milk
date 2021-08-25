const {
	db: { username, password, database, host, db_url },
} = require("./index");

module.exports = {
	development: {
		username,
		password,
		database,
		host,
		dialect: "postgres",
	},
	production: {
		use_env_variable:
			"postgres://hxunyzivyxladn:f45b3efc67a9cc6be9be4291e6e5c76c9822fe42e6bb06ec2d3994cefc15823a@ec2-44-196-132-15.compute-1.amazonaws.com:5432/dcqvr2r0akrgq7",
		dialect: "postgres",
		seederStorage: "sequelize",
	},
};
