INSERT INTO departments (name)
VALUES
  ('Human Resources'),
  ('Technology'),
  ('Marketing');


INSERT INTO roles (title, salary, department_id)
VALUES
  ('HR Manager', 50000, 1),
  ('Employee Welfare Manager', 40000, 1),
  ('Support Technician', 35000, 2),
  ('Software Engineer', 80000, 2),
  ('PR Manager', 50000, 3),
  ('Advertisement Manager', 45000, 3);


INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
  ('John', 'Doe', 1, NULL),
  ('Jane', 'Smith', 2, 1),
  ('Bob', 'Johnson', 4, NULL),
  ('Bill', 'Billson', 3, 3),
  ('Mary', 'Pinket', 5, NULL),
  ('Samuel', 'Travis', 6, 5);