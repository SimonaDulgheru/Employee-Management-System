const express = require("express");
const mysql = require("mysql");
const inquirer = require('inquirer');
const cTable = require('console.table');
const CFonts = require("cfonts");
// const { selectViewDepartments, selectViewRoles, selectViewEmployees,
//     selectAddDepartment, selectAddRole, selectAddEmployee, selectEmployee,
//     selectRoleID, updateEmployee } = require("./db/queries");
const queries = require("./db/index");



CFonts.say('Employee|Manager!', {
    font: 'block',
    align: 'center',
    colors: ['system'],
    background: 'transparent',
    letterSpacing: 1,
    lineHeight: 1,
    space: true,
    maxLength: '0',
});

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "test",
    database: "employees"
});

connection.connect(function (err) {
    if (err) throw err;
    startAPP();
});


function startAPP() {
    
    return inquirer.prompt([
        {
            type: "list",
            name: "action",
            message: "What would you like to do?",
            choices: [
                "View departments, roles, or employees",
                "Add departments, roles, or employees",
                "Update exsisting employee role",
                "Nothing, I am done"
            ]
        }
    ]).then(function (answer) {
        switch (answer.action) {
            case "View departments, roles, or employees":
                view();
                break;
            case "Add departments, roles, or employees":
                add();
                break;
            case "Update exsisting employee role":
                update();
                break;
            case "Nothing, I am done":
                endAPP();
                break;
        }
    });
};


function reStart() {
    return inquirer.prompt([
        {
            type: "list",
            name: "action",
            message: "Would you like to do another action?",
            choices: [
                "Yes",
                "No, I'm Done"
            ]
        }
    ]).then(function (answer) {
        switch (answer.action) {
            case "Yes":
                startAPP();
                break;
            case "No, I am done":
                endAPP();
                break;
        }
    });
};


function view() {
    return inquirer.prompt([
        {
            type: "list",
            name: "action",
            message: "What would you like to view?",
            choices: [
                "Departments",
                "Roles",
                "Employees",
                "Back to main menu"
            ]
        }
    ]).then(function (answer) {
        switch (answer.action) {
            case "Departments":
                viewDepartment();
                break;
            case "Roles":
                viewRoles();
                break;
            case "Employees":
                viewEmployees();
                break;
            case "Back to main menu":
                startAPP();
                break;
        }
    });
};


function viewDepartment() {
    connection.query(findAllDepartments(),
        function (err, result) {
            if (err) throw err;

            console.table(result);
            reStart();
        });
}

function viewRoles() {
    connection.query( findAllRoles(),
        function (err, result) {
            if (err) throw err;

            console.table(result);
            reStart();
        });
};

function viewEmployees() {
    connection.query(findAllEmployees(),
        function (err, result) {
            if (err) throw err;

            console.table(result);
            reStart();
        });
}


function add() {
    return inquirer.prompt([
        {
            type: "list",
            name: "action",
            message: "What would you like to add?",
            choices: [
                "Department",
                "Role",
                "Employee",
                "Back to main menu"
            ]
        }
    ]).then(function (answer) {
        switch (answer.action) {
            case "Department":
                addDepartment();
                break;
            case "Role":
                addRoles();
                break;
            case "Employee":
                addEmployees();
                break;
            case "Back to main menu":
                startAPP();
                break;
        }
    });
};


function addDepartment() {
    return inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "What is the name of the department?",
        },
    ]).then(function (answer) {
        connection.query( createDepartment(answer.name), function (err, result) {
            if (err) throw err;
            viewDepartment();
        });
    });
};

function addRoles() {
    return inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "What is the title of this role?",
        },
        {
            type: "number",
            name: "salary",
            message: "What is the salary of this role (only enter a number, no comas)?",
        },
        {
            type: "number",
            name: "id",
            message: "What is the Department ID number (refer to department view)?",
        },
    ]).then(function (answers) {
        connection.query(createRole(answers.name, answers.salary, answers.id),
            function (err, result) {
                if (err) throw err;
                viewRoles();
            });
    });
};

function addEmployees() {
    return inquirer.prompt([
        {
            type: "input",
            name: "first",
            message: "What is the first name of the Employee?",
        },
        {
            type: "input",
            name: "last",
            message: "What is the last name of the Employee?",
        },
        {
            type: "input",
            name: "id",
            message: "What is the employees role ID?",
        }
    ]).then(function (answers) {
        connection.query(createEmployee(answers.first, answers.last, answers.id),
            function (err, result) {
                if (err) throw err;
                viewEmployees();
            });
    });
};


function update() {

    connection.query(selectEmployee(),
        function (err, result) {
            if (err) throw err;

            let employeeArray = [];

            for (var i = 0; i < result.length; i++) {

                let employees = result[i].first_name + " " + result[i].last_name;

                employeeArray.push(employees);
            }

            connection.query(selectRoleID(),
                function (err, result) {
                    if (err) throw err;

                    let roleIdArray = [];

                    for (var i = 0; i < result.length; i++) {

                        let roles = result[i].title + " " + result[i].ID;

                        roleIdArray.push(roles);
                    }

                    inquirer.prompt([
                        {
                            type: "list",
                            name: "employee",
                            message: "What employee would you like to update",
                            choices: employeeArray
                        },
                        {
                            type: "list",
                            name: "role",
                            message: "What is the employee's new role?",
                            choices: roleIdArray
                        }
                    ]).then(function (answers) {

                        let newRole = answers.role.split(" ");
                        let firstName = answers.employee.split(" ");

                        connection.query(updateEmployee(newRole, firstName), function (err, result) {
                            if (err) throw err;
                            viewEmployees();
                        })
                    });
                });
        });
}


function endAPP() {
    console.log("Exit console -- actions are complete --")
};
