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

      const coords = getLatLng(getCity());

      console.log(coords);
    });
  };

  // lets create a function to get the city name

  const getCity = () => {
    let city = "";

    city = $("#search-input").val().trim();

    return city;
  };

  // lets create a function to return the latitude and longitude

  const getLatLng = (cityName) => {
    const city = cityName;

    // lets create the queryURLGeo from the api

    const queryURLGeo = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

    let coords;

    // lets make the ajax call

    $.ajax({
      url: queryURLGeo,
      method: "GET",
      async: false,
    })
      .then((response) => {
        console.log(response.coord);

        if (response.cod === 400) throw new Error();

        coords = response.coord;
      })
      .catch((error) => {
        console.error("Error occurred: ", error);

        $(".form-message").text("Please enter a valid City name ! 😮");
      });

    return coords;
  };

  // lets create a init function here

  const init = () => {
    main();
  };

  // lets invoke init

  init();
});
