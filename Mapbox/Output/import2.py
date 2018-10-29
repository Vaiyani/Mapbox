import json
from pprint import pprint

Months = ["January.txt", "Febuary.txt", "March.txt", "April.txt", "May.txt", "June.txt", "July.txt", "August.txt", "September.txt", "October.txt", "November.txt", "December.txt"]
data = []
Total_Revenue = 0
for i in range(len(Months)):
	with open(Months[i], 'r', encoding='utf-16') as myfile:
	    temp = myfile.read().replace('\n', '')
	    data.append(json.loads(temp))



print(len(data[0]["features"]))

for i in range(len(data[0]["features"])):
	temp = {'Polygon_ID': data[0]["features"][i]["properties"]["Polygon_ID"],
			'Area_ID' :   data[0]["features"][i]["properties"]["Area_ID"],
			'Area_Name':  data[0]["features"][i]["properties"]["Area_Name"]}
	Total_Revenue = 0		
	for j in range(len(data)):
		temp[Months[j][:-4]] = {'Revenue' :   data[j]["features"][i]["properties"]["Revenue"],
								'Cost' :      data[j]["features"][i]["properties"]["Cost"],
								'Paid_Listings' :   data[j]["features"][i]["properties"]["Paid_Listings"],
								'Free_Listings' :   data[j]["features"][i]["properties"]["Free_Listings"],
								'Total_Revenue' :   data[j]["features"][i]["properties"]["Total_Revenue"],
								'Total_Cost' :   data[j]["features"][i]["properties"]["Total_Cost"]}
		Total_Revenue += data[j]["features"][i]["properties"]["Total_Revenue"]
	temp["Total_Revenue"] = Total_Revenue						 
	data[0]["features"][i]["properties"] = temp

json_string = json.dumps(data[0])
f = open( 'file2.json', 'w' )
f.write(json_string + '\n' )
f.close()

