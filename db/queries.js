module.exports = {

    // selectViewDepartments: () =>
    //     `SELECT name FROM department`,

    // selectViewRoles: () =>
    //     `SELECT role.title, role.salary, department.name 
    //     FROM role 
    //     INNER JOIN department ON role.department_id = department.id;`,

    // selectViewEmployees: () =>
    //     `SELECT employee.first_name, employee.last_name, role.title 
    // FROM employee 
    // INNER JOIN role ON employee.role_id = role.id;`,

    // selectAddDepartment: (answer) =>
    //     `INSERT INTO department (name) VALUES ("${answer}");`,

    // selectAddRole: (name, salary, id) =>
    //     `INSERT INTO role (title, salary, department_id) VALUES ("${name}","${salary}",${id});`,

    // selectAddEmployee: (first, last, id) =>
    //     `INSERT INTO employee (first_name, last_name, role_id) VALUES ("${first}","${last}",${id});`,

    selectEmployee: () =>
        `SELECT first_name, last_name FROM employee`,

    selectRoleID: () =>
        `SELECT id, title FROM role`,

    updateEmployee: (role, first) =>
        `UPDATE employee SET role_id = ${role[1]} WHERE first_name = "${first[0]}";`,
}

