#!/usr/bin/env node
const inquirer = require("inquirer");
const fs = require("fs");
const clear = require("clear");
const chalk = require("chalk");
const figlet = require("figlet");
const statics = require("./lib/statics");
const install = require("./lib/install");
const createDirectoryContents = require("./lib/files");

const { INITIAL_DEPENDENCIES } = statics;

const PROJECT_TYPES = fs.readdirSync(`${__dirname}/templates`);

const QUESTIONS = [
  {
    name: "project-choice",
    type: "list",
    message: "What boilerplate would you like to use?",
    choices: PROJECT_TYPES
  },
  {
    name: "project-name",
    type: "input",
    message: "Project name:",
    validate: input => {
      return /^([A-Za-z\-\_\d])+$/.test(input)
        ? true
        : "Project name may only include letters, numbers, underscores or hashes.";
    }
  }
];

const CURR_DIR = process.cwd();

const init = async () => {
  clear();

  console.log(chalk.redBright(figlet.textSync("CREATE NODE SERVER")));

  const answers = await inquirer.prompt(QUESTIONS);

  const projectChoice = answers["project-choice"];
  const projectName = answers["project-name"];
  const templatePath = `${__dirname}/templates/${projectChoice}`;

  fs.mkdirSync(`${CURR_DIR}/${projectName}`);

  const packageJson = {
    name: projectName,
    version: "0.1.0",
    private: true,
    scripts: {
      start: "node ./dist/server.js",
      dev: "nodemon ./src/server.js --exec babel-node",
      build: "babel ./src -d ./dist --source-maps",
      precommit: "pretty-quick --staged"
    }
  };

  fs.writeFileSync(
    `${CURR_DIR}/${projectName}/package.json`,
    JSON.stringify({ ...packageJson }, null, 2)
  );

  createDirectoryContents(templatePath, projectName);

  process.chdir(`${CURR_DIR}/${projectName}`);

  readAndInstallDep(`${__dirname}/templates/${projectChoice}/dependencies`);
};

const readAndInstallDep = async path => {
  const contents = fs.readFileSync(path, "utf8");

  const { prod, dev } = JSON.parse(contents);

  const dependencies = {
    prod: [...INITIAL_DEPENDENCIES.prod, ...prod],
    dev: [...INITIAL_DEPENDENCIES.dev, ...dev]
  };

  await install(dependencies);
};

init();
