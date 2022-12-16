const format = require('date-fns/format');

module.exports = (eleventyConfig) => {
  eleventyConfig.addFilter('yn', (pct) => (pct ? 'Yes' : 'No'));
  eleventyConfig.addFilter('day', (day) =>
    format(new Date(day * 1000), 'EEE, L/d')
  );
  eleventyConfig.addFilter('json', (data) => JSON.stringify(data, null, 2));
  eleventyConfig.addFilter('precipClasses', (d) => {
    const classes = [];
    if (d.snow) classes.push('has-snow');
    if (d.rain) classes.push('has-rain');
    return classes.join(' ');
  });
  eleventyConfig.addFilter('precipStyles', (d) => {
    let pct = 0;

    if (d.rain) {
      pct = (d.rain + 3) / 30;
    }

    if (d.snow) {
      pct = (d.snow + 3) / 30;
    }

    return `--pct: ${pct}`;
  });
  eleventyConfig.addFilter('roud', (value) => Math.round(value));

  eleventyConfig.addPassthroughCopy('src/styles.css');
  eleventyConfig.addWatchTarget('./src/**/*.css');

  return {
    dir: {
      input: './src',
    },
  };
};
