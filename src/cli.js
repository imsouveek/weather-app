/* Import stuff */
const yargs = require('yargs');
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

/* Setup yargs command */
/* FYI complete waste of time to pull just one extra arg using yargs */
yargs.command(require('./utils/commands'));

/* Enable strict mode, so no extra parameters */
yargs.strict();

/* Disable exit process, node process does not exit */
yargs.exitProcess(false);

try {

  /*
    Parse inputs and call getForecast inside try block. This ensures that
    parse() raises expections that can be caught and handled
  */
  yargs.parse();
  const argv = yargs.argv;

  if (argv.location) {
    getForecast(argv.location);
  }
} catch (err) {
  console.log('Failed to process inputs');
}

function getForecast(location) {
  /* Processing for geo-coding and forecast */
  geocode(location, (error, data) => {
    if (error) {
      return console.log(`Error: ${error}`);
    }

    /* Geo coding successful. Process to forecasting */
    forecast(data, (error, forecast_data)=> {
      if (error) {
        return console.log(`Error: ${error}`);
      }

      /* Forecasting also successful. Provide response */
      console.log(`Address: ${data.place_name}`);
      console.log(`Forecast: ${forecast_data}`);
      return;
    });
  });
}
