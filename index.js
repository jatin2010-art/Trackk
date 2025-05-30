#!/usr/bin/env node

import inquirer from 'inquirer';
import chalk from 'chalk';
import { log } from './log.js';
import { loadTasks, loadCompletedTasks, saveTasks, saveCompletedTasks } from "./fileHandler.js";

const toDos = loadTasks();
const completedTasks = loadCompletedTasks();

// Helper functions
const wait = async () => {
    await inquirer.prompt([{
        type: "input",
        name: "continue",
        message: "Press enter to go back",
    }]);
}

// To add a new task---------------------------------------------------------------------------------
const addTask = async () => {
    const response = await inquirer.prompt([{
        type: "input",
        name: "task",
        message: "Enter task :- "
    },
    {
        type: "list",
        name: "priority",
        message: "Set priority:- ",
        choices: [
            { name: "1. High", value: "high" },
            { name: "2. Moderate", value: "moderate" },
            { name: "3. Low", value: "low" },
        ]
    }
    ]);
    if (response.task.trim() === "") {
        log.error("Empty task, not added");
        await new Promise(r => setTimeout(r, 500));
        console.clear();
        return;
    }
    let createdAt = new Date().toISOString()
    let localDate = new Date(createdAt).toLocaleString()
    toDos.push({ task: response.task, done: false, priority: response.priority, createdAt, localDate });
    saveTasks(toDos);
    log.success(`Task added : ${response.task}`);

    await new Promise(r => setTimeout(r, 500));
    console.clear();
}

// To show specific task details-------------------------------------------------------------------------------
const showTaskDetails = async (idx) => {
    const task = toDos[idx];

    console.log(`${chalk.green.bold("TASK : ")}${chalk.white(task.task)}`);
    if (task.priority === "high")
        console.log(`\n${chalk.red(task.priority)}\n`);
    else if (task.priority === "moderate")
        console.log(`\n${chalk.yellow(task.priority)}\n`);
    else if (task.priority === "low")
        console.log(`\n${chalk.blue(task.priority)}\n`);
    else
        console.log(`\n${chalk.gray(task.priority)}\n`);
    console.log(`\n${chalk.cyan.bold("CREATED AT : ")}${chalk.white(task.localDate)}\n`);

    const { action } = await inquirer.prompt([{
        type: "list",
        name: "action",
        message: "--> ",
        choices: [
            { name: chalk.green("1. Complete this task"), value: "complete" },
            { name: chalk.red("2. Delete this task"), value: "delete" },
            { name: chalk.cyan("3. Edit"), value: "edit" },
            { name: chalk.gray("4. Go back"), value: "back" },
        ]
    }]);
    if (action === "complete") {
        let completedAt = new Date().toISOString()
        let completedLocalDate = new Date(completedAt).toLocaleString()
        const compTask = { ...task, done: true, completedAt, completedLocalDate };
        completedTasks.push(compTask);
        toDos.splice(idx, 1);
        saveTasks(toDos);
        saveCompletedTasks(completedTasks);
        log.success("Task completed !! congrats");
    } else if (action === "delete") {
        toDos.splice(idx, 1);
        saveTasks(toDos);
        log.success("task deleted successfully");
    } else if (action === "edit") {
        const newTask = await inquirer.prompt([{
            type: "input",
            name: "task",
            message: "Edit the task (press tab or start writing) : ",
            default: task.task,
        }])
        if (newTask.task === "") {
            log.error("Task empty, not updated");
        } else if (newTask.task === task.task) {
            log.error("task same not updated");
        } else {
            task.task = newTask.task;
            saveTasks(toDos);
            log.success("Updated successfully");
        }

        await new Promise(r => setTimeout(r, 800));
        console.clear();

    } else if (action === "back") {
        return
    } else
        return
    await new Promise(r => setTimeout(r, 1000));
    console.clear();
}

//  To shwo today's tasks details-------------------------------------------------------------------------- 
const showTodayTasks = async () => {
    let today = new Date().toISOString().slice(0, 10);

    const todayTasks = toDos.filter(t =>
        t.createdAt.startsWith(today)
    );

    if (todayTasks.length === 0 && toDos.length === 0)
        console.log("No tasks pending enjoy!!");
    else if (todayTasks.length === 0)
        console.log("No tasks Today ,but have pending tasks");
    else {
        console.log("Yours Today's ToDo's");
        todayTasks.forEach((t, i) => {
            console.log(`${i + 1}. ${t.task}`);
        });
    }
    await wait();
}

// to show completed tasks details only-----------------------------------------------------------------------------------
const showCompletedTaskDetails = async (idx) => {
    let selectedTask = completedTasks[idx];

    console.log(`Task details:- \ntask: ${selectedTask.task}\nPriority: ${selectedTask.priority}\nCreated at: ${selectedTask.createdAt}\n completed at: ${selectedTask.completedLocalDate}`);

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
        const compTask = { ...selectedTask, done: false, completedAt, completedLocalDate };
        toDos.push(compTask);
        completedTasks.splice(idx, 1);
        saveTasks(toDos);
        saveCompletedTasks(completedTasks);
        log.success("Task marked as incomplete");
    } else if (action === "2. Delete this task") {
        completedTasks.splice(idx, 1);
        saveCompletedTasks(completedTasks);
        log.success("deleted successfully");
    } else if (action === "3. Go back") {
        return;
    }
}

// To show all completed tasks-------------------------------------------------------------------------------------
const showCompletedTask = async () => {
    if (completedTasks.length === 0) {
        console.log("No tasks completed yet");
        await wait();
    } else {
        const taskChoice = completedTasks.map((item, idx) => ({
            name: `[${idx + 1}] ${item.task}`,
            value: idx,
        }));
        taskChoice.push({ name: "GO BACK", value: -1 });

        const selected = await inquirer.prompt([{
            type: 'list',
            name: "selected",
            message: "Tasks completed :- ",
            choices: taskChoice,
        }]);

        if (selected.selected === -1)
            return;
        await showCompletedTaskDetails(selected.selected);
    }
}
// To view all tasks---------------------------------------------------------------------------------------------
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

// Main menu----------------------------------------------------------------------------------------------------------
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
        else if (response.choice === "3. View completed tasks")
            await showCompletedTask();
        else if (response.choice === "4. View todays's tasks only")
            await showTodayTasks();
        else if (response.choice === "5. Exit")
            exit = true;
    }
}

menu();