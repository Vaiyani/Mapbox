import time
import json
import csv
import os.path
import collections
import pandas as pd
import numpy as np
from pprint import pprint

def loadTemplate(data):
	File = ["Template.txt"]
	for i in range(len(File)):
		with open(File[i], 'r', encoding='utf-8') as myfile:
		    temp = myfile.read().replace('\n', '')
		    data.append(json.loads(temp))

def readCsv(new,keys):
	# filename = input('Enter a file name with extension: ')
	# if(not os.path.exists(filename)):
	# 	while(not os.path.exists(filename)):
	# 			filename = input('File doesnt exists. Enter file name again: ')

	filename = "info.csv"

	df = pd.read_csv(filename)
	Time = map(str,df.iloc[:,1].unique().tolist())

	reader = csv.DictReader(open(filename))
	csvRow = []
	i = 0
	for row in reader:
		if(i==0):
			keys = list(row.keys())
		i = i + 1	
		new.setdefault(row[keys[0]],[])
		new[row[keys[0]]].append(row)
	
	
	for locId in new.keys():
		temp = {}
		for i in range(len(new[locId])):
			temp.setdefault(new[locId][i][ keys[1] ],[])
			temp[new[locId][i][ keys[1] ]].append(new[locId][i])
		new[locId] = temp
	return [keys,Time]

def automating(data, csv, keys, Time):
	for i in range(len(data[0]["features"])):
		for element in Time: 
			Temp = dict((str(key),[]) for key in keys)
			for AreaId in (data[0]["features"][i]["properties"]["Area_ID"]):				
				anyRowchecked = False
				if(AreaId in csv):
					if(element in csv[AreaId]):
						for key in InsertProperties:
							Temp[key].append(float(csv[AreaId][element][0][key]))
						anyRowchecked = True
				if(anyRowchecked == False):
					for key in InsertProperties:
						Temp[key].append(0)
			data[0]["features"][i]["properties"]["data"] = Temp
			for key in keys:
				data[0]["features"][i]["properties"]["Total" + key] = sum(Temp[key])




data = []
new = {}
keys = []

loadTemplate(data)


[keys,Time] = readCsv(new,keys)
Time = list(Time)
InsertProperties = keys[2:]
automating(data,new,InsertProperties,Time)


with open('Mapbox/JSON/result.json', 'w') as fp:
    json.dump(data[0], fp, sort_keys=True, indent=4)

##remove [] from result.json to validate on mapbox