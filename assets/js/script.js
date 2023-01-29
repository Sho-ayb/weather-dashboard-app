// lets start with wrapping all our code within a jquery wrapper for the document: ensures that the script will only execute when the document is ready

$(document).ready(function () {
  console.log("Document has loaded");

  // lets create global variables here

  const apiKey = "d0af7ceac9a3501bc47a8577610395a2";

  // lets create a function to listen to the form event

  const main = () => {
    $("#search-button").on("click", function (event) {
      console.log("button clicked");

      event.preventDefault();

      // lets create a function to get the city name

      const getCity = () => {
        let city = "";

        city = $("#search-input").val().trim();

        return city;
      };

      // lets create a function to return the latitude and longitude

      const getLatLng = () => {
        const city = getCity();

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

            if (response.cod === 400) throw new Error();

            return response.coord;
          })
          .then((dataCoords) => {
            console.log(dataCoords);

            // lets use destructure here to extract the lon, lat coords

            const { lon, lat } = dataCoords;

            // now we can use these coords within our openweather query string

            const queryWeatherURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;

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
              displayWeather(data);
            });
          })
          .catch((error) => {
            console.error("Error occurred: ", error);

            $(".form-message").text("Please enter a valid City name ! 😮");
          });
      };

      const displayWeather = (weather) => {
        // lets create an empty array , where we will store a five day weather data

        let fiveDayArr = [];

        // lets extract the weather list array

        let weatherList = weather.list;

        console.log(weatherList);

        // lets loop through this array and only return every 8th array
        for (let i = 0; i < weatherList.length; i = i + 8) {
          fiveDayArr.push(weatherList[i]);
        }

        console.log(fiveDayArr);
      };

      // lets invoke functions here

      getLatLng();
      displayWeather();
    });
  };

  // lets create a init function here

  const init = () => {
    main();
  };

  // lets invoke init

  init();
});
