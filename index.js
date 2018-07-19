#!/usr/bin/env node

const inquirer = require("inquirer");
const fs = require("fs");
const clear = require("clear");
const chalk = require("chalk");
const figlet = require("figlet");
const CLI = require("clui");
const spawn = require("cross-spawn");
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

const createDirectoryContents = (templatePath, projectName) => {
  const status = new Spinner("Creating project, please wait...");

  status.start();

  const filesToCreate = fs.readdirSync(templatePath);

  filesToCreate.forEach(file => {
    const origFilePath = `${templatePath}/${file}`;

    const stats = fs.statSync(origFilePath);

    if (stats.isFile()) {
      const contents = fs.readFileSync(origFilePath, "utf8");

      if (file === ".ignore") file = ".gitignore";

      const writePath = `${CURR_DIR}/${projectName}/${file}`;

      fs.writeFileSync(writePath, contents, "utf8");
    } else if (stats.isDirectory()) {
      fs.mkdirSync(`${CURR_DIR}/${projectName}/${file}`);

      createDirectoryContents(
        `${templatePath}/${file}`,
        `${projectName}/${file}`
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

  const packageJson = {
    name: projectName,
    version: "0.1.0",
    private: true
  };

  fs.writeFileSync(
    `${CURR_DIR}/${projectName}/package.json`,
    JSON.stringify(packageJson, null, 2)
  );

  createDirectoryContents(templatePath, projectName);

  process.chdir(`${CURR_DIR}/${projectName}`);

  const dependencies = getDependencies(projectChoice);

  await install(dependencies);
};

const install = ({ prod, dev }) =>
  new Promise((resolve, reject) => {
    const command = "npm";
    const args = [
      "install",
      "--save",
      "--save-exact",
      "--loglevel",
      "error"
    ].concat(prod);

    const child = spawn(command, args, { stdio: "inherit" });

    child.on("close", code => {
      if (code !== 0) {
        reject({
          command: `${command} ${args.join(" ")}`
        });
        return;
      }

      const command = "npm";
      const args = [
        "install",
        "--save-dev",
        "--save-exact",
        "--loglevel",
        "error"
      ].concat(dev);

      const child = spawn(command, args, { stdio: "inherit" });

      child.on("close", code => {
        if (code !== 0) {
          reject({
            command: `${command} ${args.join(" ")}`
          });
          return;
        }
        resolve();
      });
    });
  });

const getDependencies = projectChoice => {
  const prod = [
    "bcryptjs",
    "express",
    "express-graphql",
    "graphql",
    "graphql-iso-date",
    "jsonwebtoken",
    "mongoose"
  ];

  const dev = [
    "@babel/cli",
    "@babel/core",
    "@babel/node",
    "@babel/plugin-proposal-optional-chaining",
    "@babel/plugin-proposal-pipeline-operator",
    "@babel/preset-env",
    "babel-eslint",
    "eslint",
    "nodemon"
  ];

  return { prod, dev };
};

init();
