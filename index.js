const inquirer = require('inquirer');
const mysql = require('mysql');


const menu = () => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'menu',
            message: 'What would you like to do?',
            choices: ['View all employees', 'View all employees by department', 'View all epmloyees by manager', 'Add employee', 'Remove employee', 'Update employee role', 'Update employee manager']
        }
    ]).then((selection)=>{
        const menuSelect=selection.menu;
        console.log(menuSelect);
    })
        
}

menu();