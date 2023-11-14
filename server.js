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
    const query = `
      SELECT roles.id, roles.title, roles.salary, departments.name AS department_name
      FROM roles
      INNER JOIN departments ON roles.department_id = departments.id;
    `;
  
    connection.query(query, (err, results) => {
      if (err) throw err;
      console.table(results);
      startApp();
    });
  }
function viewAllEmployees() {
    const query = `
    SELECT employees.id, employees.first_name, employees.last_name,
           roles.title AS job_title, departments.name AS department_name,
           roles.salary, CONCAT(managers.first_name, ' ', managers.last_name) AS manager
    FROM employees
    INNER JOIN roles ON employees.role_id = roles.id
    INNER JOIN departments ON roles.department_id = departments.id
    LEFT JOIN employees AS managers ON employees.manager_id = managers.id;
  `;

  connection.query(query, (err, results) => {
    if (err) throw err;
    console.table(results);
    startApp();
  });
}