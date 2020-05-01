// import express package
const express = require('express');

/* import bodyParser which is an Express Middleware
 *   body-parser allows us to make use of the key-value pairs stored on the req-body object
 *   it will be able to access the city name the user typed in on the client side
 */
const bodyParser = require('body-parser');

/* import request package
 *   used to send request to OpenWeatherMap API
 */
const request = require('request');

// create an instance
const app = express();

// key to make request to OpenWeatherMap API
const apiKey = require('./apiKey');

// allows us to access all the static files within the 'public' folder (where are storage the CSS files)
app.use(express.static('public'));

// make use of bodyParser
app.use(bodyParser.urlencoded({ extended: true }));

// use a template engine with EJS (Embedded JavaScript)
app.set('view engine', 'ejs');

// specify the URL and create a response for visitors
app.get('/', function (req, res) {
  // use .render (it will render the view and send the HTML to the client)
  res.render('index', {
    weather: null,
    error: null
  });
});

app.post('/', function (req, res) {
  // get user input
  let city = req.body.city;

  /* URL we should make our requests to:
   *   http://api.openweathermap.org/data/2.5/weather
   *  The URL also has two required query parameters:
   *   the city we’re searching for, and our API Key
   *   ?q=${city}&appid=${apiKey}
   *   query params start with ?
   *   differents query params are separated with &
   *
   *   this API return temperature in Kelvin by default
   *   to use Celsius add query param units=metric
   *   to use Fahrenheit add query param units=imperial
   */
  let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

  /* make a request to the URL
   *  the request returns a callback function with three arguments:
   *   err, response, and body
   */
  request(url, function (err, response, body) {
    if (err) {
      // if the request return error print
      res.render('index', { weather: null, error: 'Error, please try again' });
    } else {
      // print the whole response body
      //console.log('body: ', body);

      // convert the response text into a JSON
      let weather = JSON.parse(body);

      // print the JSON with all the data returned
      //console.log(weather);

      // verify if user typed something that isn´t a city
      if (weather.main == undefined) {
        res.render('index', {
          weather: null,
          error: 'Error, please try again'
        });
      } else {
        /* create the string to be shown in the screen
         *   use: ${} to get a JSON field
         */
        let weatherText = `It's ${weather.main.temp} degrees in ${weather.name}!`;

        // render the HTML and send the generated response string
        res.render('index', { weather: weatherText, error: null });
      }
    }
  });
});

// create a server listening on port 8000 for connections
app.listen(8000, function () {
  console.log('App listening on port 8000!');
});
