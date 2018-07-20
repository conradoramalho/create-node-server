const spawn = require("cross-spawn");

const install = ({ prod, dev }) =>
  new Promise(async (resolve, reject) => {
    try {
      await installNpm(
        ["install", "--save", "--save-exact", "--loglevel", "error"].concat(
          prod
        )
      );

      await installNpm(
        ["install", "--save-dev", "--save-exact", "--loglevel", "error"].concat(
          dev
        )
      );

      resolve();
    } catch (error) {
      reject(error);
    }
  });

const installNpm = cmd =>
  new Promise((resolve, reject) => {
    const child = spawn("npm", cmd, { stdio: "inherit" });

    child.on(
      "close",
      code =>
        code !== 0
          ? reject({ command: `${command} ${args.join(" ")}` })
          : resolve()
    );
  });

module.exports = install;
