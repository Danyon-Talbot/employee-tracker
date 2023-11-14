INSERT INTO departments (id, name)
VALUES
  (1, 'Human Resources'),
  (2, 'Technology'),
  (3, 'Marketing');


INSERT INTO roles (id, title, salary, department_id)
VALUES
  (1, 'HR Manager', 50000, 1),
  (2, 'Employee Welfare Manager', 40000, 1),
  (3, 'Support Technician', 35000, 2),
  (4, 'Software Engineer', 80000, 2),
  (5, 'PR Manager', 50000, 3),
  (6, 'Advertisement Manager', 45000, 3);


INSERT INTO employees (id, first_name, last_name, role_id, manager_id)
VALUES
  (1, 'John', 'Doe', 1, NULL),
  (2, 'Jane', 'Smith', 1, 1),
  (3, 'Bob', 'Johnson', 2, NULL),
  (4, 'Bill', 'Billson', 2, 3),
  (5, 'Mary', 'Pinket', 3, NULL),
  (6, 'Samuel', 'Travis', 3, 5);