import chalk from "chalk";

export const log = {
    success : msg => console.log(chalk.greenBright(`${msg}`)),
    error : msg => console.log(chalk.redBright(`${msg}`)),
    message : msg => console.log(chalk.gray.italic(`${msg}`)),
    info : msg => console.log(chalk.cyan(`${msg}`)),
    bold: msg => console.log(chalk.bold(`${msg}`)),
}