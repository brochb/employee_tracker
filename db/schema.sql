DROP DATABASE IF EXISTS employee_tracker_db;
CREATE DATABASE employee_tracker_db;

USE employee_tracker_db

CREATE TABLE departments
    id INT NOT NULL AUTO_INCREMENT,
    dpmt_name VARCHAR(30),
    PRIMARY KEY (id)


CREATE TABLE roles
    id INT NOT NULL PRIMARY KEY,
    title VARCHAR(30),
    salary DECIMAL,
    department_id INT,
    FOREIGN KEY (department_id)
    REFERENCES department(id)
    ON DELETE SET NULL

CREATE TABLE employees
    id INT NOT NULL PRIMARY KEY,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT,
    is_manager BOOLEAN DEFAULT FALSE,
    manager_id INT DEFAULT 0,
    FOREIGN KEY (role_id)
    REFERENCES role(id)
    ON DELETE SET NULL,
    FOREIGN KEY (manager_id)
    REFERENCES manager(id)
    ON DELETE SET NULL

-- CREATE TABLE salaries
--     id INT NOT NULL PRIMARY KEY