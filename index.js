//dependencies
const inquirer = require('inquirer');
const mysql = require('mysql');
const cTable = require('console.table');

//database connection
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '$ervice13K',
    database: 'employee_db',
});

//throw error if cannot connect to DB otherwise run menu
connection.connect((err) => {
    if (err) throw err;
    menu();
});

//console menu for selecting actions
const menu = () => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'menu',
            message: 'What would you like to do?',
            choices: ['View all employees', 'View all employees by department', 'View all epmloyees by manager', 'Add employee', 'Remove employee', 'Update employee role', 'Update employee manager', 'Exit']
        }
    ]).then((selection) => {
        let menuSelect = selection.menu;
        switch (menuSelect) {
            case 'View all employees': {
                displayAllEmployees();
                menu();
                break;
            }
            case 'View all employees by department': {
                displayAllbByDept();
                menu();
                break;
            }
            case 'View all employees by manager': {
                displayAllByMgnr();
                menu();
                break;
            }
            case 'Add employee': {
                addEmployee();
                menu();
                break;
            }
            case 'Remove Employee': {
                removeEmployee();
                menu();
                break;
            }
            case 'Update employee role': {
                updateRole();
                menu();
                break;
            }
            case 'Update employee manager': {
                updateMgnr();
                menu();
                break;
            }
            case 'Exit': {
                console.log("Goodbye!")
                break;
            }

        }
    })

}

//display to console all employees in database
const displayAllEmployees = () => {
    connection.query('SELECT * FROM employee', (err, res) => {
        if (err) throw (err);
        console.table("\nAll employees",res);
    });
}
