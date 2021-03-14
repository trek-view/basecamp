---
date: 2020-04-21
title: "Converting CSV files to KML"
description: "Lot's of devices, including the Atmotube, allow you to export data to CSV files. Here's how you can turn it into a map friendly format."
categories: developers
tags: []
author_staff_member: dgreenwood
image: /assets/images/blog/2020-04-09/
featured_image: /assets/images/blog/2020-04-09/
layout: post
published: false
---

**Turn your CSV into a map friendy format.**

Last week I showed you how to map the data produced by Atmotube Pro in Google Earth Pro.

In order to do this, I needed to convert the `.csv` file produced by the Atmotube Pro into `.kml` ([Keyhole Markup Language](https://developers.google.com/kml)) format.

> KML is a file format used to display geographic data in an Earth browser such as Google Earth. 

KML is an international standard maintained by the Open Geospatial Consortium, Inc. (OGC).

It's worth familarising yourself with the types of data that can be stored in .kml files ([the KML Reference document here is a great resource for this](https://developers.google.com/kml/documentation/kmlreference))

This post outlines the basics of how to create KML from the Atmotube `.csv` data using Python. 

For reference, [here's the sample `.csv` I use so you can follow along](https://drive.google.com/file/d/1-sQi_VuI82R4aqjH7yGy1NHHzAoeTmY2/view?usp=sharing).

## The logic

To help illustrate the turorial, here's a snippit of the first 5 lines from the `.csv` file: 

```
Date,"VOC, ppm",AQS,"Temperature, °C","Humidity, %","Pressure, mbar","PM1, ug/m³","PM2.5, ug/m³","PM10, ug/m³",Latitude,Longitude
2021-03-14 10:38:00,0,98,9.5,48,1007.2,1,2,3,51.2725253,-0.8453277
2021-03-14 10:39:00,0,98,7.7,55,1007,1,2,3,51.272167,-0.8337347
2021-03-14 10:40:00,0,98,7,57,1007.1,1,2,3,51.2756212,-0.8417959
2021-03-14 10:41:00,0,98,6.2,61,1007.5,1,2,3,51.277063,-0.8357297
```

Notice how each line is a series of text strings separated by commas. Each comma delimits a field; each line has the same number of commas.

The first line contains the names of the fields in order. For instance, the first block of text in each row is the "Date" field, the second "VOC, ppm", etc. 

Python's `xml.dom.minidom` module provides great tools for creating XML documents, and since KML is XML, you'll use it pretty heavily in this tutorial.

You create an element with `createElement` or `createElementNS`, and append to another element with `appendChild`. These are the steps for parsing the CSV file and creating a KML file.

1. Import geocoding_for_kml.py into your module.
2. Create a `DictReader` for the CSV files. The `DictReader` is a collection of dicts, one for each row.
3. Create the document using Python's `xml.dom.minidom.Document()`.
4. Create the root `<kml>` element using `createElementNS`.
5. Append it to the document.
6. Create a `<Document>` element using `createElement`.
7. Append it to the `<kml>` element using `appendChild`.
8. For each row, create a `<Placemark>` element, and append it to the` <Document>` element. The `<Placemark>` element captures all the data from a single row of the `.csv` (in this example, a measurement from the Atmotube).
9. For each column in each row, create an `<ExtendedData>` element and append it to the `<Placemark>` element you created in step 8 (see next section for notes on `<ExtendedData>`).
10. Create a `<Data>` element, and append it to the `<ExtendedData>` element. Give the `<Data>` element an attribute of name, and assign it the value of the column name using `setAttribute`.
11. Create a `<value>` element and append it to the `<Data>` element. Create a text node, and assign it the value of the column using `createTextNode`. Append the text node to the `<value>` element.
12. Create a `<Point>` element and append it to the `<Placemark>` element. Create a `<coordinates>` element and append it to the `<Point>` element.
13. Create a text node and assign it the value of the coordinates in columns 10 (J) and 11 (K), then append it to the `<coordinates>` element.
14. Write the KML document to a file.

## KML `<ExtendedData>` (step 9)

The `<ExtendedData>` element offers three techniques for adding custom data to a KML Feature: [These techniques are](https://developers.google.com/kml/documentation/kmlreference#extendeddata):

1. [Adding untyped data/value pairs using the `<Data>` element](https://developers.google.com/kml/documentation/extendeddata#adding-untyped-namevalue-pairs) (basic)
2. [Declaring new typed fields using the `<Schema>` element and then instancing them using the `<SchemaData>` element](https://developers.google.com/kml/documentation/extendeddata#adding-typed-data-to-a-feature) (advanced)
3. [Referring to XML elements defined in other namespaces by referencing the external namespace within the KML file](https://developers.google.com/kml/documentation/extendeddata#adding-arbitrary-xml-data-to-a-feature) (basic)

Adding new typed fields (option 2) is most suited to the Atmotube `.csv` data because it contains fields with values we might want to visualise later on (e.g. `"Temperature, °C"`) in other applications.

The following shows a template for the way my script will represent the data from the `.csv` inside each `<Placemark>` of the `.kml` file:

```
<?xml version="1.0" encoding="utf-8"?>
<kml xmlns="http://earth.google.com/kml/2.2">
	<Document>
		<Placemark>
			<ExtendedData>
				<SchemaData schemaUrl="#AtmotubeData">        
					<SimpleData name="date">"Date"</SimpleData>
					<SimpleData name="voc_ppm">"VOC, ppm"</SimpleData>
					<SimpleData name="aqs">"AQS"</SimpleData>
					<SimpleData name="temperature_c">"Temperature, °C"</SimpleData>
					<SimpleData name="humidity_pc">"Humidity, %"</SimpleData>
					<SimpleData name="pressure_mbar">"Pressure, mbar"</SimpleData>
					<SimpleData name="pm1_ug3">"PM1, ug/m³"</SimpleData>
					<SimpleData name="pm2_5_ug3">"PM2.5, ug/m³"</SimpleData>
					<SimpleData name="pm10_ug3">"PM10, ug/m³"</SimpleData>
				</SchemaData>
			</ExtendedData>
			<Point>
				<coordinates>"Latitude","Longitude"</coordinates>
			</Point>
		</Placemark>
		<Placemark>
		...
```

## The code

My sample code for creating a KML file from a Atmotube `.csv` file using Python 3.8 can be found on Github here.

## Sample KML created

A sample of the KML that this script created from my Atmotube `.csv` can be seen on Github here.

## Working with the KML file

Lot's of GIS do

