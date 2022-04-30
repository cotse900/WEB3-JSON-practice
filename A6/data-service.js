// Uncomment if needed
// const { create } = require('express-handlebars');
// const { where } = require('sequelize');
const Sequelize = require('sequelize'); 
// Replace the credentials
var sequelize = new Sequelize(database, user, password,  { query: { raw: true },

       host: 'ec2-3-217-251-77.compute-1.amazonaws.com',     
       dialect: 'postgres',     
       port: 5432,     
       dialectOptions: {         
         ssl: { rejectUnauthorized: false }     
        },
        logging: true 
      });

      var Employee = sequelize.define('Employee', {
        employeeNum: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        firstName: Sequelize.STRING,
        lastName: Sequelize.STRING, 
        email: Sequelize.STRING, 
        SSN: Sequelize.STRING, 
        addressStreet: Sequelize.STRING, 
        addressCity: Sequelize.STRING, 
        addressState: Sequelize.STRING, 
        addressPostal: Sequelize.STRING, 
        maritalStatus: Sequelize.STRING,
        isManager: Sequelize.BOOLEAN, 
        employeeManagerNum: Sequelize.INTEGER, 
        status: Sequelize.STRING,
        hireDate: Sequelize.STRING 
      }) 

      var Department = sequelize.define('Department', {

        departmentId: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        departmentName: Sequelize.STRING
      })

      //Department.hasMany(Employee, {foreignKey: 'department'}); 

module.exports.initialize = function () {
  return new Promise(function (resolve, reject) {
    sequelize.sync().then(() =>{
      resolve()
    }).catch(() =>{
      reject("unable to sync the database")
    })
  });
}

module.exports.getAllEmployees = function () {
  return new Promise(function (resolve, reject) {
    Employee.findAll().then((data) =>{
      resolve(data)
    }).catch(() =>{
      reject( "no results returned")
    })
  });
};

module.exports.getEmployeesByStatus = function(status){
  return new Promise(function (resolve, reject) { 
    Employee.findAll().then((data) => {
      var emps = []
      for (let i = 0; i < data.length; i++) {
        if (data[i].status == status){
          emps.push(data[i])
        }
      }
      resolve(emps)
    }).catch(() => {
      reject("no results returned");
    })
  });
};
   module.exports.getEmployeesByDepartment = function(department){
    return new Promise(function (resolve, reject) { 
      Employee.findAll().then((data) => {
        var emps = []
        for (let i = 0; i < data.length; i++) {
          if (data[i].department == department){
            emps.push(data[i])
          }
        }
        resolve(emps)
      }).catch(() => {
        reject("no results returned");
      })
    });
  };
  
    module.exports.getEmployeesByManager = function(manager){
      return new Promise(function (resolve, reject) {
        Employee.findAll().then((data) => {
          var emps = []
          for (let i = 0; i < data.length; i++) {
            if (data[i].employeeManagerNum == manager){
              emps.push(data[i])
            }
          }
          resolve(emps)
        }).catch(() => {
          reject("no results returned");
        })
      });
    };

    module.exports.getEmployeeByNum = function(num){
      return new Promise((resolve, reject) => {
        Employee.findAll().then((data) => {
          var emp = []
          for (let i = 0; i < data.length; i++){
            if (data[i].employeeNum == num){
              emp.push(data[i])
            }
          }
          resolve(emp[0])
        }).catch(() => {
          reject("no results returned")
        })
      })
    }

module.exports.getManagers = function () {
  return new Promise(function (resolve, reject) {

  });
};

module.exports.getDepartments = function () {
  return new Promise(function (resolve, reject) {
    Department.findAll().then((data) => {
      resolve(data)
    }).catch(() => {
      reject("no results returned")
    })
  });
};

module.exports.addEmployee = function(employeeData){
  return new Promise(function (resolve, reject) {
    employeeData.isManager = (employeeData.isManager) ? true :false;
    for (const prop in employeeData){
      if (employeeData[prop] == "") {
        employeeData[prop] = null
      }
    }
    Employee.create(employeeData).then(() => {
      resolve()
    }).catch(() => {
      reject("unable to create employee")
    })
  })
}

module.exports.updateEmployee = function(employeeData){
  return new Promise(function (resolve, reject) {
    employeeData.isManager = (employeeData.isManager) ? true :false;
    for (const prop in employeeData){
      if (employeeData[prop] == "") {
        employeeData[prop] = null
      }
    }
    Employee.update(employeeData, {where: {employeeNum: employeeData.employeeNum}}).then(() =>{
      resolve()
    }).catch(() => {
      reject("unable to update employee")
    })
  })
}

module.exports.addDepartment = function(departmentData){
  return new Promise(function (resolve, reject) {
  for (const prop in departmentData){
    if (departmentData[prop] == "") {
      departmentData[prop] = null
    }
  }
  Department.create(departmentData).then(() => {
    resolve()
  }).catch(() => {
    reject("unable to create department")
  })
})
}

module.exports.getDepartmentById = function(id){
  return new Promise(function (resolve, reject) { 
    Department.findAll().then((data) => {
      var dept = []
      for (let i = 0; i < data.length; i++ ){
        if (data[i].departmentId == id){
          dept.push(data[i]);
        }
      }
      resolve(dept[0]);
    }).catch(() => {
      reject("no results returned");
    })
   })
}

module.exports.updateDepartment = function(departmentData){
  return new Promise(function (resolve, reject){
    for (const prop in departmentData){
      if (departmentData[prop] == "") {
        departmentData[prop] = null
      }
    }
    console.log(departmentData)
    Department.update(departmentData, {where: {departmentId: departmentData.departmentId}}).then(() => {
      resolve()
    }).catch(() => {
      reject("unable to update department")
    })
  })
}


module.exports.deleteDepartmentById = function (id){
  return new Promise(function(resolve, reject) {
    Department.destroy({where: {departmentId: id}}).then(() => {
      resolve()
    }).catch(() => {
      reject("unable to delete")
    })
  })
}

module.exports.deleteEmployeeByNum = function (empNum){
  return new Promise(function(resolve,reject) {
    Employee.destroy({where: {employeeNum: empNum}}).then(() => {
      resolve()
    }).catch(() => {
      reject()
    })
  })
}