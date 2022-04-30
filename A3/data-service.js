const file = require('fs');
var employees = {};
var departments = {};
var exports = module.exports = {};

exports.initialize = () => {
    return new Promise ((resolve,reject) => {
        file.readFile('./data/employees.json','utf8', (err,data) =>{
        if (err) {
            reject('Unable to read data');
        }
        else {
            employees = JSON.parse(data);
        }
    });
    file.readFile('./data/departments.json','utf8', (err,data) =>{
        if (err) {
            reject('Unable to read data');
        }
        else {
            departments = JSON.parse(data);
        }
    });
    resolve();
    })   
};

exports.getAllEmployees = function(){
    return new Promise (function(resolve,reject){
        resolve(employees);
        if (employees.length == 0)
        reject("no results returned");
    });
};

exports.getManagers = function(){
    return new Promise (function(resolve,reject){
        var managers = employees.filter(employees => employees.isManager == true);
        if (employees.length == 0)
        reject("no results returned");
        resolve(managers);
    });
};

exports.getDepartments = function(){
    return new Promise (function(resolve,reject){
        resolve(departments);
        if (departments.length == 0)
        reject("no results returned");
    });
};
//added below
exports.addEmployee = function(employeeData) {
    if(!employeeData.isManager) employeeData.isManager = false;
    else employeeData.isManager = true;
    employeeData.employeeNum = employees.length + 1;
    employees.push(employeeData);
    return new Promise ((resolve,reject) => {
        resolve(employees);
        if (employees.length == 0)
        reject("no results returned");
    })
}
exports.getEmployeesByStatus = function(status) {
    return new Promise ((resolve,reject) => {
        var filtered = employees.filter(employee => employee.status == status);
        resolve(filtered);
        if (filtered.length == 0)
        reject("no results returned");
    })
}
exports.getEmployeesByDepartment = function(department) {
    return new Promise ((resolve,reject) => {
        var filtered = employees.filter(employee => employee.department == department);
        resolve(filtered);
        if (filtered.length == 0)
        reject("no results returned");
    })
}
exports.getEmployeesByManager = function(manager) {
    return new Promise ((resolve,reject) => {
        var filtered = employees.filter(employee => employee.employeeManagerNum == manager);
        resolve(filtered);
        if (filtered.length == 0)
        reject("no results returned");
    })
}
exports.getEmployeesByNum = function(employeeNum) {
    return new Promise ((resolve,reject) => {
        var filtered = employees.filter(employee => employee.employeeNum == employeeNum);
        resolve(filtered);
        if (filtered.length == 0)
        reject("no results returned");
    })
}