/* Import stuff */
const path = require('path');
const express = require('express');
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

/* Start configuring web server using express */
const app = express();

/* Check for Production */
const isProd = process.env.NODE_ENV === 'production';

/* Dev specific setup */
if (!isProd) {

  /* Setup a development server with webpack configuraiton */
  const  webpack = require('webpack');
  const config = require('../../config/webpack.dev');
  const compiler = webpack(config);

  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackDevMw = webpackDevMiddleware(compiler, config.devServer);
  app.use(webpackDevMw);

  /* Need to lookup files from memory (used by dev middleware to send files) */
  var memoryFs = webpackDevMw.fileSystem;

  /* Setup hot reloading */
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const webpackHotMw = webpackHotMiddleware(compiler);
  app.use(webpackHotMw);
}

/* Point server to static directory */
app.use(express.static(path.join(__dirname, '../dist')));

/* API service to chain forecast and geocode functions */
app.get('/api', (req, res) => {

  /* Check for address as query string */
  if (!req.query.address) {
    res.send({
      error: "No Address specified"
    });
    return;
  }

  /* Processing for geo-coding and forecast */
  geocode(req.query.address, (error, data) => {
    if (error) {
      return res.send({ error });
    }

    /* Geo coding successful. Process to forecasting */
    forecast(data, (error, forecast_data)=> {
      if (error) {
        return res.send({ error });
      }

      /* Forecasting also successful. Provide response */
      res.send({
        address: data.place_name,
        forecast: forecast_data
      });
    });
  });
});

/* Handler for undefined paths */
app.get('*', (req, res) => {
  if (!isProd){ 
    res.status(404).send(memoryFs.readFileSync(path.resolve(__dirname, '../../dist/error.html'), 'utf8'))
  } else {
    res.sendFile(path.join(__dirname, '../../dist/error.html'))
  }
});

/* Start port */
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
})