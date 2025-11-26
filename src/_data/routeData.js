import Fetch from '@11ty/eleventy-fetch';
import routes from './routes.json' with { type: 'json' };

import 'dotenv/config'

const { OPENWEATHER_APIKEY } = process.env;

const routeData = routes.map((r) => {
  if (!OPENWEATHER_APIKEY) return r;

  const stopsForecast = Promise.all(
    r.stops.map(async (s) => {
      try {
        const forecast = await Fetch(
          `https://api.openweathermap.org/data/3.0/onecall?lat=${s.lat}&lon=${s.lon}&units=imperial&exclude=current,minutely&appid=${OPENWEATHER_APIKEY}`,
          {
            duration: '1d',
            type: 'json',
          }
        );

        return {
          ...s,
          data: forecast,
        };
      } catch (e) {
        console.error(e);
        return s;
      }
    })
  );

  return {
    name: r.name,
    stops: stopsForecast,
  };
});

export default routeData;
