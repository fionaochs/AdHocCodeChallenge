from zipfile import ZipFile

zipObj = ZipFile('AdHocCodeChallenge.zip', 'w')
zipObj.write('solution.py')
zipObj.write('COMMENTS.md')
zipObj.write('plans.csv')
zipObj.write('zips.csv')
zipObj.write('slcsp.csv')
zipObj.close()