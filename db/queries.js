const mysql = require("mysql2");

require("dotenv").config();

// Creates a connection to the MySQL database
const db = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL username,
    user: process.env.DB_USER,
    // MySQL password
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  },
  console.log(`Connected to the employees_db database.`)
);

// The class to contain all of the queries needed
class Queries {
  constructor() { }

  // Queries for all the departments
  async selectDepts() {
    return await db.promise().query(`SELECT id, department_name FROM department;`);
  }

  // Queries for all the roles
  async selectRoles() {
    return await db.promise().query(`SELECT role.id, role.title, role.salary, department.department_name FROM role
    INNER JOIN department ON role.department_id = department.id;`);
  }

  // Queries for all the employees
  async selectEmployees() {
    return await db.promise().query(` SELECT 
    e.id, e.first_name, e.last_name, 
    role.title, department.department_name, role.salary, 
    IFNULL(CONCAT(m.first_name, ' ', m.last_name), 'No manager') AS manager 
    FROM ((employee e 
    LEFT JOIN employee m ON m.id = e.manager_id)
    INNER JOIN role ON role.id = e.role_id)
    INNER JOIN department ON role.department_id = department.id;`);
  }

  // Inserts a new department
  async addDept(response) {
    await db.promise().query(`INSERT INTO department (department_name) VALUES ('${response}');`);
  }

  // Inserts a new role
  async addRole(response) {
    const { roleName, salaryAmt, roleDept } = response;

    // Accesses the department id of the role based on the name input
    const tempDept = await db.promise().query(`SELECT id FROM department WHERE department_name = "${roleDept}";`);

    const deptId = await tempDept[0][0].id;

    await db.promise().query(`INSERT INTO role (title, salary, department_id) VALUES ('${roleName}', ${salaryAmt}, ${deptId});`);
  }

  // Inserts a new employee
  async addEmployee(response) {
    const { employFName, employLName, employRole, employManager } = response;

    // Accesses the role id of the employee based on the title input
    const tempRole = await db.promise().query(`SELECT id FROM role WHERE title = "${employRole}";`);

    const roleId = await tempRole[0][0].id;

    // Accesses the manager id of the employee based on the name input
    const tempManager = await db.promise().query(`SELECT id FROM employee WHERE CONCAT(first_name, ' ', last_name) = "${employManager}";`);

    const managerId = await tempManager[0][0].id;

    await db.promise().query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${employFName}', '${employLName}', ${roleId}, ${managerId});`);
  }

  // Updates the role of an employee
  async updateRole(response) {
    const { roleUpdateEmploy, roleUpdateRole } = response;

    // Accesses the role id of the employee based on the title input
    const tempRole = await db.promise().query(`SELECT id FROM role WHERE title = "${roleUpdateRole}";`);

    const roleId = await tempRole[0][0].id;

    await db.promise().query(`UPDATE employee SET role_id = ${roleId} WHERE CONCAT(first_name, ' ', last_name) = "${roleUpdateEmploy}";`);
  }
}

module.exports = Queries;