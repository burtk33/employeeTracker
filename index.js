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
            choices: ['View all employees', 'View all employees by department', 'View all employees by role', 'Add employee', 'Remove employee', 'Update employee role', 'Update employee manager', 'Exit']
        }
    ]).then((selection) => {
        let menuSelect = selection.menu;
        switch (menuSelect) {
            case 'View all employees': {
                displayAllEmployees();
                break;
            }
            case 'View all employees by department': {
                displayAllbByDept();
                break;
            }
            case 'View all employees by role': {
                displayAllByRole();
                break;
            }
            case 'Add employee': {
                addEmployee();
                break;
            }
            case 'Remove Employee': {
                removeEmployee();
                break;
            }
            case 'Update employee role': {
                updateRole();
                break;
            }
            case 'Update employee manager': {
                updateMgnr();
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
    connection.query("SELECT employee.first_name AS 'First Name', employee.last_name AS 'Last Name', role.title AS 'Title', role.salary AS 'Salary', department.name AS 'Department', CONCAT(e.first_name, ' ' ,e.last_name) AS Manager FROM employee INNER JOIN role on role.id = employee.role_id INNER JOIN department on department.id = role.department_id left join employee e on employee.manager_id = e.id;",
        function (err, res) {
            if (err) throw err
            console.table(res)
            menu()
        }
    )
}

const displayAllByRole=()=> {
    connection.query("SELECT employee.first_name AS 'First Name', employee.last_name AS 'Last Name', role.title AS 'Title' FROM employee JOIN role ON employee.role_id = role.id;", 
    function(err, res) {
    if (err) throw err
    console.table(res)
    menu();
    })
  }
