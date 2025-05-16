#!/usr/bin/env node

import inquirer from 'inquirer';
import chalk from 'chalk';

const toDos = [];
const completedTasks = [];

// To add a new task
const addTask = async () => {
    const response = await inquirer.prompt([{
        type: "input",
        name: "task",
        message: "Enter task :- "
    }]);
    let createdAt= new Date().toISOString()
    let localDate= new Date(createdAt).toLocaleString() 
    toDos.push({ task: response.task, done: false, createdAt,localDate });
    console.log(`Task added : ${response.task}`);

    await new Promise(r => setTimeout(r, 800));
    console.clear();
}


// To show specific task details
const showTaskDetails = async (idx) => {
    const task = toDos[idx];

    console.log(`TASK DETAILS:- \nTASK : ${task.task}\nCREATED AT : ${task.localDate}\n`);

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
    }]);
    if (action === "1. Complete this task") {
        let completedAt = new Date().toISOString()
        let completedLocalDate = new Date(completedAt).toLocaleString()
        const compTask = { ...task, done: true, completedAt, completedLocalDate };
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
    await new Promise(r => setTimeout(r, 1000));
    console.clear();
}

//  To shwo today's tasks details 
const showTodayTasks = async () => {
    let today = new Date().toISOString().slice(0, 10);

    const todayTasks = toDos.filter(t =>
        t.createdAt.startsWith(today)
    );

    if (todayTasks.length === 0) {
        console.log("No tasks today. Enjoy!");
        await inquirer.prompt([{
            type: "input",
            name: "continue",
            message: "Press enter to go back..."
        }]);
    } else {
        console.log("Yours Today's ToDo's");
        todayTasks.forEach((t, i) => {
            console.log(`${i + 1}. ${t.task}`);
        });
        await inquirer.prompt([{
            type: "input",
            name: "continue",
            message: "Press enter to go back..."
        }]);
    }
}

// to show completed tasks details only
const showCompletedTaskDetails = async (idx) => {
    let selectedTask = completedTasks[idx];

    console.log(`Task details:- \ntask: ${selectedTask.task}\ncreated at: ${selectedTask.createdAt}\n completed at: ${selectedTask.completedLocalDate}`);

    const { action } = await inquirer.prompt([{
        type: "list",
        name: "action",
        message: "-->",
        choices: [
            "1. Mark as incomplete",
            "2. Delete this task",
            "3. Go back",
        ]
    }]);

    if (action === "1. Mark as incomplete") {
        let completedAt = "";
        let completedLocalDate = "";
        const compTask = { ...selectedTask, done: false , completedAt, completedLocalDate };
        toDos.push(compTask);
        completedTasks.splice(idx, 1);
        console.log("Task marked as incomplete");
    } else if (action === "2. Delete this task") {
        completedTasks.splice(idx, 1);
        console.log("deleted successfully");
    } else if (action === "3. Go back") {
        return;
    }
}

// To show all completed tasks
const showCompletedTask = async () => {
    if (completedTasks.length === 0) {
        console.log("No tasks completed yet");
        await inquirer.prompt([{
            type: "input",
            name: "continue",
            message: "Press enter to go back..."
        }]);
    } else {
        const taskChoice = completedTasks.map((item, idx) => ({
            name: `[${idx + 1}] ${item.task}`,
            value: idx,
        }));
        taskChoice.push({ name: "GO BACK", value: -1 });

        const selected = await inquirer.prompt([{
            type: 'list',
            name: "selected",
            message:"Tasks completed :- ",
            choices: taskChoice,
        }]);

        if (selected.selected === -1)
            return;
        await showCompletedTaskDetails(selected.selected);

    }
}
// To view all tasks
const showTask = async () => {
    if (toDos.length === 0) {
        console.log("No tasks to show");
        await inquirer.prompt([{
            type: "input",
            name: "continue",
            message: "Press enter to go back..."
        }]);
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

// Main menu
const menu = async () => {
    let exit = false;
    while (!exit) {
        console.clear();
        const response = await inquirer.prompt([{
            type: "list",
            name: "choice",
            message: "\n\t----- WELCOME TO THE APP ----- \t\n",
            choices: [
                "1. Add task",
                "2. View all tasks",
                "3. View completed tasks",
                "4. View todays's tasks only",
                "5. Exit"
            ]
        }]);
        if (response.choice === "1. Add task")
            await addTask();
        else if (response.choice === "2. View all tasks")
            await showTask();
        else if (response.choice === "3. View completed tasks") {
            await showCompletedTask();
        } else if (response.choice === "4. View todays's tasks only") {
            await showTodayTasks();
        }
        else if (response.choice === "5. Exit") {
            exit = true;
            console.log("\nBye bye !! ");
        }
    }
}

menu();