#!/usr/bin/env node

import inquirer from 'inquirer';


const stack=[];
const choiceSTack =[];

const main = async () => {
    const answer = await inquirer.prompt([{
        type: "input",
        name: "temp",
        message: " This is message",
        prefix: ""
    }]);
    stack.push(answer.temp);
}

const choice = async ()=>{
    const choice = await inquirer.prompt([{
        type: "list",
        name : "choice",
        message :"Kya chaaiye inme se tuje..? ",
        prefix:"",
        choices:[
            "Choice 1",
            "choice2 ",
            "choice 3",
            "choice 4"
        ]

        
    }])

    choiceSTack.push(choice.choice);
}

// main();
let i = 3;
const multiLop = async () => {
    while (i--) {
        await main();
    }
} 
// multiLop();

( async ()=>{
    await choice();
    console.log(choiceSTack);
})();






