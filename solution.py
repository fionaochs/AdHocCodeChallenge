import pandas as pd
import numpy as np


plans = pd.read_csv('plans.csv')
zips = pd.read_csv('zips.csv')
zipcode_rate = pd.read_csv('slcsp.csv')

# match only silver plans
# assuming rate_area is (state, number) tuple, so group by state, rate_area
# apply list of all rates for state,rate_area
rate_area_to_list_rate = plans.loc[plans['metal_level'] == 'Silver'].groupby(['state','rate_area'])['rate'].apply(list).reset_index(name = 'list_rates')

# function for second smallest value
def secondSmallest(list_rate):
    if len(list_rate) < 2:
        return np.nan
    # make unique before sorting
    second_smallest = sorted(list(set(list_rate)))[1]
    return second_smallest

# add column of second smallest rate to rate_area_to_list_rate df
rate_area_to_list_rate['second_smallest_rate'] = rate_area_to_list_rate['list_rates'].apply(secondSmallest)


# create table of zipcodes that have more than 1 rate area
zipcode_counts = zips.zipcode.value_counts()
# valid zipcode if zipcode in one rate_area
valid_zipcodes = zipcode_counts.index[zipcode_counts.eq(1)]

# check if zipcode is valid, return boolean
zipcode_bool = zips['zipcode'].isin(valid_zipcodes)
valid_zip_to_rate_area = zips[zipcode_bool]

# merge by zipcode to add rate_area
zipcode_to_rate_area = zipcode_rate.merge(valid_zip_to_rate_area, on='zipcode', how='left')

# merge rate_area_to_list_rate by state and rate_area to get second smallest plan
final_table = zipcode_to_rate_area.merge(rate_area_to_list_rate, on=['state','rate_area'], how='left')

# return table with only zipcode and second_smallest_rate
# rename to rate
final_df = final_table[['zipcode', 'second_smallest_rate']].rename(columns={'second_smallest_rate':'rate'})

# write to new csv
final_df.to_csv('final.csv',index=False)

