const mysql = require('mysql2');
const inquirer = require('inquirer');
require('dotenv').config();


const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Database Connection Successfull!');

    startApp();
});

function startApp() {
    inquirer
        .prompt({
            type: 'list',
            name: 'choice',
            message: 'What would you like to do?',
            choices: [
                'View All Departments', 
                'View All Roles', 
                'View All Employees', 
                'Add Department', 
                'Add Role', 
                'Add Employee', 
                'Update Employee Role', 
                'Exit',
            ],
        })
        .then((answers) => {
            switch (answers.choice) {
                case 'View All Departments':
                    viewAllDepartments();
                    break;
                case 'View All Roles':
                    viewAllRoles();
                    break;
                case 'View All Employees':
                    viewAllEmployees();
                    break;
                case 'Add Department':
                    addDepartment();
                    break;
                case 'Add Role':
                    addRole();
                    break;
                case 'Add Employee':
                    addEmployee();
                    break;
                case 'Update Employee Role':
                    updateRole();
                    break;
                case 'Exit':
                    connection.end();
                    console.log('Bye!');
                    break;
            }
        });
}

function viewAllDepartments() {
    connection.query('SELECT * FROM departments', (err, results) => {
      if (err) throw err;
      console.table(results);
      startApp();
    });
  }

function viewAllRoles() {
    connection.query('SELECT * FROM roles', (err, results) => {
        if (err) throw err;
        console.table(results);
        startApp();
    })
}

function viewAllEmployees() {
    connection.query('SELECT * FROM employees', (err, results) => {
        if (err) throw err;
        console.table(results);
        startApp();
    })
}