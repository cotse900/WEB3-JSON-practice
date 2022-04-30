const { rejects } = require('assert');
var file = require('fs');
const { resolve } = require('path');
var employees = {};
var departments = {};
var exports = module.exports = {};

exports.initialize = function(){
    return new Promise (function(resolve,reject){
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