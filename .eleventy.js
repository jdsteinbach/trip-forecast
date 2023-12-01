const format = require('date-fns/format');
const addDays = require('date-fns/addDays');
var isSameDay = require('date-fns/isSameDay');
var setHours = require('date-fns/setHours');
var setMinutes = require('date-fns/setMinutes');
const Compass = require('cardinal-direction');

module.exports = (eleventyConfig) => {
  eleventyConfig.addFilter('json', (obj) => JSON.stringify(obj, null, 2));
  eleventyConfig.addFilter('yn', (pct) => (pct ? 'Yes' : 'No'));
  eleventyConfig.addFilter('day', (date) => {
    const d = new Date(date * 1000);
    try {
      return format(d, 'EEE, L/d');
    } catch (e) {
      console.log({ date, dayError: e });
      return 'oops';
    }
  });
  eleventyConfig.addFilter('weekday', (date) =>
    format(new Date(date * 1000), 'EEE')
  );
  eleventyConfig.addFilter('time', (date) =>
    format(new Date(date * 1000), "haaaaa'm'")
  );

  eleventyConfig.addFilter('datetime', (date) => {
    const d = new Date(date * 1000);
    return d.toISOString();
  });
  eleventyConfig.addFilter('hourlydays', (array) => {
    return array
      .map((h) => format(new Date(h.dt * 1000), 'EEE, L/d'))
      .reduce((acc, i) => {
        if (!acc.includes(i)) {
          acc.push(i);
        }
        return acc;
      }, []);
  });
  eleventyConfig.addFilter('todayAlerts', (alerts, currentDay) => {
    const currentDate = new Date(currentDay * 1000);
    const possibleAlerts = alerts
      ? alerts.filter(({ start, end }) => {
          const startDate = new Date(start * 1000);
          const endDate = new Date(end * 1000);

          return (
            isSameDay(startDate, currentDate) || isSameDay(endDate, currentDate)
          );
        })
      : [];
    return possibleAlerts.length > 0 ? possibleAlerts : false;
  });
  eleventyConfig.addFilter('alertDays', (alert) => {
    const { start, end } = alert;
    const startDate = setMinutes(setHours(new Date(start * 1000), 0), 1);
    const endDate = setMinutes(setHours(new Date(end * 1000), 23), 59);
    let dates = [];

    for (i = startDate; i <= endDate; i = addDays(i, 1)) {
      dates.push(i);
    }
    return dates.map((d) => format(d, 'EEE, L/d'));
  });
  eleventyConfig.addFilter('lastDay', (array) => {
    const last = array[array.length - 1];
    return format(last.dt, 'EEE, L/d');
  });
  eleventyConfig.addFilter('camelcase', (string) =>
    string
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (ltr, idx) =>
        idx === 0 ? ltr.toLowerCase() : ltr.toUpperCase()
      )
      .replace(/\s+/g, '')
  );
  eleventyConfig.addFilter('concat', (strings) => strings.join(', '));
  eleventyConfig.addFilter('pct', (value) => `${value * 100}%`);
  eleventyConfig.addFilter('precipClasses', (d) => {
    const classes = [];
    if (d.snow || d.weather[0].main === 'Snow') classes.push('has-snow');
    if (d.rain || d.weather[0].main === 'Rain') classes.push('has-rain');
    return classes.join(' ');
  });
  eleventyConfig.addFilter('precipStyles', (d) => {
    let pct = 0;
    let rain = d.rain && d.rain['1h'] ? d.rain['1h'] : d.rain;
    let snow = d.snow && d.snow['1h'] ? d.snow['1h'] : d.snow;

    if (rain) {
      pct = (rain + 3) / 44;
    }

    if (snow) {
      pct = (snow + 3) / 23;
    }

    return `--pct: ${pct}`;
  });
  eleventyConfig.addFilter('round', (value) => Math.round(value));
  eleventyConfig.addFilter(
    'roundMM',
    (value) => Math.round(value / 0.254) / 100
  );
  eleventyConfig.addFilter('degrees', (deg) => {
    const fromDeg = Math.abs(180 - deg);
    return Compass.cardinalFromDegree(fromDeg, Compass.CardinalSubset.Ordinal);
  });

  eleventyConfig.addPassthroughCopy('src/styles.css');
  eleventyConfig.addWatchTarget('./src/**/*.css');

  return {
    dir: {
      input: './src',
    },
  };
};
