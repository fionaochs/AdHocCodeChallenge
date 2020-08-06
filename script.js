const csv = require('csvtojson');

var silverPlans = {};
var zip_to_rate_areas = {};

csv()
  .fromFile('./test.csv')
  .then((json) => {
    json.filter(row => row.metal_level === 'Silver').forEach(row => {
      if(silverPlans[row.rate_area]) {
        silverPlans[row.rate_area] = silverPlans[row.rate_area].concat(row.rate);
      } else {
        silverPlans[row.rate_area] = [row.rate];
      }
    });
  })
  .then(() => {
    csv().fromFile('./zips.csv').then((json) => {
      json.forEach(row => {
        if(zip_to_rate_areas[row.zipcode]) {
          zip_to_rate_areas[row.zipcode].add(row.rate_area);
        } else {
          zip_to_rate_areas[row.zipcode] = new Set();
          zip_to_rate_areas[row.zipcode].add(row.rate_area);
        }
      });
      console.log('zip to rate area: ', Object.entries(zip_to_rate_areas).filter(row => row[1].size > 1));

      // leaving off ambiguous ...

    }).then(() => {
      // final scan where we output the rows of zip, second lowest rate
    });
  });
