const figlet = require('figlet');
const mysql = require('mysql2');
const inquirer = require('inquirer');
const dotenv = require('dotenv').config()
// const { response } = require('express');
// const express = require('express')

// const PORT = process.env.PORT || 3001;
// const app = express()

// app.use(express.json());

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: process.env.USER_NAME,
        password: process.env.USER_PASSWORD,
        database: process.env.DB_NAME
    });

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database', err);
        return;
    }
    console.log(`Connected to the employee_tracker_db database.`),
        console.log(figlet.textSync('Good Employee Tracker'));
    userPrompt()
});

const userPrompt = () => {
    inquirer.prompt([
        {
            name: 'choices',
            type: 'list',
            message: 'Please select an option:',
            choices: [
                'View All Departments',
                'View All Roles',
                'View All Employees',
                'Add Department',
                'Add Role',
                'Add Employee',
                'Update Employee Role',
                'Remove Employee',
                'Remove Role',
                'Remove Department',
                'Quit'
            ]
        }
    ])
        .then((answers) => {
            const { choices } = answers;

            if (choices === 'View All Departments') {
                viewAllDepartments();
            }

            if (choices === 'View All Roles') {
                viewAllRoles();
            }

            if (choices === 'View All Employees') {
                viewAllEmployees();
            }

            if (choices === 'Add Department') {
                addDepartment();
            }

            if (choices === 'Add Role') {
                addRole();
            }

            if (choices === 'Add Employee') {
                addEmployee();
            }

            if (choices === 'Update Employee Role') {
                updateEmployeeRole();
            }

            if (choices === 'Remove Employee') {
                removeEmployee();
            }

            if (choices === 'Remove Role') {
                removeRole();
            }

            if (choices === 'Remove Department') {
                removeDepartment();
            }

            if (choices === 'Exit') {
                db.end()
                return;
            }
        });
};

// View all Departments, Roles, Employees
const viewAllDepartments = () => {
    const sql = `SELECT departments.id AS 'ID', departments.dpmt_name AS 'Departments' FROM departments`;
    db.query(sql, (err, response) => {
        if (err) {
            console.error('Error querying departments:', err);
        } else {
            console.table(response);
        }
        userPrompt();
    });
};


const viewAllRoles = () => {
    const sql = `SELECT roles.id AS 'ID', roles.title AS 'Title', departments.dpmt_name AS 'Department'
                  FROM roles
                  INNER JOIN departments ON roles.departments_id = departments.id`;
    db.query(sql, (err, response) => {
        if (err) {
            console.error('Error querying roles:', err);
        } else {
            console.table(response);
        }
        userPrompt();
    });
};

const viewAllEmployees = () => {
    let sql = `SELECT employees.id AS 'ID',
                  employees.first_name AS 'First Name',
                  employees.last_name AS 'Last Name',
                  roles.title AS 'Role',
                  employees.manager_id AS 'Manager ID',
                  departments.dpmt_name AS 'Department',
                  roles.salary AS 'Salary'
                  FROM employees
                  JOIN roles ON employees.roles_id = roles.id
                  JOIN departments ON roles.departments_id = departments.id
                  ORDER BY employees.id ASC`;
    db.query(sql, (err, response) => {
        if (err) {
            console.error('Error querying Employees');
        } else {
            console.table(response);
        }
        userPrompt();
    });
};

// Add Department, Role, Employee
const addDepartment = () => {
    inquirer
        .prompt([
            {
                name: 'newDepartment',
                type: 'input',
                message: 'Please input new Department name?'
            }
        ])
        .then((answer) => {
            let sql = `INSERT INTO department (department_name) VALUES (?)`;
            db.query(sql, answer.newDepartment, (error, response) => {
                if (error) throw error;
                console.log()
                viewAllDepartments();
            });
        });
};

const addEmployee = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'firstName',
            message: "What is the employee's first name?",
            validate: addFirstName => {
                if (addFirstName) {
                    return true;
                } else {
                    console.log('Please enter a first name');
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'lastName',
            message: "What is the employee's last name?",
            validate: addLastName => {
                if (addLastName) {
                    return true;
                } else {
                    console.log('Please enter a last name');
                    return false;
                }
            }
        }
    ])
        .then(answer => {
            const crit = [answer.firstName, answer.lastName]
            const roleSql = `SELECT role.id, role.title FROM role`;
            db.promise().query(roleSql, (error, data) => {
                if (error) throw error;
                const roles = data.map(({ id, title }) => ({ name: title, value: id }));
                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'role',
                        message: "What is the employee's role?",
                        choices: roles
                    }
                ])
                    .then(roleChoice => {
                        const role = roleChoice.role;
                        crit.push(role);
                        const managerSql = `SELECT * FROM employee`;
                        db.promise().query(managerSql, (error, data) => {
                            if (error) throw error;
                            const managers = data.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));
                            inquirer.prompt([
                                {
                                    type: 'list',
                                    name: 'manager',
                                    message: "Who is the employee's manager?",
                                    choices: managers
                                }
                            ])
                                .then(managerChoice => {
                                    const manager = managerChoice.manager;
                                    crit.push(manager);
                                    const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                                  VALUES (?, ?, ?, ?)`;
                                    db.query(sql, crit, (error) => {
                                        if (error) throw error;
                                        console.log("Employee has been added!")
                                        viewAllEmployees();
                                    });
                                });
                        });
                    });
            });
        });
};

// Update Employee Roll

// Remove Department, Role, Employee



// app.listen(PORT, () =>
//     console.log(`Example app listening at http://localhost:${PORT}`)
// );