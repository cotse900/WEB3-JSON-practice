/*********************************************************************************
*  WEB322 – Assignment 04
*  I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part 
*  of this assignment has been copied manually or electronically from any other source
*  (including 3rd web sites) or distributed to other students.
* 
*  Name: Chungon Tse Student ID: 154928188 Date: 3 MAR 2022
*
*  Online (Heroku) Link: https://peaceful-journey-75427.herokuapp.com/
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
const exphbs = require("express-handlebars");
//multer
const storage = multer.diskStorage({
    destination: "./public/images/uploaded",
    filename: function (req, file, cb){
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
var upload = multer({storage: storage});
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
//hbs
app.engine('.hbs', exphbs.engine({
    extname: '.hbs',
    defaultLayout: 'main',
    helpers: {
        navLink: function(url, options){
            return '<li' + ((url == app.locals.activeRoute) ? ' class="active" ' : '')
            +'><a href="' + url + '">' + options.fn(this) + '</a></li>';
        },
        equal: function (lvalue, rvalue, options) {
            if (arguments.length < 3)
            throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
            return options.inverse(this);
            } else {
            return options.fn(this);
            }
        }
    }
}));
app.set('view engine', '.hbs');
app.use(function(req,res,next){
    let route = req.baseUrl + req.path;
    app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
    next();
    });
onHttpStart = () => {
    console.log('Express http server listening on port ' + HTTP_PORT);
};
//routes
app.get("/", (req,res) => {
    res.render(path.join(__dirname + "/views/home.hbs"));
});
app.get('/home', (req,res) => {
    res.render(path.join(__dirname + "/views/home.hbs"));
});
app.get("/about", (req,res) => {
    res.render(path.join(__dirname + "/views/about.hbs"));
});
app.get("/employees/add", (req,res) => {
    res.render(path.join(__dirname + "/views/addEmployee.hbs"));
});
app.get("/images/add", (req,res) => {
    res.render(path.join(__dirname + "/views/addImage.hbs"));
});
app.get("/employee/:employeeNum", (req,res) => {
    dataService.getEmployeesByNum(req.params.employeeNum)
    .then((data) =>{
        res.render("employee",{employee: data});
    }).catch(() =>{
        res.render("employee",{message: "no results"});
    })
});
//employee funcs
app.get("/employees", (req,res) => {
    if (req.query.status){
        dataService.getEmployeesByStatus(req.query.status)
        .then((data) => res.render("employees",{employees:data}))
        .catch(() => req.render("employees",{message: "no results"}))
    }
    else if (req.query.department){
        dataService.getEmployeesByDepartment(req.query.department)
        .then((data) => res.render("employees",{employees:data}))
        .catch(() => req.render("employees",{message: "no results"}))
    }
    else if (req.query.manager){
        dataService.getEmployeesByManager(req.query.manager)
        .then((data) => res.render("employees",{employees:data}))
        .catch(() => req.render("employees",{message: "no results"}))
    }
    else {
        dataService.getAllEmployees()
        .then((data) => res.render("employees",{employees:data}))
        .catch(() => req.render("employees",{message: "no results"}))
    }
});
app.post("/employees/add", (req,res) => {
    dataService.addEmployee(req.body)
    .then(() => {res.redirect("/employees")}
    );
});
app.post("/employee/update", (req, res) => {
    dataService.updateEmployee(req.body)
    .then(() => {res.redirect("/employees")}
    );
});
//image funcs
app.post("/images/add", upload.single("imageFile"), (req,res) => {
    res.redirect("/images");
});
app.get("/images", (req,res) => {
    fs.readdir("./public/images/uploaded", function(err, imageFile) {
        //res.render({images: imageFile});
        res.render("images", { data: imageFile, title: "Images"});
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
        res.render("departments",{departments:data});
    }).catch(() => {
        res.render("departments",{message: "no results"});
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