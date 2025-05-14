#!/usr/bin/env node

import inquirer from 'inquirer';

// const stack = [];
// const choiceSTack = [];

// const main = async () => {
//     const answer = await inquirer.prompt([{
//         type: "input",
//         name: "temp",
//         message: " This is message",
//         prefix: ""
//     }]);
//     stack.push(answer.temp);
// }

// const choice = async () => {
//     const choice = await inquirer.prompt([{
//         type: "list",
//         name: "choice",
//         message: "Kya chaaiye inme se tuje..? ",
//         prefix: "",
//         choices: [
//             "Choice 1",
//             "choice2 ",
//             "choice 3",
//             "choice 4"
//         ]
//     }])
//     if (choice.choice === "Choice 1") {
//         await main();
//     }
//     choiceSTack.push(choice.choice);
// }
// // main();
// let i = 3;
// const multiLop = async () => {
//     while (i--) {
//         await main();
//     }
// }

// (async ()=>{
//     await choice();
//     console.log(choiceSTack);
//     console.log(stack);
// })();


const toDos = [];

const addTask = async()=>{
    const response = await inquirer.prompt([{
        type:"input",
        name:"task",
        message:"Enter task :- "
    }]);
    toDos.push(response.task);
    console.log(`Task added : ${response.task}`);
}

const showTask = async ()=>{
    toDos.forEach(element => {
        console.log(`\n ${element}`);
    });
}

const menu = async () => {
    let exit = false;
    while (!exit) {
        const response = await inquirer.prompt([{
            type: "list",
            name: "choice",
            message: "\t----- WELCOME TO THE APP ----- \t ",
            choices: [
                "1. Add task",
                "2. Remove task",
                "3. View all task",
                "4.exit"
            ]
        }]);
        if (response.choice === "1. Add task") {
            await addTask();
        } else if (response.choice === "2. Remove task") {
            console.log("\nTask will be removed here");
        } else if (response.choice === "3. View all task") {
            await showTask();
        } else if(response.choice=== "4.exit"){
                exit = true;
                console.log("\nBye bye !! ");
        }
    }
}

menu();