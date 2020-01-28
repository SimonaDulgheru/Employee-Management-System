DROP DATABASE IF EXISTS employees;

CREATE DATABASE employees;

USE employees;

CREATE TABLE department (
id INT NOT NULL AUTO_INCREMENT,
department VARCHAR(30) UNIQUE NOT NULL,
PRIMARY KEY (id)
);

CREATE TABLE roles (
id INT NOT NULL AUTO_INCREMENT,
title VARCHAR(30) NOT NULL,
salary DECIMAL(10,0) NOT NULL,
department_id INT NOT NULL,
PRIMARY KEY (id),
FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABLE employee (
id INT NOT NULL AUTO_INCREMENT,
first_name VARCHAR(30) NOT NULL,
last_name VARCHAR(30) NOT NULL,
role_id INT NOT NULL,
manager_id INT NULL,
PRIMARY KEY (id),
FOREIGN KEY (role_id) REFERENCES roles(id),
FOREIGN KEY (manager_id) REFERENCES employee(id)
);


INSERT INTO department (department)
VALUES ('HR'), ('Retail'), ('Engineering'), ('Marketing');

INSERT INTO roles (title, salary, department_id)
VALUES 
    ('HR Manager', 90000, 1),
    ('HR Assistant', 45000, 1),
    ('Retail Manager', 70000, 2),
    ('Associate Retail Manager', 50000, 2),
    ('Lead Engineer', 70000, 3),
    ('Associate Engineer', 50000, 3),
    ('Marketing Manager', 75000, 4),
    ('Associate Marketing Manager', 45000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ('Katie', 'Smith', 1, NULL),
    ('David', 'Smith', 2, 1),
    ('Eric', 'Wilson', 3, NULL),
    ('Kevin', 'Carlos', 4, 3),
    ('Paul', 'Knotts', 5, NULL),
    ('Marc', 'Washington', 6, 5),
    ('Joe', 'Green', 7, NULL),
    ('Ellie', 'Carter', 8, 7);