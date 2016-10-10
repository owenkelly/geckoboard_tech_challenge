require('dotenv').config();
var API_KEY = process.env.API_KEY;
var gb = require('geckoboard')(API_KEY);

gb.ping(function (error){
  if (error) {
    console.log(error);
    return;
  }

  console.log("Authentication Sucessful");
});