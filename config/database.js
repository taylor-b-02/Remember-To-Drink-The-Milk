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
		use_env_variable: db_url,
		dialect: "postgres",
		seederStorage: "sequelize",
	},
};
