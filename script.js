const csv = require('csvtojson');

const silverPlans = {};
const zip_to_rate_areas = {};
const zip_to_rate = {};

csv()
  // find plans that are silver
  .fromFile('./plans.csv')
  .then((json) => {
    json
      .filter(row => row.metal_level === 'Silver')
      .forEach(row => {
        if(silverPlans[row.rate_area]) {
          silverPlans[row.rate_area] = 
            silverPlans[row.rate_area].concat(row.rate);
        } else {
          silverPlans[row.rate_area] = [row.rate];
        }
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

        //  [ '10045', Set(1) { '4' } ]
        // { zipcode: '47387', rate: '' }
        //   zip_to_rate_areas => '00698': Set(1) { '1' }
        // silver { '7': [ '298.62' ], '60': [ '421.43' ] }

      // take zipcode and find rate
      }).then(() => {
      // final scan where we output the rows of zip, second lowest rate
      // connect to slcsp.csv match by zipcode and print out rate
        csv()
          .fromFile('./slcsp.csv') // zipcode, need rate
          .then((json) => {
            // console.log(Object.keys(zip_to_rate_areas));
            json.forEach((row, i) => { 
              // take zipcode => rate area => rate
              if(Object.keys(zip_to_rate_areas)
                .filter((key, i) => key === row.zipcode)){
                console.log('keys', Object.values(zip_to_rate_areas));

                // console.log(zip_to_rate_areas[row.zipcode].values());
                // gives rate area 
                // console.log('va', zip_to_rate_areas);
                // zip_to_rate[row.zipcode[i]] = Object.values(zip_to_rate_areas);
                
                // get rate from silverPlans {}
              
              } else {
                // console.log('else');
              }

              // zip_to_rate[row.zipcode] = rate_area
              // connect rate_area to 2nd lowest rate
            });

        
          });
      });
  });
