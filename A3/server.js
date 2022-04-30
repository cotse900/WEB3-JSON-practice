/*********************************************************************************
*  WEB322 – Assignment 03
*  I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part 
*  of this assignment has been copied manually or electronically from any other source
*  (including 3rd web sites) or distributed to other students.
* 
*  Name: Chungon Tse Student ID: 154928188 Date: 17 Feb 2022
*
*  Online (Heroku) Link: https://floating-shelf-89513.herokuapp.com/
*
********************************************************************************/
const HTTP_PORT = process.env.PORT || 8080;
const express = require("express");
const fs = require("fs");
const app = express();
const multer = require("multer");
const path = require("path");
const dataService = require('./data-service.js');
const bodyParser = require("body-parser");

const storage = multer.diskStorage({
    destination: "./public/images/uploaded",
    filename: function (req, file, cb){
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
var upload = multer({storage: storage});

onHttpStart = () => {
    console.log('Express http server listening on port ' + HTTP_PORT);
};

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

app.get("/", (req,res) => {
    res.sendFile(path.join(__dirname + "/views/home.html"));
});
app.get('/home', (req,res) => {
    res.sendFile(path.join(__dirname + "/views/home.html"));
});
app.get("/about", (req,res) => {
    res.sendFile(path.join(__dirname + "/views/about.html"));
});
app.get("/employees/add", (req,res) => {
    res.sendFile(path.join(__dirname + "/views/addEmployee.html"));
});
app.get("/images/add", (req,res) => {
    res.sendFile(path.join(__dirname + "/views/addImage.html"));
});
app.get("/employee/:employeeNum", (req,res) => {
    dataService.getEmployeesByNum(req.params.employeeNum)
    .then((data) =>{
        res.json(data);
    }).catch((err) =>{
        res.json({message: err});
    })
});
//employee funcs
app.get("/employees", (req,res) => {
    if (req.query.status){
        dataService.getEmployeesByStatus(req.query.status)
        .then((data) => res.json(data))
        .catch((err) => res.json({message: err}))
    }
    else if (req.query.department){
        dataService.getEmployeesByDepartment(req.query.department)
        .then((data) => res.json(data))
        .catch((err) => res.json({message: err}))
    }
    else if (req.query.manager){
        dataService.getEmployeesByManager(req.query.manager)
        .then((data) => res.json(data))
        .catch((err) => res.json({message: err}))
    }
    else {
        dataService.getAllEmployees()
        .then((data) => res.json(data))
        .catch((err) => res.json({message: err}))
    }
});
app.post("/employees/add", (req,res) => {
    dataService.addEmployee(req.body)
    .then(res.redirect('/employees'))
    .catch((err) => res.json({message: err}))
});
//image funcs
app.post("/images/add", upload.single("imageFile"), (req,res) => {
    res.redirect("/images");
});
app.get("/images", (req,res) => {
    fs.readdir("./public/images/uploaded", function(err, imageFile) {
        if (err){
            return console.log("Unable to load images" + err);
        }
        res.json({images: imageFile});
    })
});
//manager func
app.get("/managers", (req,res) => {
    dataService.getManagers().then((data) => {
        res.json({data});
    }).catch((err) => {
        res.json({message: err});
    })
});
//dept func
app.get("/departments", (req,res) => {
    dataService.getDepartments().then((data) => {
        res.json({data});
    }).catch((err) => {
        res.json({message: err});
    })
});

app.get('*', (req, res) => {
    res.status(404).send("Page Not Found");
    res.redirect("https://miro.medium.com/max/1400/1*BY3XOmM2egjm3LIfRjqZiw.png");
});

dataService.initialize().then((data) =>{
    app.listen(HTTP_PORT, onHttpStart());    
}).catch(() => {
    console.log("There was an error with initializing.");
});