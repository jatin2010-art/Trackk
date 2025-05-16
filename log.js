import chalk from "chalk";

export const log = {
    success : msg => console.log(chalk.greenBright(`${msg}`)),
}