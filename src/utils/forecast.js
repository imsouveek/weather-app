/*
  API call to get weather forecast from any weather service. System expects latitude and longitude
  and callback as input
*/
const request = require('request');
const { round } = require('mathjs');

module.exports = ({latitude, longitude}, callback) => {

  /* DarkSky API */
  const url = `https://api.darksky.net/forecast/69ece29d50189320473421dec99150d0/${encodeURIComponent(latitude)},${encodeURIComponent(longitude)}?units=si`;

  request({
    url,
    json: true
  }, (error, response, body) => {

    /*
      Three possible outcomes for API call:-
        1. API not invoked / did not respond successfully
        2. API did not return addresses / returned error
        3. API call successful and results found
    */
    if (error) {

      /* Scenario 1: API not invoked / did not respond successfully */
      callback("Unable to connect to weather service", undefined);
    } else if (body.error) {

      /* Scenario 2: API did not return addresses / returned error */
      callback(body.error, undefined);
    } else {

      /* Scenario 3: API call successful and results found */
      callback(undefined, `It is currently ${body.currently.temperature} degrees out. There is a ${round(body.currently.precipProbability * 100, 2)}% chance of rain`);
    }
  });
}
