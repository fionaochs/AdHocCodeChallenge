const csv = require('csvtojson');
const createCsvWriter = require('csv-writer').createArrayCsvWriter;
const { silverPlansFunction } = require('./silverPlans');

let silverPlans = {};
let zip_to_rate_areas = {};
let zip_to_second_silver = [];

csv()
  // find plans that are silver
  // take rate area and return rate
  .fromFile('./plans.csv')
  .then((json) => {
    json
      .filter(row => row.metal_level === 'Silver')
      .forEach(row => {
        // console.log(row);
        silverPlans = silverPlansFunction(silverPlans, row);
        // console.log(silverPlansFunction(row), 'main');
        // if(silverPlans[row.rate_area] && silverPlans[row.rate_area].length > 1) {
        //   if(row.rate < silverPlans[row.rate_area][0]){
        //     silverPlans[row.rate_area] = 
        //       [row.rate].concat(silverPlans[row.rate_area][0]);
        //   }
        //   if(row.rate !== silverPlans[row.rate_area][0] && row.rate < silverPlans[row.rate_area][1]){
        //     silverPlans[row.rate_area] = 
        //       [silverPlans[row.rate_area][0]].concat(row.rate);
        //   }
        // } 
        // // assuming all rates for rate area are unique
        // else if(silverPlans[row.rate_area] && silverPlans[row.rate_area].length === 1){
        //   if(row.rate < silverPlans[row.rate_area][0]){
        //     silverPlans[row.rate_area] = 
        //       [row.rate].concat(silverPlans[row.rate_area][0]);
        //   }
        //   else if(row.rate > silverPlans[row.rate_area][0]){
        //     silverPlans[row.rate_area] = 
        //       [silverPlans[row.rate_area][0]].concat(row.rate);
        //   }
        // }
        // else {
        //   silverPlans[row.rate_area] = [row.rate];
        // }
        console.log(silverPlans);
      })
      .catch((err) => {
        console.log(err);
      });
  })
  // take zipcode and find rate area
  .then(() => {
    csv()
      .fromFile('./zips.csv')
      .then((json) => {
        json.forEach(row => {
          if(zip_to_rate_areas[row.zipcode]) {
            zip_to_rate_areas[row.zipcode].add(row.rate_area);
          } else {
            zip_to_rate_areas[row.zipcode] = new Set();
            zip_to_rate_areas[row.zipcode].add(row.rate_area);
          }
        });
        Object.entries(zip_to_rate_areas)
          .filter(row => row[1].size <= 1);
        // only return zipcode with one rate, leaving off ambiguous..

      // take zipcode and find rate
      }).then(() => {
        csv()
          .fromFile('./slcsp.csv') // zipcode, need rate
          .then((json) => {
            json.forEach((row) => { 
              // take zipcode => rate area => rate
              const key_rate_area = zip_to_rate_areas[row.zipcode];
              if(key_rate_area.size === 1){
                const rate_area = Array.from(key_rate_area)[0];
                const smallest_silver_rates = silverPlans[rate_area];
                if(smallest_silver_rates.length === 0){
                  console.log('small', smallest_silver_rates);
                }
                zip_to_second_silver = zip_to_second_silver.concat([[row.zipcode, smallest_silver_rates[1]]]);
              }

              else if(key_rate_area.size > 1){
                // console.log(key_rate_area, row.zipcode);
                zip_to_second_silver = zip_to_second_silver.concat([[row.zipcode]]);
                console.log('2', zip_to_second_silver);
                // 40813,.
              }

            });
          })
          // add errror reject 
          .then(() => {
            const csvWriter = createCsvWriter({
              header: ['zipcode', 'rate'],
              path: './output.csv'
            });
            csvWriter.writeRecords(zip_to_second_silver)
              .then(() => {
                // console.log('csv complete');
              });
            // console.log('csv zip', zip_to_second_silver);
          })
          .catch((err) => {
            // console.log(err);
          });
      });
  });
// no second silver plan
// zipcode in two rate areas
