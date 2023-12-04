const mysql = require("mysql2");

const db = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL username,
    user: 'root',
    // MySQL password
    password: 'levcol26',
    database: 'employees_db'
  },
  console.log(`Connected to the employees_db database.`)
);

class Queries {
  constructor() { }

  async selectDepts() {


    return await db.promise().query(`SELECT id, department_name FROM department`)
    // .then(([rows, fields]) => {
    //   console.log(rows);
    // })
    // .catch(console.log);


    // const [rows,fields] = await db.promise().query(`SELECT id, department_name FROM department`,
    //   function (err, results, fields) {
    //     console.log(err)
    //     console.log(results)
    //     console.log(fields)
    //   }
    // )

  }

  async selectRoles() {
    return await db.promise().query(`SELECT role.id, role.title, role.salary, department.department_name FROM role
    INNER JOIN department ON role.department_id = department.id`)
    // .then(([rows, fields]) => {
    //   console.log(rows);
    // })
    // .catch(console.log);
  }

  async selectEmployees() {
    return await db.promise().query(` SELECT 
    e.id, e.first_name, e.last_name, 
    role.title, department.department_name, role.salary, 
    IFNULL(CONCAT(m.first_name, ' ', m.last_name), 'No manager') AS manager 
    FROM ((employee e 
    LEFT JOIN employee m ON m.id = e.manager_id)
    INNER JOIN role ON role.id = e.role_id)
    INNER JOIN department ON role.department_id = department.id;`)
    // .then(([rows, fields]) => {
    //   console.log(rows);
    // })
    // .catch(console.log);
  }

  async addDept(response) {
    await db.promise().query(`INSERT INTO department (department_name) VALUES ('${response}')`)
    // .then(([rows, fields]) => {
    //   // console.log(rows);
    // })
    // .catch(console.log);
  }

  async addRole(response) {
    const { roleName, salaryAmt, roleDept } = response;
    // console.log(roleName)
    // console.log(salaryAmt)
    // console.log(roleDept)

    const tempDept = await db.promise().query(`SELECT id FROM department WHERE department_name = "${roleDept}"`)

    const deptId = await tempDept[0][0].id;

    // console.log(tempDept);
    // console.log(deptId);

    await db.promise().query(`INSERT INTO role (title, salary, department_id) VALUES ('${roleName}', ${salaryAmt}, ${deptId});`)
    // .then(([rows, fields]) => {
    //   // console.log(rows);
    // })
    // .catch(console.log);
  }

  async addEmployee(response) {
    const { employFName, employLName, employRole, employManager } = response;
    // console.log(roleName)
    // console.log(salaryAmt)
    // console.log(roleDept)

    const tempRole = await db.promise().query(`SELECT id FROM role WHERE title = "${employRole}"`)

    const roleId = await tempRole[0][0].id;

    // console.log(roleId);


    const tempManager = await db.promise().query(`SELECT id FROM employee WHERE CONCAT(first_name, ' ', last_name) = "${employManager}"`)

    const managerId = await tempManager[0][0].id;

    // console.log(tempDept);
    // console.log(managerId);

    await db.promise().query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${employFName}', '${employLName}', ${roleId}, ${managerId});`)
    // .then(([rows, fields]) => {
    //   // console.log(rows);
    // })
    // .catch(console.log);
  }
}


// INNER JOIN role ON role.id = e.role_id)
// role.title, role.salary, role.department_id,

// const deptInfo = await db.query(`SELECT id, department_name  FROM employees_db.department`, function (err, results) {
//   return results;
// });

module.exports = Queries;