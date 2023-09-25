const figlet = require('figlet');
const mysql = require('mysql2');
const inquirer = require('inquirer');
const dotenv = require('dotenv').config()

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

            if (choices === 'Add Employee') {
                addEmployee();
            }

            if (choices === 'Add Role') {
                addRole();
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
                db.end();
                process.exit();
            }
        });
};

// View all Departments
const viewAllDepartments = () => {
    const sql = `SELECT departments.id AS 'ID', departments.dpmt_name AS 'Departments' FROM departments`;
    db.query(sql, (err, response) => {
        if (err) {
            console.error('Error querying departments:')
            console.error('Please retart, and try again')
            db.end();
            process.exit();;
        } else {
            console.table(response);
        }
        userPrompt();
    });
};

// View all Roles
const viewAllRoles = () => {
    const sql = `SELECT roles.id AS 'ID', roles.title AS 'Title', departments.dpmt_name AS 'Department'
                  FROM roles
                  INNER JOIN departments ON roles.departments_id = departments.id`;
    db.query(sql, (err, response) => {
        if (err) {
            console.error('Error querying roles:', err);
            console.error('Please retart, and try again')
            db.end();
            process.exit();
        } else {
            console.table(response);
        }
        userPrompt();
    });
};

// View all Employees
const viewAllEmployees = () => {
    let sql = `SELECT 
                  employees.id AS 'ID',
                  employees.first_name AS 'First Name',
                  employees.last_name AS 'Last Name',
                  roles.title AS 'Role',
                  departments.dpmt_name AS 'Department',
                  CONCAT(m.first_name, ' ', m.last_name) AS 'Manager',
                  roles.salary AS 'Salary'
                  FROM employees
                  JOIN roles ON employees.roles_id = roles.id
                  JOIN departments ON roles.departments_id = departments.id
                  LEFT JOIN employees AS m ON employees.manager_id = m.id
                  ORDER BY employees.id ASC`;
    db.query(sql, (err, response) => {
        if (err) {
            console.error('Error querying Employees :', err.message);
            console.error('Please restart, and try again')
            db.end();
            process.exit();
        } else {
            console.table(response);
        }
        userPrompt();
    });
};

// Add new Departmente
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
            let sql = `INSERT INTO departments (dpmt_name) VALUES (?)`;
            db.query(sql, answer.newDepartment, (err, response) => {
                if (err) {
                    console.error('Error adding new Department');
                    console.error('Please retart, and try again')
                    db.end();
                    process.exit();
                } else {
                    console.log('New Department successfully added')
                    viewAllDepartments();
                }
            });
        });
};

// Add new Role
const addRole = () => {
    const sql = 'SELECT * FROM departments'
    db.query(sql, (error, response) => {
        if (error) {
            console.error('Error getting departments')
            console.error('Please restart, and try again')
            db.end();
            process.exit();;
        } else {
            let deptChoices = response.map((departments) => ({
                name: departments.dpmt_name,
            }));
            deptChoices.push('Create Department');
            inquirer
                .prompt([
                    {
                        name: 'departmentName',
                        type: 'list',
                        message: 'Which department is this new role in?',
                        choices: deptChoices
                    }
                ])
                .then((answer) => {
                    console.log('Selected departmentName:', answer.departmentName);
                    if (answer.departmentName === 'Create Department') {
                        this.addDepartment();
                    } else {
                        addRoleResume(answer);
                    }
                });

            const addRoleResume = (departmentData) => {
                inquirer
                    .prompt([
                        {
                            name: 'newRole',
                            type: 'input',
                            message: 'What is the name of your new role?'
                        },
                        {
                            name: 'salary',
                            type: 'input',
                            message: 'What is the salary of this new role?'
                        }
                    ])
                    .then((answer) => {
                        let createdRole = answer.newRole;
                        let departmentId;

                        response.forEach((department) => {
                            if (departmentData.departmentName === department.dpmt_name) { departmentId = department.id; }
                        });

                        let sql = `INSERT INTO roles (title, salary, departments_id) VALUES (?, ?, ?)`;
                        let newRole = [createdRole, answer.salary, departmentId];

                        console.log('SQL Query:', sql);
                        console.log('Query Parameters:', newRole);

                        db.query(sql, newRole, (err) => {
                            if (err) {
                                console.error('Error adding new Role: ', err.message);
                                console.error('Please restart, and try again')
                                db.end();
                                process.exit();
                            } else {
                                viewAllRoles();
                            }
                        });
                    });
            };
        }
    });
};

// Add new Employee
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
            const newName = [answer.firstName, answer.lastName]
            const selectRole = `SELECT roles.id, roles.title FROM roles`;
            db.query(selectRole, (err, data) => {
                if (err) {
                    console.error('Error querying roles');
                    console.error('Please retart, and try again')
                    db.end();
                    process.exit();
                } else {
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
                            newName.push(role);
                            const managerSql = `SELECT * FROM employees`;
                            db.query(managerSql, (err, data) => {
                                if (err) {
                                    console.error('Error querying Managers');
                                    console.error('Please retart, and try again')
                                    db.end();
                                    process.exit();
                                } else {
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
                                            newName.push(manager);
                                            const sql = `INSERT INTO employees (first_name, last_name, roles_id, manager_id)
                                  VALUES (?, ?, ?, ?)`;
                                            db.query(sql, newName, (err) => {
                                                if (err) {
                                                    console.error('Error creating new Employee');
                                                    console.error('Please retart, and try again')
                                                    db.end();
                                                    process.exit();
                                                } else {
                                                    console.log("Employee has been added!")
                                                    viewAllEmployees()
                                                }
                                            });
                                        });
                                }
                            });
                        });
                }
            });
        });
};

// Update Employee Roll

// Remove Department, Role, Employee
