import fs from "fs";
import path from "path";

const taskFile = path.resolve("tasks.json");
const completedFile = path.resolve("compeletedTasks.json");

const readJSON = (filePath) => {
    if (!fs.existsSync(filePath))
        return [];
    const content = fs.readFileSync(filePath, "utf-8");
    try {
        return JSON.parse(content);
    } catch (error) {
        return [];
    }
}

const writeJSON = (filePath,data)=>{
    fs.writeFileSync(filePath,JSON.stringify(data,null,2));
}


export const loadTasks = () => readJSON(taskFile);
export const loadCompletedTasks = () => readJSON(completedFile);
export const saveTasks = (data) => writeJSON(taskFile,data);
export const saveCompletedTasks = (data) => writeJSON(completedFile,data);