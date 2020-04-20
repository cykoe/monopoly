#!/usr/bin/python
import csv , json

csvFilePath = "board.csv"
jsonFilePath = "board.json"
arr = []
#read the csv and add the arr to a arrayn

with open (csvFilePath) as csvFile:
    csvReader = csv.DictReader(csvFile)
    for csvRow in csvReader:
        print(csvRow)
        arr.append(csvRow)

# write the data to a json file
with open(jsonFilePath, "w") as jsonFile:
    jsonFile.write(json.dumps(arr, indent = 4))
