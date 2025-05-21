import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Store files inside a `.data` folder
const dataDir = path.join(__dirname, '.data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}


const taskFile = path.join(dataDir, "tasks.json");
const completedFile = path.join(dataDir, "compeletedTasks.json");

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

const writeJSON = (filePath, data) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}


export const loadTasks = () => readJSON(taskFile);
export const loadCompletedTasks = () => readJSON(completedFile);
export const saveTasks = (data) => writeJSON(taskFile, data);
export const saveCompletedTasks = (data) => writeJSON(completedFile, data);