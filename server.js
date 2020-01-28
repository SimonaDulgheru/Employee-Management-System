var mysql = require("mysql");
var inquirer = require("inquirer");
var table = require("console.table");
var CFonts = require("cfonts");

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


//Creating database connection
var connection = mysql.createConnection({
    host: "localhost",
    port: process.env.PORT || 3306,
    user: "root",
    password: "test",
    database: "employees"
});

connection.connect(function (err) {
    if (err) throw err;
    start();
});

//main function
function start() {
    inquirer
        .prompt({
            name: "begin",
            type: "list",
            message: "What would you like to do?",
            choices:
                [
                    "View All Employees",
                    "View Employees by Department",
                    "View Employees by Role",
                    "Add Employee",
                    "Update Employee's Role",
                    "Quit"
                ]
        })
        .then(function (answer) {
            if (answer.begin === "View All Employees") {
                viewAllEmp();
            }
            else if (answer.begin === "View Employees by Department") {
                viewEmpDepartment();
            }
            else if (answer.begin === "View Employees by Role") {
                viewEmpRole();
            }
            else if (answer.begin === "Add Employee") {
                addEmployee();
            }
            else if (answer.begin === "Update Employee's Role") {
                updateRole();
            }
            else if (answer.begin === "Quit") {
                console.log("END");
            }
            else {
                connection.end();
            }
        });
}

//View all employees
function viewAllEmp() {
    connection.query("SELECT employee.id, employee.first_name, employee.last_name, employee.manager_id, roles.title, roles.salary, department.department FROM ((employee INNER JOIN roles ON employee.role_id = roles.id) INNER JOIN department ON roles.department_id = department.id)", function (err, result) {
        if (err) throw err;
        console.table(result);
        start();
    });
}

//View all employees by department
function viewEmpDepartment() {
    inquirer
        .prompt({
            name: "department",
            type: "list",
            message: "Which department would you like to see employees for?",
            choices: ["HR", "Retail", "Engineering", "Marketing"]
        })
        .then(function (answer) {
            if (answer.department === "HR" || "Retail" || "Engineering" || "Marketing") {
                connection.query("SELECT employee.id, employee.first_name, employee.last_name, employee.manager_id, roles.title, roles.salary, department.department FROM ((employee INNER JOIN roles ON employee.role_id = roles.id) INNER JOIN department ON roles.department_id = department.id) WHERE department = ?", [answer.department], function (err, result) {
                    if (err) throw err;
                    console.table(result);
                    start();
                });
            }
        });
}

//View all employees by role
function viewEmpRole() {
    inquirer
        .prompt({
            name: "role",
            type: "list",
            message: "Which role would you like to see employees for?",
            choices:
                [
                    "HR Manager",
                    "HR Assistant",
                    "Retail Manager",
                    "Associate Retail Manager",
                    "Lead Engineer",
                    "Associate Engineer",
                    "Marketing Manager",
                    "Associate Marketing Manager"
                ]
        })
        .then(function (answer) {
            if (answer.role === "HR Manager" || "HR Assistant" || "Retail Manager" || "Associate Retail Manager" || "Lead Engineer" || "Associate Engineerr" || "Marketing Manager" || "Associate Marketing Manager") {
                connection.query("SELECT employee.id, employee.first_name, employee.last_name, employee.manager_id, roles.title, roles.salary, department.department FROM ((employee INNER JOIN roles ON employee.role_id = roles.id) INNER JOIN department ON roles.department_id = department.id) WHERE title = ?", [answer.role], function (err, result) {
                    if (err) throw err;
                    console.table(result);
                    start();
                });
            }
        });
}

