const fs = require("fs");
const CLI = require("clui");
const Spinner = CLI.Spinner;
const statics = require("./statics");

const { CURR_DIR } = statics;

const createDirectoryContents = (templatePath, projectName) => {
  const status = new Spinner("Creating project, please wait...");

  status.start();

  const filesToCreate = fs.readdirSync(templatePath);

  filesToCreate.forEach(file => {
    const origFilePath = `${templatePath}/${file}`;

    const stats = fs.statSync(origFilePath);

    if (stats.isFile()) {
      const contents = fs.readFileSync(origFilePath, "utf8");

      if (file === "dependencies") return;

      if (file === "gitignore") file = ".gitignore";

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

module.exports = createDirectoryContents;
