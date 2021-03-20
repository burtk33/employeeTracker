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
    console.log("EMPLOYEE TRACKER\n=================================================")
    inquirer.prompt([
        {
            type: 'list',
            name: 'menu',
            message: 'What would you like to do?',
            choices: ['View all employees', 'View all employees by department', 'View all employees by role', 'Add employee','Add role', 'Add department', 'Remove employee', 'Exit']
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
            case 'Add role': {
                addRole();
                break;
            }
            case 'Add department': {
                addDept();
                break;
            }
            case 'Remove employee': {
                removeEmployee();
                break;
            }
            case 'Exit': {
                console.log("Goodbye!")
                process.exit();
            }

        }
    })

}

//display to console all employees in database
const displayAllEmployees = () => {
    connection.query("SELECT employee.first_name AS 'First Name', employee.last_name AS 'Last Name', role.title AS 'Title', role.salary AS 'Salary', department.name AS 'Department', CONCAT(e.first_name, ' ' ,e.last_name) AS Manager FROM employee INNER JOIN role on role.id = employee.role_id INNER JOIN department on department.id = role.department_id left join employee e on employee.manager_id = e.id;",
        (err, res) => {
            if (err) throw err;
            console.table(res);
            menu();
        }
    )
}

//display to console all employees in database based on role
const displayAllByRole = () => {
    connection.query("SELECT employee.first_name AS 'First Name', employee.last_name AS 'Last Name', role.title AS 'Title' FROM employee JOIN role ON employee.role_id = role.id;",
        (err, res) => {
            if (err) throw err;
            console.table(res);
            menu();
        })
}

//display to console all employees in database based on role
const displayAllByDept = () => {
    connection.query("SELECT employee.first_name AS 'First Name', employee.last_name AS 'Last Name', department.name AS 'Department' FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id ORDER BY employee.id;",
        (err, res) => {
            if (err) throw err;
            console.table(res);
            menu();
        })
}

//add employee prompt and function
const addEmployee = () => {
    inquirer.prompt([
        {
            name: "firstName",
            type: "input",
            message: "Enter their first name: "
        },
        {
            name: "lastName",
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
            name: "manager",
            type: "list",
            message: "Select their manager's name:",
            choices: selectManager()
        }
    ]).then((data) => {
        let roleId = selectRole().indexOf(data.role) + 2;
        let managerId = selectManager().indexOf(data.manager) + 2;
        connection.query("INSERT INTO employee SET ?",
            {
                first_name: data.firstName,
                last_name: data.lastName,
                manager_id: managerId,
                role_id: roleId

            }, (err) => {
                if (err) throw err
                console.table(data)
                menu();
            })

    })
}

//function to add a role to the database
const addRole = () => {
    inquirer.prompt([
        {
            name: "title",
            type: "input",
            message: "Enter their role title: "
        },
        {
            name: "salary",
            type: "input",
            message: "Enter role salary: "
        },
        {
            name: "department",
            type: "list",
            message: "Select the department: ",
            choices: selectDept()
        }
    ]).then((data) => {
        let deptId = selectDept().indexOf(data.department)+2;
        connection.query("INSERT INTO role SET ?",{
            title:data.title,
            salary:data.salary,
            department_id:deptId
        },
            (err) => {
                if (err) throw err
                console.table(data)
                menu();
            })

    })
}

//function to add a department to the database
const addDept = () => {
    inquirer.prompt([
        {
            name: "deptName",
            type: "input",
            message: "Enter department name: "
        }
    ]).then((data) => {
        connection.query("INSERT INTO department SET ?",{
            name:data.deptName
        },
            (err) => {
                if (err) throw err
                console.table(data)
                menu();
            })

    })
}

//function to remove employee from database
const removeEmployee = () => {
    connection.query("SELECT * FROM employee", (err,res)=>{
        inquirer.prompt([
            {
                type: "list",
                name: "lastName",
                message: "Select the employee to remove",
                choices: function() {
                    let lastName = [];
                    for (let i = 0; i < res.length; i++) {
                      lastName.push(res[i].last_name);
                    }
                    return lastName;
                  }
            }
        ]).then((data) => {
            connection.query("DELETE FROM employee WHERE last_name=?", data.lastName, (err, res) => {
                if (err) throw (err);
                console.log(`Employee with last name ${data.lastName} has been removed`)
            })
        })
    })
    

}



//establish array of choices for roles
const selectRole = () => {
    let roleArray = [];
    connection.query("SELECT * FROM role", (err, res) => {
        if (err) throw err
        for (let i = 0; i < res.length; i++) {
            roleArray.push(res[i].title);
        }

    })
    return roleArray;
}

//establish array of choice for departments
const selectDept = () => {
    let deptArray = [];
    connection.query("SELECT * FROM department", (err, res) => {
        if (err) throw err
        for (let i = 0; i < res.length; i++) {
            deptArray.push(res[i].name);
        }

    })
    return deptArray;
}

//establish array of choices for manager
const selectManager = () => {
    let managersArray = [];
    connection.query("SELECT first_name, last_name FROM employee WHERE manager_id IS NULL", (err, res) => {
        if (err) throw err
        for (let i = 0; i < res.length; i++) {
            managersArray.push(res[i].first_name);
        }

    })
    return managersArray;
}