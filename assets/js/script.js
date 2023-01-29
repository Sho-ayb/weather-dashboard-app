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
          async: false,
        })
          .then((response) => {
            console.log(response.coord);

            if (response.cod === 400) throw new Error();
          })
          .catch((error) => {
            console.error("Error occurred: ", error);

            $(".form-message").text("Please enter a valid City name ! 😮");
          });
      };

      // lets invoke the above function here

      getLatLng();
    });
  };

  // lets create a init function here

  const init = () => {
    main();
  };

  // lets invoke init

  init();
});
