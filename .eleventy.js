const format = require('date-fns/format');

module.exports = (eleventyConfig) => {
  eleventyConfig.addFilter('yn', (pct) => (pct ? 'Yes' : 'No'));
  eleventyConfig.addFilter('pct', (pct) => `${Math.ceil(pct)}%`);
  eleventyConfig.addFilter('day', (day) =>
    format(new Date(day * 1000), 'EEE, LLL d')
  );
  eleventyConfig.addFilter('temp', (temp) => `${Math.round(temp)}°`);
  eleventyConfig.addFilter('json', (data) => JSON.stringify(data, null, 2));
  eleventyConfig.addFilter('precipClasses', (d) => {
    const classes = [];
    if (d.snow) classes.push('has-snow');
    if (d.rain) classes.push('has-rain');
    return classes.join(' ');
  });
  eleventyConfig.addFilter('precipStyles', (d) => {
    let pct = 0;

    console.log(d.snow, d.rain);

    if (d.rain) {
      pct = d.rain / 100;
    }

    if (d.snow) {
      pct = d.snow / 100;
    }

    return `--pct: ${pct}`;
  });

  eleventyConfig.addPassthroughCopy('src/styles.css');
  eleventyConfig.addWatchTarget('./src/**/*.css');

  return {
    dir: {
      input: './src',
    },
  };
};
