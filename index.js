//asking for specific node modules and declaring the variables 
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const sqlDbFactory = require("knex");
const process = require("process");
const _ = require("lodash");
const fs = require('fs');
const nodemailer = require('nodemailer');
const config = JSON.parse(fs.readFileSync("./other/data/config.json"));
var path = require('path');

let sqlDb;

function initSqlDB() {
  // Locally we should launch the app with TEST=true to use SQLlite:

      // > set TEST=true

  if (process.env.TEST) {   // for local testing (with sqlite)
    sqlDb = sqlDbFactory({
      client: "sqlite3",    
      debug: true,
      connection: {
        filename: "./other/database.sqlite"
      },
      useNullAsDefault: true
    });
  } else {    // for testing on heroku (with postgres)
    sqlDb = sqlDbFactory({
      debug: true,
      client: "pg", 
      connection: process.env.DATABASE_URL,
      ssl: true
    });
  }
}

// doctors table in the database
function initDoctorDb() {
  return sqlDb.schema.hasTable("doctors").then(exists => {
    if (!exists) {
      sqlDb.schema
        .createTable("doctors", table => {
          table.increments();
          table.string("identifier");
          table.string("name");
          table.string("surname");
          table.string("department");
          table.string("responsibleFor");
          table.string("location");
          table.text("generalData");
        })
        .then(() => {
          return Promise.all(
            _.map(doctorsList, d => {
              delete d.id;
              return sqlDb("doctors").insert(d);
            })
          )
          .then(
            console.log("doctors table created"));
        });
    } else {
      return true;
    }
  });
}

// locations table in the database
function initLocationDb() {
  return sqlDb.schema.hasTable("locations").then(exists => {
    if (!exists) {
      sqlDb.schema
        .createTable("locations", table => {
          table.increments();
          table.string("identifier");
          table.string("name");
          table.string("city");
          table.string("region");
          table.text("description");
          table.string("address");
          table.string("doctors");
          table.string("services");
        })
        .then(() => {
          return Promise.all(
            _.map(locationsList, l => {
              delete l.id;
              return sqlDb("locations").insert(l);
            })
          )
          .then(
            console.log("locations table created"));
        });
    } else {
      return true;
    }
  });
}

// services table in the database 
function initServiceDb() {
  return sqlDb.schema.hasTable("services").then(exists => {
    if (!exists) {
      sqlDb.schema
        .createTable("services", table => {
          table.increments();
          table.string("identifier");
          table.string("name");
          table.text("description");
          table.string("responsible");
          table.string("relateddoctors");
          table.string("locations");
        })
        .then(() => {
          return Promise.all(
            _.map(servicesList, s => {
              delete s.id;
              return sqlDb("services").insert(s);
            })
          )
          .then(
            console.log("services table created"));
        });
    } else {
      return true;
    }
  });
}

// who we are table in the database
function initWhoweareTable() {
  return sqlDb.schema.hasTable("whoweare").then(exists => {
    if (!exists) {
      sqlDb.schema
        .createTable("whoweare", table => {
          table.increments();
          table.text("description");
          table.string("picture");
        })
        .then(() => {
          return Promise.all(
            _.map(whoweareJson, text => {
              return sqlDb("whoweare").insert(text);
            })
          )
          .then(
            console.log("whoweare table created"));
        });
    } else {
      return true;
    }
  });
}




//server port
let serverPort = process.env.PORT || 5000;



var smtpTransport = nodemailer.createTransport({
  service : "gmail",
  "secure" : false,
  "port": 25,
  host: "smtp.gmail.com",
  auth: {
    user: config.user,
    pass: config.password
  },
  tls:{
    rejectUnauthorized: false
  }
});

//entities from Json files
let doctorsList = require("./other/data/doctorsdata.json");
let locationsList = require("./other/data/locationsdata.json");
let servicesList = require("./other/data/servicesdata.json");
let whoweareJson = require("./other/data/whoweare.json");

app.use(express.static(__dirname + "/public"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))


app.get('/',function(req,res){
    res.sendFile('index.html');
});

// email sender with nodemailer
app.get('/send',function(req,res){
    var mailOptions={
      from : '"Centro Diciotto" <centrodiciotto118@gmail.com>',
      username : req.query.username,
      to : req.query.to,
      subject : req.query.subject,
      text : req.query.text
    }
    console.log(mailOptions);

    smtpTransport.sendMail(mailOptions, function(error, response){
     if(error){
        console.log(error);
        res.send("error");
     }
     else{
        console.log("Message sent: " + mailOptions.text);
        console.log("We hope you will contact us again " + mailOptions.username + " !");
        res.send("sent");
        }
  });
});


// Register REST entry point 
app.get("/doctors", function(req, res) {
  let start = parseInt(_.get(req, "query.start", 0));
  // variable for making doctor routing
  let id = _.get(req, "query.identifier", "none");
  // variable for selecting doctors by locations
  let loc = _.get(req, "query.location", "none");
  let limit = parseInt(_.get(req, "query.limit", doctorsList.length));
  let sortby = _.get(req, "query.sort", "none");

  // myQuery is the doctors table
  let myQuery = sqlDb("doctors");

  // analyze sortby query
  if (sortby === "surname") {
    myQuery = myQuery.orderBy("surname", "asc");
  }

  // doctor routing
  if (id !== "none") {
  myQuery = myQuery.where({identifier: id});
  }

  // selecting locations
  if (loc !== "none") {
  myQuery = myQuery.where({location: loc});
  }

  // return result to fetch
  myQuery.offset(start).then(result => {
    res.send(JSON.stringify(result));
  });
});

// Register REST entry point for locations
app.get("/locations", function(req, res) {
  let id = _.get(req, "query.identifier", "none");
  let myQuery = sqlDb("locations");

  if (id !== "none"){
    myQuery = myQuery.where({identifier: id});
  }

  myQuery.then(result => {
    res.send(JSON.stringify(result));
  });
});

// Register REST entry point for services
app.get("/services", function(req, res) {
  let id = _.get(req, "query.identifier", "none");
  let myQuery = sqlDb("services");

  if (id !== "none") {
  myQuery = myQuery.where({identifier: id});
  }
  
  myQuery.then(result => {
    res.send(JSON.stringify(result));
  });
});

// Register REST entry point for whoweare
app.get("/whoweare", function(req, res) {
  let myQuery = sqlDb("whoweare");

  myQuery.then(result => {
    res.send(JSON.stringify(result));
  });
});

app.use(function(req, res) {
  res.status(400);
  res.sendFile(path.join(__dirname + '/public/pages/404.html'));
});

app.set("port", serverPort);

initSqlDB();
initDoctorDb();
initLocationDb();
initServiceDb();
initWhoweareTable();

// Start the server on port 5000 
app.listen(serverPort, function() {
  console.log(`Your app is ready at port ${serverPort}`);
});