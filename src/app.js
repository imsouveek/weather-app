/* Import stuff */
const path = require('path');
const express = require('express');
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

/* Start configuring web server using express */
const app = express();

/* Point server to static directory */
app.use(express.static(path.join(__dirname, '../public')));

/* Set up view engine */
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '../templates/views'));

/* Generic handler for rendering views */
function renderViews(req, res) {

  /* Get view name from request path */
  let viewName = req.path.substring(1);

  /* If no view name found from request path, render index */
  if (!viewName) {
    viewName = "index";
  }

  /* Render */
  res.render(viewName);

}

app.get('/', renderViews);
app.get('/about', renderViews);
app.get('/help', renderViews);

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
  res.render('error', {
    msg: "Not found!"
  });
});

/* Start port */
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
})