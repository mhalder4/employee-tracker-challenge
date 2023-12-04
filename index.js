const inquirer = require("inquirer");
const mysql = require("mysql2");
// require("dotenv").config();
const Queries = require("./db/queries");


const db = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL username,
    user: 'root',
    // MySQL password
    password: 'levcol26',
    database: 'employees_db'
  },
  console.log(`Connected to the movies_db database.`)
);

/*
  Options:
  -View all departments
  -View all roles
  -View all employees
  -Add a department
  -Add a role
  -Add an employee
  -Update an employee role
*/



const initalQues = [
  {
    type: "list",
    message: "What would you like to do?",
    choices: ["View all departments", "View all roles", "View all employees", "Add a department", "Add a role", "Add an employee", "Update an employee role", "Exit"],
    name: "choice"
  },
  {
    type: "input",
    message: "What is the name of the department?",
    name: "deptName",
    when(answers) {
      return checkList("choice", "Add a department")(answers)
    }
  },
  {
    type: "input",
    message: "What is the name of the role?",
    name: "roleName",
    when(answers) {
      return checkList("choice", "Add a role")(answers)
    }
  },
  {
    type: "input",
    message: "What is the salary of the role?",
    name: "salaryAmt",
    when(answers) {
      return !checkInput("roleName")(answers)
    }
  },
  {
    type: "list",
    message: "What department does the role belong to?",
    name: "roleDept",
    choices: findDepts,
    when(answers) {
      return !checkInput("salaryAmt")(answers)
    }
  },
  {
    type: "input",
    message: "What is the employee's first name?",
    name: "employFName",
    when(answers) {
      return checkList("choice", "Add an employee")(answers)
    }
  },
  {
    type: "input",
    message: "What is the employee's last name?",
    name: "employLName",
    when(answers) {
      return !checkInput("employFName")(answers)
    }
  },
  {
    type: "list",
    message: "What is the employee's role?",
    name: "employRole",
    choices: findRoles,
    when(answers) {
      return !checkInput("employLName")(answers)
    }
  },
  {
    type: "list",
    message: "Who is the employee's manager?",
    name: "employManager",
    choices: findEmployees,
    when(answers) {
      // console.log(answers);
      return !checkInput("employRole")(answers)
    }
  },

];

function checkList(name, choice) {
  // console.log(name);
  return function (answers) {
    // console.log(answers);
    // console.log((answers[name]) == choice);
    return (answers[name] == choice);
  };
}

function checkInput(choice) {
  // console.log(choice);
  return function (answers) {
    // console.log(answers[choice]);
    // console.log(!answers[choice]);
    return (!answers[choice]);
  };
}

async function findDepts() {
  const depts = [];
  const deptsInfo = await query.selectDepts();
  deptsInfo[0].forEach(dept => {
    depts.push(dept.department_name);
  })

  return depts;
}

async function findRoles() {
  const roles = [];
  const rolesInfo = await query.selectRoles();
  rolesInfo[0].forEach(role => {
    roles.push(role.title);
  })

  return roles;
}

async function findEmployees() {
  const employees = [];
  const employeesInfo = await query.selectEmployees();
  employeesInfo[0].forEach(employee => {
    employees.push(employee.first_name + " " + employee.last_name);
  })

  employees.push("None");

  return employees;
}



const query = new Queries;


// query.selectDepts();

async function inquirerPrompt() {

  inquirer
    .prompt(initalQues)
    .then(async (answers) => {
      // console.log(answers);
      switch (answers.choice) {
        case "View all departments":
          const deptsQuery = await query.selectDepts();
          console.log(deptsQuery[0]);
          // break;
          process.exit();
        case "View all roles":
          const rolesQuery = await query.selectRoles();
          console.log(rolesQuery[0]);
          // break;
          process.exit();
        case "View all employees":
          const employeesQuery = await query.selectEmployees();
          console.log(employeesQuery[0]);
          // break;
          process.exit();
        case "Add a department":
          // console.log(answers)
          await query.addDept(answers.deptName);
          process.exit();
        // break;
        case "Add a role":
          // await query.addDept(answers.deptName);
          await query.addRole(answers)

          console.log(answers);
          process.exit();
        case "Add an employee":
          // await query.addDept(answers.deptName);
          await query.addEmployee(answers)

          console.log(answers);
          process.exit();


        // break;
        case "Exit":
          process.exit();
      }


      // if (answers.choice === "View all departments") {
      //   await query.selectDepts();
      //   return inquirerPrompt();
      // }
      // if (answers.choice === "Exit") {
      //   // query.selectDepts();
      //   process.exit();
      // }
    });



}


async function start() {
  console.log("Program running");
  await inquirerPrompt();
}

db.connect(async () => {
  await start();

});


// inquirer
//   .prompt(initalQues)
//   .then(answers => {
//     console.log(answers);
//     if (answers.choice === "View all departments") {
//       // query.selectDepts();
//     }
//     return inquirerPrompt();
//   })

