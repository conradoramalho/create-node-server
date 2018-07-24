const CURR_DIR = process.cwd();

const INITIAL_DEPENDENCIES = {
  prod: [""],
  dev: [
    "@babel/cli",
    "@babel/core",
    "@babel/node",
    "@babel/plugin-proposal-optional-chaining",
    "@babel/plugin-proposal-pipeline-operator",
    "@babel/preset-env",
    "babel-eslint",
    "eslint",
    "nodemon"
  ]
};

module.exports = {
  CURR_DIR,
  INITIAL_DEPENDENCIES
};
