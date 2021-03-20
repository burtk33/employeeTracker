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
                displayAllByDept();
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
     (err, res)=> {
            if (err) throw err;
            console.table(res);
            menu();
        }
    )
}

//display to console all employees in database based on role
const displayAllByRole = () => {
    connection.query("SELECT employee.first_name AS 'First Name', employee.last_name AS 'Last Name', role.title AS 'Title' FROM employee JOIN role ON employee.role_id = role.id;",
     (err, res)=> {
            if (err) throw err;
            console.table(res);
            menu();
        })
}

//display to console all employees in database based on role
const displayAllByDept=()=> {
    connection.query("SELECT employee.first_name, employee.last_name, department.name AS Department FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id ORDER BY employee.id;", 
    (err, res)=> {
      if (err) throw err;
      console.table(res);
      menu();
    })
  }

//add employee prompt and function
const addEmployee = () => {
    inquirer.prompt([
        {
            name: "firstname",
            type: "input",
            message: "Enter their first name: "
        },
        {
            name: "lastname",
            type: "input",
            message: "Enter their last name: "
        },
        {
            name: "role",
            type: "list",
            message: "Select their role: ",
            choices: selectRole()
        },
        {
            name: "choice",
            type: "list",
            message: "Select their manager's name:",
            choices: selectManager()
        }
    ]).then((data) => {
        var roleId = selectRole().indexOf(data.role) + 1
        var managerId = selectManager().indexOf(data.choice) + 1
        connection.query("INSERT INTO employee SET ?",
            {
                first_name: data.firstName,
                last_name: data.lastName,
                manager_id: managerId,
                role_id: roleId

            },(err)=> {
                if (err) throw err
                console.table(data)
                menu();
            })

    })
}

//establish array of choices for roles
const selectRole = () => {
    let roleArray = [];
    connection.query("SELECT * FROM role",(err, res)=> {
        if (err) throw err
        for (let i = 0; i < res.length; i++) {
            roleArray.push(res[i].title);
        }

    })
    return roleArray;
}

//establish array of choices for manager
const selectManager = () => {
    let managersArray = [];
    connection.query("SELECT first_name, last_name FROM employee WHERE manager_id IS NULL",(err, res)=> {
        if (err) throw err
        for (let i = 0; i < res.length; i++) {
            managersArray.push(res[i].first_name);
        }

    })
    return managersArray;
}