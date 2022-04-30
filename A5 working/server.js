var express = require("express");
var app = express();
let path = require("path");
var dataService = require("./data-service.js");
const multer = require("multer");
const exphbs = require("express-handlebars");
const req = require("express/lib/request");
const fs = require("fs");
const bodyParser = require("body-parser");

const storage = multer.diskStorage({
  destination: "./public/images/uploaded",
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

app.engine(
  ".hbs",
  exphbs.engine({
    extname: ".hbs",
    defaultLayout: "main",
    helpers: {
      navLink: function (url, options) {
        return (
          "<li" +
          (url == app.locals.activeRoute ? ' class="active" ' : "") +
          '><a href="' +
          url +
          '">' +
          options.fn(this) +
          "</a></li>"
        );
      },
      equal: function (lvalue, rvalue, options) {
        if (arguments.length < 3)
          throw new Error("Handlebars Helper equal needs 2 parameters");
        if (lvalue != rvalue) {
          return options.inverse(this);
        } else {
          return options.fn(this);
        }
      },
    },
  })
);
app.set("view engine", ".hbs");

var HTTP_PORT = process.env.PORT || 8080;

function onHttpStarts() {
  console.log("Express http server listening on " + HTTP_PORT);
}
app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(function (req, res, next) {
  let route = req.baseUrl + req.path;
  app.locals.activeRoute = route == "/" ? "/" : route.replace(/\/$/, "");
  next();
});

app.get("/", function (req, res) {
  res.render("home.hbs");
});

app.get('/home', (req, res) => {
  res.render(path.join(__dirname + "/views/home.hbs"));
});

app.get("/about", function (req, res) {
  res.render("about.hbs");
});

app.get("/images/add", (req,res) => {
  res.render(path.join(__dirname + "/views/addImage.hbs"));
});
app.post("/images/add", upload.single("imageFile"), (req,res) => {
  res.redirect("/images");
});
app.get("/images", (req,res) => {
  fs.readdir("./public/images/uploaded", function(err, imageFile) {
      res.render("images", { data: imageFile, title: "Images"});
  })
});

app.post("/employees/add", (req, res) => {
  dataService.addEmployee(req.body).then(() => {
    res.redirect("/employees");
  }).catch((err)=>{       res.status(500).send("Unable to Update Employee"); }); ;
});

app.post("/departments/add", (req, res) => {
  dataService.addDepartment(req.body).then(() => {
    res.redirect("/departments");
  }).catch((err)=>{       
    res.status(500).send("Unable to Update Employee"); }); ;
});

app.post("/employee/update", (req, res) => {
  dataService.updateEmployee(req.body).then(() => {
    res.redirect("/employees");
  }).catch((err)=>{       
    res.status(500).send("Unable to Update Employee"); }); ;
});

app.post("/department/update", (req, res) => {
  dataService.updateDepartment(req.body).then(() => {
    res.redirect("/departments");
  }).catch((err) => {
    res.status(500).send("Unable to Update Department"); 
  });
});



app.get("/employees/add", function (req, res) {
  dataService.getDepartments().then((data) => {
    res.render("addEmployee", {departments : data});
  }).catch(() => {
    res.render("addEmployee", {departments : []});
  })
  
});

app.get("/departments/add", function (req, res) {
  res.render("addDepartment.hbs");
});



app.get("/employees", function (req, res) {
  if (req.query.status) {
    dataService
      .getEmployeesByStatus(req.query.status)
      .then((data) => {
        if (data.length > 0){
        res.render("employees", { employees: data });
        }
        else{
          res.render("employees", { message: "no results" });
        }
      })
      .catch((err) => {
        res.render("employees", { message: "no results" });
      });
  } else if (req.query.department) {
    dataService
      .getEmployeesByDepartment(req.query.department)
      .then((data) => {
        if (data.length > 0){
        res.render("employees", { employees: data });
        }
        else{
          res.render("employees", { message: "no results" });
        }
      })
      .catch((err) => {
        res.render("employees", { message: "no results" });
      });
  } else if (req.query.manager) {
    dataService
      .getEmployeesByStatus(req.query.manager)
      .then((data) => {
        if (data.length > 0){
        res.render("employees", { employees: data });
        }
        else{
          res.render("employees", { message: "no results" });
        }
      })
      .catch((err) => {
        res.render("employees", { message: "no results" });
      });
  } else {
    dataService
      .getAllEmployees()
      .then((data) => {
        if (data.length > 0){
        res.render("employees", { employees: data });
        }
        else{
          res.render("employees", { message: "no results" });
        }
      })
      .catch((err) => {
        res.render("employees", { message: "no results" });
      });
  }
});

app.get("/employee/:empNum", (req, res) => {      
  // initialize an empty object to store the values     
  let viewData = {};      
  dataService.getEmployeeByNum(req.params.empNum).then((data) => {         
    if (data) {             
      viewData.employee = data; //store employee data in the "viewData" object as "employee"         
    } else {             
      viewData.employee = null; // set employee to null if none were returned         
    }     
  }).catch(() => {         
    viewData.employee = null; // set employee to null if there was an error      
  }).then(dataService.getDepartments)     
  .then((data) => {         
    viewData.departments = data; // store department data in the "viewData" object as "departments"          
    // loop through viewData.departments and once we have found the departmentId that matches         
    // the employee's "department" value, add a "selected" property to the matching         
   // viewData.departments object          
   for (let i = 0; i < viewData.departments.length; i++) {             
     if (viewData.departments[i].departmentId == viewData.employee.department) {                 
       viewData.departments[i].selected = true;             
      }         
    }      
  }).catch(() => {         
    viewData.departments = []; // set departments to empty if there was an error     
  }).then(() => {         
    if (viewData.employee == null) { // if no employee - return an error             
      res.status(404).send("Employee Not Found");         
    } else {      
      console.log(viewData)       
      res.render("employee", { viewData: viewData }); // render the "employee" view         
    }     
  }).catch((err)=>{       
    res.status(500).send("Unable to Update Employee"); 
  }); 
}); 


app.get("/departments", function (req, res) {
  dataService
    .getDepartments()
    .then((data) => {
      if (data.length > 0){
      res.render("departments", { departments: data });
      }
      else {
        res.render("departments", { message: "no results" });
      }
    })
    .catch((err) => {
      res.json(err);
    });
});

app.get("/department/:departmentId", function (req, res) {
  dataService.getDepartmentById(req.params.departmentId).then((data) => {
      if (data != undefined){
        res.render("department", { department: data });
      }
      else{
        res.status(404).send("Department Not Found")
      }
      
    })
    .catch((err) => {
      res.render("department", { message: err });
    });
});

app.get("/departments/delete/:departmentId", function (req, res) {
  dataService.deleteDepartmentById(req.params.departmentId).then(() => {
     res.redirect("/departments") 
    })
    .catch((err) => {
      res.status(500).send("Unable to Remove Department / Department not found")
    });
});

app.get("/employees/delete/:empNum", function (req, res) {
  dataService.deleteEmployeeByNum(req.params.empNum).then(() => {
     res.redirect("/employees") 
    })
    .catch((err) => {
      res.status(500).send("Unable to Remove Employee / Employee not found")
    });
});

app.use((req, res) => {
  res.status(404).send("Page Not Found");
});

dataService
  .initialize()
  .then(() => {
    app.listen(HTTP_PORT, onHttpStarts);
  })
  .catch((err) => {
    console.log(err);
  });


