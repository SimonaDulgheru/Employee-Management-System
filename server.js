const express = require("express");
const mysql = require("mysql");
const inquirer = require('inquirer');
const db = require("./db");
const cTable = require('console.table');

const port = process.env.PORT;

const app = express();

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "test",
    database: "employees"
});

connection.connect(function (err) {
    if (err) throw err;
});

const questions =[
    {
        type: "list",
        name: "actions",
        message: "What would you like to do?",
        choices: [
            'View all employees',
            'View all company roles',
            'View all company departments',
            'Add an employee',
            'Add a company role',
            'Add a company department',
            'Update an employee role'
        ]
    }
];

const addEmployee = [
    {
        type: "input",
        name: "emplfname",
        message: "What is the employee's first name?",
    },
    {
        type: "input",
        name: "empllname",
        message: "What is the employee's last name?"
    },
    {
        type: "input",
        name: "emplid",
        message: "What is the employee's role id number?"
    },
    {
        type: "input",
        name: "emplmgrid",
        message: "What is the employee's manager id number?"
    }
];

const addRoleQuestions = [
    {
        type: "input",
        name: "roletitle",
        message: "What is the role title?",
    },
    {
        type: "input",
        name: "rolesalary",
        message: "What is the salary for the role?"
    },
    {
        type: "input",
        name: "roledeptid",
        message: "What is the role's department ID number?"
    }
];

const addDepartment= [
    {
        type: "input",
        name: "deptname",
        message: "What is the name of the department?",
    },
    {
        type: "input",
        name: "deptid",
        message: "What is the department ID number?"
    }
];

function userStart() {
    inquirer
        .prompt(questions)
        .then(function (answer) {
            switch (answer.actions) {
                case "View all employees":
                    viewEmpls();
                    break;

                case 'View all company roles':
                    viewAllRoles();
                    break;

                case 'View all company departments':
                    viewAllDepts();
                    break;

                case "Add an employee":
                    addEmpl();
                    break;

                case 'Add a company role':
                    addRole();
                    break;

                case "Add a company department":
                    addDept();
                    break;

                case "Update an employee role":
                    updateEmplRole();
                    break;
            }
        })
};

function viewEmpls() {
    const query = "SELECT employees.id , employees.first_name , employees.last_name , roles.title , departments.department ,  roles.salary , employees.manager_id FROM employees JOIN roles ON employees.role_id = roles.role_id"
    query += " JOIN departments ON roles.department_id = departments.department_id"
    connection.query(query, function (err, res) {
        if (err) {
            throw err
        }
        console.log("")
        console.table(res)
        userStart()
    })
};

function viewAllRoles() {
    const query = "SELECT roles.role_id , roles.title FROM roles"
    connection.query(query, function (err, res) {
        if (err) {
            throw err
        }
        console.log("")
        console.table(res)
        userStart()
    })
};

function viewAllDepts() {
    const query = "SELECT departments.department_id , departments.department FROM departments"
    connection.query(query, function (err, res) {
        if (err) {
            throw err
        }
        console.log("")
        console.table(res)
        userStart()
    })
};

async function addEmpl() {
    await inquirer
        .prompt(addEmployee)
        .then(emplData => {
            const query = connection.query(
                "INSERT INTO employees SET ?",
                {
                    "first_name": emplData.emplfname,
                    "last_name": emplData.empllname,
                    "role_id": emplData.emplid,
                    "manager_id": emplData.emplmgrid
                },
                function (err, res) {
                    if (err) {
                        throw err
                    }
                    console.log(query.sql);
                    userStart()
                })
        })

};

async function addRole() {
    await inquirer
        .prompt(addRoleQuestions)
        .then(roleData => {
            const query = connection.query(
                "INSERT INTO roles SET ?",
                {
                    "title": roleData.roletitle,
                    "salary": roleData.rolesalary,
                    "department_id": roleData.roledeptid
                },
                function (err, res) {
                    if (err) {
                        throw err
                    }
                    console.log(query.sql);
                    userStart()
                })
        })

};

async function addDept() {
    await inquirer
        .prompt(addDepartment)
        .then(deptData => {
            const query = connection.query(
                "INSERT INTO departments SET ?",
                {
                    "department_id": deptData.deptid,
                    "department": deptData.deptname
                },
                function (err, res) {
                    if (err) {
                        throw err
                    }
                    console.log(query.sql);
                    userStart()
                })
        })

};

async function updateEmplRole() {
    
        await inquirer
            .prompt(
                [
                    {
                        type: "input",
                        name: "emplbyid",
                        message: "What is the id number of the employee's role that you would like to change?",
                    },
                    {
                        type: "input",
                        name: "emplroleid",
                        message: "What is the employee's new role id number?"
                    }
                ]
            )
            .then(employeeid => {
                const query = connection.query(
                    "UPDATE employees SET role_id = ? WHERE ?",
                    [
                        {
                            "role_id": employeeid.emplroleid
                        },
                        {
                            "id": employeeid.emplbyid
                        }
                    ],
                    function (err, res) {
                        if (err) {
                            throw err
                        }
                        console.log(query.sql);
                        userStart()
                    })
            })

};

userStart()