//Add new employee
function addEmployee() {
    inquirer
        .prompt([
            {
                name: "first",
                type: "input",
                message: "What is your employees first name?"
            },
            {
                name: "last",
                type: "input",
                message: "What is your employees last name?"
            },
            {
                name: "title",
                type: "list",
                message: "What is your employees role?",
                choices:
                    [
                        "HR Manager",
                        "HR Assistant",
                        "Retail Manager",
                        "Associate Retail Manager",
                        "Lead Engineer",
                        "Associate Engineer",
                        "Marketing Manager",
                        "Associate Marketing Manager"
                    ]
            },
            {
                name: "salary",
                type: "input",
                message: "What is your employees salary?"
            },
            {
                name: "dept",
                type: "list",
                message: "What is your employees department?",
                choices: ["HR", "Retail", "Engineering", "Marketing"]
            },
            {
                name: "manager",
                type: "list",
                message: "Who is your employees manager?",
                choices: ["Katie", "Eric", "Paul", "Ellie", "None"]
            }
        ])
        .then(function (answer) {

            var dept_id;
            if (answer.dept === "HR") {
                dept_id = 1;
            }
            else if (answer.dept === "Retail") {
                dept_id = 2;
            }
            else if (answer.dept === "Engineering") {
                dept_id = 3;
            }
            else if (answer.dept === "Marketing") {
                dept_id = 4;
            }

            connection.query("INSERT INTO roles SET ?",
                {
                    title: answer.title,
                    salary: answer.salary,
                    department_id: dept_id
                },
                function (err, result) {
                    if (err) throw err;
                }
            );

            var manager_id;
            if (answer.manager === "Katie") {
                manager_id = 1;
            }
            else if (answer.manager === "Eric") {
                manager_id = 2;
            }
            else if (answer.manager === "Paul") {
                manager_id = 3;
            }
            else if (answer.manager === "Ellie") {
                manager_id = 4;
            }
            else if (answer.manager === "None") {
                manager_id = null;
            }

            var role_id;
            if (answer.title === "HR Manager") {
                role_id = 1;
            }
            else if (answer.title === "HR Assistant") {
                role_id = 2;
            }
            else if (answer.title === "Retail Manager") {
                role_id = 3;
            }
            else if (answer.title === "Associate Retail Manager") {
                role_id = 4;
            }
            else if (answer.title === "Lead Engineer") {
                role_id = 5;
            }
            else if (answer.title === "Associate Engineer") {
                role_id = 6;
            }
            else if (answer.title === "Marketing Manager") {
                role_id = 7;
            }
            else if (answer.title === "Associate Marketing Manager") {
                role_id = 8;
            }

            connection.query("INSERT INTO employee SET ?",
                {
                    first_name: answer.first,
                    last_name: answer.last,
                    role_id: role_id,
                    manager_id: manager_id
                },
                function (err, result) {
                    if (err) throw err;
                    console.log("=== New Employee Added ===");
                    start();
                }
            );
        });
}

//Update employee role
function updateRole() {
    connection.query("SELECT id, first_name, last_name FROM employee", function (err, result) {
        if (err) throw err;
        var choiceArray = [];
        for (var i = 0; i < result.length; i++) {
            var choices = result[i].id;
            choiceArray.push(choices);
        }
        questions = [
            {
            name: "employee",
            type: "list",
            message: "Which employee would you like to update?",
            choices: choiceArray
        },
        {
            name: "newTitle",
            type: "list",
            message: "What is the employee's new role?",
            choices:
                [
                    "HR Manager",
                    "HR Assistant",
                    "Retail Manager",
                    "Associate Retail Manager",
                    "Lead Engineer",
                    "Associate Engineer",
                    "Marketing Manager",
                    "Associate Marketing Manager"
                ]
        }]
        inquirer
            .prompt(questions)
            .then(function (answer) {
                console.log(answer.employee);
                console.log(answer.newTitle)
                let role_id = 0;
                if (answer.newTitle == "HR Manager") {
                    role_id = 1;
                }
                else if (answer.newTitle == "HR Assistant") {
                    role_id = 2;
                }
                else if (answer.newTitle == "Retail Manager") {
                    role_id = 3;
                }
                else if (answer.newTitle == "Associate Retail Manager") {
                    role_id = 4;
                }
                else if (answer.newTitle == "Lead Engineer") {
                    role_id = 5;
                }
                else if (answer.newTitle == "Associate Engineer") {
                    role_id = 6;
                }
                else if (answer.newTitle == "Marketing Manager") {
                    role_id = 6;
                }
                else if (answer.newTitle == "Associate Marketing Manager") {
                    role_id = 6;
                }
                connection.query("UPDATE employee SET role_id = ? WHERE id=?",
                    [role_id, answer.employee],
                    function (err, result) {
                        if (err) throw err;
                        console.log("=== Updated Employee ===");
                        start();
                    }
                )

            });
    })
}


