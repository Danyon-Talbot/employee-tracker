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

function addDepartment() {
  inquirer
      .prompt({
          type: 'input',
          name: 'name',
          message: 'Enter the name of the department:',
      })
      .then((answers) => {
          const department = {
              name: answers.name,
          };

          connection.query('INSERT INTO departments SET ?', department, (err) => {
              if (err) throw err;
              console.log('Department added successfully!');
              startApp();
          });
      });
}

function addRole() {
  // Fetch and display a list of currently stored departments
  connection.query('SELECT id, name FROM departments', (err, departments) => {
      if (err) throw err;

      // Extract department names from the result
      const departmentNames = departments.map((department) => department.name);

      inquirer
          .prompt([
              {
                  type: 'input',
                  name: 'title',
                  message: 'Enter the title of the role:',
              },
              {
                  type: 'input',
                  name: 'salary',
                  message: 'Enter the salary for the role:',
              },
              {
                  type: 'list',
                  name: 'departmentName',
                  message: 'Select the department for the role:',
                  choices: departmentNames, // Displays departments from database as choices
              },
          ])
          .then((answers) => {
              // Find the department ID based on the selected department name
              const selectedDepartment = departments.find(
                  (department) => department.name === answers.departmentName
              );

              if (!selectedDepartment) {
                  console.log('Invalid department selection.');
                  startApp();
                  return;
              }

              const role = {
                  title: answers.title,
                  salary: answers.salary,
                  department_id: selectedDepartment.id,
              };

              connection.query('INSERT INTO roles SET ?', role, (err) => {
                  if (err) throw err;
                  console.log('Role added successfully!');
                  startApp();
              });
          });
  });
}

function addEmployee() {
  // Fetch and display a list of all current roles
  connection.query('SELECT id, title FROM roles', (err, roles) => {
      if (err) throw err;

      // Extract role titles from the result
      const roleTitles = roles.map((role) => role.title);

      // Fetch and display a list of all current employees to select a manager
      connection.query('SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employees', (err, employees) => {
          if (err) throw err;

          // Extract employee names from the result
          const employeeNames = employees.map((employee) => employee.name);

          inquirer
              .prompt([
                  {
                      type: 'input',
                      name: 'first_name',
                      message: 'Enter the employee\'s first name:',
                  },
                  {
                      type: 'input',
                      name: 'last_name',
                      message: 'Enter the employee\'s last name:',
                  },
                  {
                      type: 'list', // Use a list type for role selection
                      name: 'roleTitle',
                      message: 'Select the employee\'s role:',
                      choices: roleTitles, // Display role titles as choices
                  },
                  {
                      type: 'list', // Use a list type for manager selection
                      name: 'managerName',
                      message: 'Select the employee\'s manager:',
                      choices: employeeNames, // Display employee names as choices
                  },
              ])
              .then((answers) => {
                  // Finds the role ID based on the selected role title
                  const selectedRole = roles.find((role) => role.title === answers.roleTitle);

                  // Finds the manager ID based on the selected manager name
                  const selectedManager = employees.find((employee) => employee.name === answers.managerName);

                  if (!selectedRole || !selectedManager) {
                      console.log('Invalid role or manager selection.');
                      startApp();
                      return;
                  }

                  const employee = {
                      first_name: answers.first_name,
                      last_name: answers.last_name,
                      role_id: selectedRole.id,
                      manager_id: selectedManager.id,
                  };

                  connection.query('INSERT INTO employees SET ?', employee, (err) => {
                      if (err) throw err;
                      console.log('Employee added successfully!');
                      startApp(); // Return to the main menu
                  });
              });
      });
  });
}

function updateRole() {
  // Fetch and display a list of all current employees
  connection.query('SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employees', (err, employees) => {
      if (err) throw err;

      // Extract employee names from the result
      const employeeNames = employees.map((employee) => employee.name);

      // Fetch and display a list of all current roles
      connection.query('SELECT id, title FROM roles', (err, roles) => {
          if (err) throw err;

          // Extract role titles from the result
          const roleTitles = roles.map((role) => role.title);

          inquirer
              .prompt([
                  {
                      type: 'list', // Use a list type for employee selection
                      name: 'employeeName',
                      message: 'Select the employee to update:',
                      choices: employeeNames, // Display employee names as choices
                  },
                  {
                      type: 'list', // Use a list type for role selection
                      name: 'newRoleTitle',
                      message: 'Select the employee\'s new role:',
                      choices: roleTitles, // Display role titles as choices
                  },
              ])
              .then((answers) => {
                  // Find the employee ID based on the selected employee name
                  const selectedEmployee = employees.find((employee) => employee.name === answers.employeeName);

                  // Find the role ID based on the selected role title
                  const selectedRole = roles.find((role) => role.title === answers.newRoleTitle);

                  if (!selectedEmployee || !selectedRole) {
                      console.log('Invalid employee or role selection.');
                      startApp(); // Return to the main menu
                      return;
                  }

                  connection.query(
                      'UPDATE employees SET role_id = ? WHERE id = ?',
                      [selectedRole.id, selectedEmployee.id],
                      (err) => {
                          if (err) throw err;
                          console.log('Employee role updated successfully!');
                          startApp(); // Return to the main menu
                      }
                  );
              });
      });
  });
}
