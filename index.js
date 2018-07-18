#!/usr/bin/env node

const inquirer = require("inquirer");
const fs = require("fs");
const clear = require("clear");
const chalk = require("chalk");
const figlet = require("figlet");
const CLI = require("clui");

const Spinner = CLI.Spinner;

const CHOICES = fs.readdirSync(`${__dirname}/templates`);
const CURR_DIR = process.cwd();

const QUESTIONS = [
  {
    name: "project-choice",
    type: "list",
    message: "What project boilerplate would you like to use?",
    choices: ["SQL", "Mongo", "ElasticSearch", "ExpressGraphql"]
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

const createDirectoryContents = (templatePath, newProjectPath) => {
  const status = new Spinner("Creating project, please wait...");

  status.start();

  const filesToCreate = fs.readdirSync(templatePath);

  filesToCreate.forEach(file => {
    const origFilePath = `${templatePath}/${file}`;

    const stats = fs.statSync(origFilePath);

    if (stats.isFile()) {
      const contents = fs.readFileSync(origFilePath, "utf8");

      if (file === ".npmignore") file = ".gitignore";

      const writePath = `${CURR_DIR}/${newProjectPath}/${file}`;
      fs.writeFileSync(writePath, contents, "utf8");
    } else if (stats.isDirectory()) {
      fs.mkdirSync(`${CURR_DIR}/${newProjectPath}/${file}`);

      createDirectoryContents(
        `${templatePath}/${file}`,
        `${newProjectPath}/${file}`
      );
    }
  });

  status.stop();
};

const init = async () => {
  clear();

  console.log(chalk.redBright(figlet.textSync("NODE")));

  const answers = await inquirer.prompt(QUESTIONS);

  const projectChoice = answers["project-choice"];
  const projectName = answers["project-name"];
  const templatePath = `${__dirname}/templates/${projectChoice}`;

  fs.mkdirSync(`${CURR_DIR}/${projectName}`);

  createDirectoryContents(templatePath, projectName);
};

init();