const axios = require('axios').default;
const routes = require('./routes.json');

require('dotenv').config();

const { OPENWEATHER_APIKEY } = process.env;

const routeData = routes.map((r) => {
  if (!OPENWEATHER_APIKEY) return r;

  const stopsForecast = Promise.all(
    r.stops.map(async (s) => {
      const forecast = await axios
        .get(
          `https://api.openweathermap.org/data/3.0/onecall?lat=${s.lat}&lon=${s.lon}&units=imperial&appid=${OPENWEATHER_APIKEY}`
        )
        .then(({ data }) => {
          return {
            ...s,
            data,
          };
        })
        .catch((e) => {
          console.error(e);
          throw new Error(e);
        });
      return forecast;
    })
  );

  return {
    name: r.name,
    stops: stopsForecast,
  };
});

module.exports = routeData;
