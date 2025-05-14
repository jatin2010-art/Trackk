#!/usr/bin/env node

import inquirer from 'inquirer';

const toDos = [];
const completedTasks = [];

const addTask = async () => {
    const response = await inquirer.prompt([{
        type: "input",
        name: "task",
        message: "Enter task :- "
    }]);

    toDos.push({ task: response.task, done: false });
    console.log(`Task added : ${response.task}`);
}

const showTaskDetails = async (idx) => {
    const task = toDos[idx];

    console.log(`TASK DETAILS \nTASK : ${task.task}`);

    const { action } = await inquirer.prompt([{
        type: "list",
        name: "action",
        message: "--> ",
        choices: [
            "1. Complete this task",
            "2. Delete this task",
            "3. Edit",
            "4. go back",
        ]
    }])
    if (action === "1. Complete this task") {
        const compTask = { ...task, done: true };
        completedTasks.push(compTask);
        toDos.splice(idx, 1);
        console.log("Task completed !! congrats");
    } else if (action === "2. Delete this task") {
        toDos.splice(idx, 1);
        console.log("task deleted successfully");
    } else if (action === "3. Edit") {
        console.log("CURRENTLY NOT AVAILABLE...");
    } else if (action === "4. go back") {
        return
    } else
        return
}

const showTask = async () => {
    if (toDos.length === 0) {
        console.log("No tasks to show");
        return;
    }
    const taskChoice = toDos.map((item, idx) => ({
        name: `[${idx + 1}] ${item.task}`,
        value: idx,
    }));

    taskChoice.push({ name: "GO BACK", value: -1 });

    const selected = await inquirer.prompt([{
        type: 'list',
        name: "selected",
        message: "YOURS TODAY's TASKS",
        choices: taskChoice,
    }]);

    if (selected.selected === -1)
        return;
    await showTaskDetails(selected.selected);
}

const showCompletedTask = async () => {
    completedTasks.forEach((element, idx) => {
        console.log(`${idx + 1}. ${element.task}`);
    });
}

const menu = async () => {
    let exit = false;
    while (!exit) {
        const response = await inquirer.prompt([{
            type: "list",
            name: "choice",
            message: "\n\t----- WELCOME TO THE APP ----- \t\n",
            choices: [
                "1. Add task",
                "2. View tasks",
                "3. View completed tasks",
                "4.exit"
            ]
        }]);
        if (response.choice === "1. Add task")
            await addTask();
        else if (response.choice === "2. View tasks")
            await showTask();
        else if (response.choice === "3. View completed tasks")
            await showCompletedTask();
        else if (response.choice === "4.exit") {
            exit = true;
            console.log("\nBye bye !! ");
        }
    }
}

menu();