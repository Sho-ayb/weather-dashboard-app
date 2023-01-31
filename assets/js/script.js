// lets start with wrapping all our code within a jquery wrapper for the document: ensures that the script will only execute when the document is ready

$(document).ready(function () {
  console.log("Document has loaded");

  // lets use moment to format the date

  const now = moment();

  const todaysDate = now.format("dddd, MMMM D");

  // lets put todays date in to element
  $(".date-text").text(todaysDate);

  // lets create global variables here

  const apiKey = "d0af7ceac9a3501bc47a8577610395a2";

  // we need the element for the unordered list of todays forecast

  const weatherListToday = $(".weather-list-today");

  // we need the element for the unordered list of fourday forecast

  const weatherListFourDay = $(".weather-list-fourday");

  // lets query select the weather item and remove it from the DOM, when the page loads

  const weatherItem = $(".weather-item");

  // the main function gets weather data from the api and displays the card elements on page

  const main = () => {
    // need this variable outside of getCity function to use later in displayWeather function

    let city = "";

    // the event listener on the search form button

    $("#search-button").on("click", function (event) {
      console.log("button clicked");

      event.preventDefault();

      // lets create a function to get the city name from the form input

      const getCity = () => {
        city = $("#search-input").val().trim().toLowerCase();

        return city;
      };

      // lets create a function to return the latitude and longitude

      const getLatLng = () => {
        // lets pass the input value of form input to variable, returned all lowercase
        city = getCity();

        // lets create the queryURLGeo from the api

        const queryURLGeo = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

        // lets make the ajax call

        $.ajax({
          url: queryURLGeo,
          method: "GET",
          dataType: "json",
          contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        })
          .then((response) => {
            // console.log(response.coord);

            if (response.cod === "400") throw new Error();

            return response.coord;
          })
          .then((dataCoords) => {
            console.log(dataCoords);

            // lets use destructure here to extract the lon, lat coords

            const { lon, lat } = dataCoords;

            // now we can use these coords within our openweather query string

            const queryWeatherURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

            console.log(queryWeatherURL);
            // lets make another ajax call inside to fetch the weather

            $.ajax({
              url: queryWeatherURL,
              method: "GET",
              dataType: "json",
              contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            }).then((data) => {
              console.log("Retrieved weather data successfully: ", data);
              // lets pass the data object to a function
              displayTodayWeather(data);
              displayForecast(data);
            });
          })
          .catch((error) => {
            console.error("Error occurred: ", error);

            if (error.status === 404) {
              $(".form-message").text("Please enter a valid City name ! 😮");
            }

            if (error.status === 400) {
              $(".form-message").text("Please enter a City name ! 😮");
            }
          });

        // reset the form message back to empty here

        $(".form-message").text(" ");
      };

      // lets create a separate function here to display the todays forecast in to correct section

      const displayTodayWeather = (data) => {
        $(".weather-list-today").empty();

        // lets extract the weather list array

        let weatherList = data.list;

        console.log("displayWeather function", data);

        // lets destructure the object props from the above array

        const { main, weather, wind } = weatherList[0];

        // lets setup the list item markup on the todays forecast

        // lets create the markup for todays forecast

        const todaysMarkup = `
            
              
          <li class="weather-item">
            <h2 class="days">Today</h2>
            <h3 class="date">
                <span>${moment(weatherList[0].dt_txt).format("D MMMM")}</span>
            </h3>
            <h2 class="city-name" data-city-name="${data.city.name.toLowerCase()}">
            <span>${data.city.name}</span>
            <sup>${data.city.country}</sup>
          </h2>
          <figure>
            <img class="city-icon" src="http://openweathermap.org/img/wn/${
              weather[0].icon
            }@4x.png" alt="${weather[0].description}" />
            <figcaption>${weather[0].description}</figcaption>
          </figure>
          <h3 class="weather-data">
            <span class="city-temp">Temp: ${Math.round(
              main.temp
            )}<sup>&#176;C</sup></span>
            <span class="city-humid">Humid: ${main.humidity}</span>
            <span class="city-wind">Wind: ${Math.round(wind.speed)}</span>
            </h3>
        </li>
        
        `;

        // lets create a list item

        li = todaysMarkup;

        // and append it to the unordered list

        weatherListToday.append(li);
      };

      const displayForecast = (data) => {
        $(".weather-list-fourday").empty();
        // now that we have the five day array forecast, we need to build a list item markup
        // by loop through this array - starting the array @ 1 because we only need the other 4 objects to complete the five day forecast

        const weatherList = data.list;

        console.log(weatherList);

        for (let i = 5; i < weatherList.length; i = i + 10) {
          // lets first destructure the object props we need from the array of objects
          const { main, weather, wind } = weatherList[i];

          console.log("main ", main, "weather ", weather, "wind ", wind);

          const forecastMarkup = `
            
              
          <li class="weather-item">
            <h2 class="days">${moment(weatherList[i].dt_txt).format(
              "dddd"
            )}</h2>
            <h3 class="date">
                <span>${moment(weatherList[i].dt_txt).format("D MMMM")}</span>
            </h3>
            <h2 class="city-name" data-city-name="${data.city.name.toLowerCase()}">
            <span>${data.city.name}</span>
            <sup>${data.city.country}</sup>
          </h2>
          <figure>
            <img class="city-icon" src="http://openweathermap.org/img/wn/${
              weather[0].icon
            }@4x.png" alt="${weather[0].description}" />
            <figcaption>${weather[0].description}</figcaption>
          </figure>
          <h3 class="weather-data">
            <span class="city-temp">Temp: ${Math.round(
              main.temp
            )}<sup>&#176;C</sup></span>
            <span class="city-humid">Humid: ${main.humidity}</span>
            <span class="city-wind">Wind: ${Math.round(wind.speed)}</span>
            </h3>
        </li>
        
        `;

          // lets create the list items

          const li = forecastMarkup;

          // and append it to the unordered list

          weatherListFourDay.append(li);
        }
      };

      // lets invoke functions here in main()
      getLatLng();
    });
  };

  // lets create a function to clear the html list items

  const clearWeatherCards = () => {
    weatherItem.remove();
  };

  // lets create a init function here

  const init = () => {
    clearWeatherCards();
    main();
  };

  // lets invoke init to run our application

  init();
});
