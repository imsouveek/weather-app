/* Grab form elements */
const weatherForm = document.querySelector('form');
const search = document.querySelector('input');
const p_error = document.querySelector('p#error');
const p_result = document.querySelector('p#result');

/* Handle form submit event */
weatherForm.addEventListener('submit', (event) => {

  /* Prevent old-school page refresh */
  event.preventDefault();

  /* Initialize results fields */
  p_error.textContent = '';
  p_result.innerHTML = 'Loading...';

  /* Grab and validate user input */
  const location = search.value;
  if (!location) {
    p_result.innerHTML = '';
    p_error.textContent = "Error: You must enter a value";
    return;
  }

  /* Fetch API for getting forecast */
  fetch(`/api?address=${encodeURIComponent(location)}`)
  .then((response) => {

    /* Parse response as JSON */
    response.json()
      .then((data) => {

        /* If there is an error, show error. Else show results */
        if (data.error) {
          p_result.innerHTML = '';
          p_error.textContent = `Error: ${data.error}`;
        } else {
          p_error.textContent = '';
          p_result.innerHTML = `Address: ${data.address}<br/><br/>Forecast: ${data.forecast}`
        }
      });
  });
});