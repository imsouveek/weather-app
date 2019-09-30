/*
  API call to get latitude and longitude from any geocoding service. System expects address
  and callback as input
*/
const request = require('request');

module.exports = (address, callback) => {

  /* Mapbox API */
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=pk.eyJ1IjoiaW1zb3V2ZWVrIiwiYSI6ImNrMGtvb29uaTBscTYzbnN2OHZ1NXE4enMifQ.APmFo0DiFELkbx5q4uWBjw&limit=1`;

  request ({
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
      callback('Could not connect to geo coding api', undefined);
    } else if (body.features.length ==0 ) {

      /* Scenario 2: API did not return addresses / returned error */
      callback('Could not find location', undefined);
    } else {

      /* Scenario 3: API call successful and results found */
      const location = body.features[0];
      callback(undefined, {
        latitude: location.center[1],
        longitude: location.center[0],
        place_name: location.place_name
      })
    }
  })
};