## To run solution
- install pandas and numpy
  ``` pip install pandas ```
  ``` pip install numpy ```
- run solution by 
  ``` python solution.py ```
- solution is taking in data from three csv files, 
  plans.csv, slcsp.csv and zips.csv
- then filtering by metal_level for only silver plans
- comparing zipcode to, state, rate_area, and then rate_area to rate
- filtering for zipcodes with only one rate_area and grabbing second smallest rate
- if zipcode had multiple rate_areas, was left blank for being ambiguous
- if zipcode had only one rate, was left blank because no second smallest rate
- finally will create new final.csv file with header zipcode,rate linking zipcode to second smallest rate for silver plans

- to speed up solution:
  - line 12: optimize by not applying array of all rates, just grabbing first and second lowest rate
  - would remove need of applying second_smallest function on line 24
  - convert valid_zipcodes to dictionary to speed up look up time
  - if too slow, can time merges, set merge column as index (zipcode in this case)
  ``` valid_zip_to_rate_area.set_index('zipcode', inplace=True) ```