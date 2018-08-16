//Retreiving the neccessary imports below
/**
*When installing the application for the first time,
*Open command line and navigate to where you installed this app
*Type the command: npm install
*This will install all the neccessary node modules
*/
// const mysql      = require('mysql'); // Database
const express    = require('express'); // Node framework for app requests
const session    = require('express-session'); // For creating session variables to access admin page
const ejs        = require('ejs'); // JavaScript enabled html pages
const bodyParser = require('body-parser'); // Used for parsing data in html pages
const multer     = require('multer'); // Allows for the transfer of files and imagesfrom html to server
const nodemailer = require('nodemailer'); // Send emails through a bot
// const schedule   = require('node-schedule'); // Schedule the emails to be sent
const path       = require('path'); // For creating a public download page to share between client and server
// const csvParser  = require('csv-parse'); // Parses csv files
// const fs         = require('fs'); // Filereader
// const passHash   = require('password-hash'); // Hashes passwords for safe storage

//variables
var connection;            // MySql Object - Connection to database
var sesh;                  // Session Variable - Admin login session
const DOWNLOAD_FOLDER      = './public/downloads/' // String (download path) - Where to download files

//Defining the settings for the database
const db_config = {
  host: 'localhost',
  port: '3306',
  user: 'root',
  password: 'casa123',
  database: 'CryptoCasa'
};

/*-----------------------------APPLICATION SETUP------------------------------*/

//Setting up the application
var app = express();
app.use(express.static(path.join(__dirname, '/public'))); // public directory
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use(session({secret:'BnB'}));
app.set('view engine', 'ejs'); // Use .ejs files for HTML
var StatusEnum = Object.freeze({"open":1, "closed": 2});

/*Declare how multer will handle downloading .csv files*/
var storage = multer.diskStorage({
  destination:DOWNLOAD_FOLDER,
  filename: function(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
});
var upload = multer({storage:storage});

/*-------------------------------SENDING EMAILS-------------------------------*/

// Mailing bot
var transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'Zebra.mail.bot@gmail.com', // Your email id
    pass: '^.j\"gk)253{j]hCJr&gZ9N\'^Th5Fh3V9/K5gU^7aW64whrn(xwB+TksM)9ZQ'
  }
});

/*------------------------------APP GET REQUESTS------------------------------*/

/**
* Directs the user to the main application page. ~ index.ejs
*/
app.get('/', function(req, res) {
  res.render('pages/rentalView');
});

app.get('/listing', function(req, res) {
  res.render('pages/listingView');
});

/*-----------------------------CONNECTION PROTOCOL----------------------------*/
/**
* Attempts to connect to the database and initialize the tables - Will continue to do this until successful
*/
function handleDisconnect() {
  // Establish database connection
  connection = mysql.createConnection(db_config);
  connection.connect((err) => {
    // if it fails try again every two seconds
    if (err) {
      console.log('Error connecting to db', err);
      setTimeout(handleDisconnect, 2000);
    }
    // On success initialize tables
    console.log('Connected');
    initializeTables();
  });

  // If we run into an error try to re-establish connection
  connection.on('error', function(err) {
    console.log('db error', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      handleDisconnect();
    } else {
      throw err;
    }
  });
}

/**
* Listen to the IP:Port
*/
// app.listen(process.env.PORT);
var server = app.listen(3005, "localhost", function() {
  var host = server.address().address;
  var port = server.address().port;
  console.log("Listening at http://%s:%s", host, port);
});
