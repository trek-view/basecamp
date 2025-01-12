---
date: 2020-05-06
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

Essentially we need to turn the `.csv` into an `XML` file (`kml` is a flavour of XML).

[Google have a generic write-up of how this can be achieved here](https://developers.google.com/kml/articles/csvtokml), though given the custom fields in the AtmoTube data we need to do a bit of customisation to the script.

We'll make use `<ExtendedData>` element that offers three techniques for adding custom data to a KML Feature: [These techniques are](https://developers.google.com/kml/documentation/kmlreference#extendeddata):

1. [Adding untyped data/value pairs using the `<Data>` element](https://developers.google.com/kml/documentation/extendeddata#adding-untyped-namevalue-pairs) (basic)
2. [Declaring new typed fields using the `<Schema>` element and then instancing them using the `<SchemaData>` element](https://developers.google.com/kml/documentation/extendeddata#adding-typed-data-to-a-feature) (advanced)
3. [Referring to XML elements defined in other namespaces by referencing the external namespace within the KML file](https://developers.google.com/kml/documentation/extendeddata#adding-arbitrary-xml-data-to-a-feature) (basic)

Adding new typed fields (option 2) is most suited to the Atmotube `.csv` data because it contains fields with values we might want to visualise later on (e.g. `"Temperature, °C"`) in other applications. The ability to define a `type` attribute for the `SimpleData` data attribute will allow us to do this.

The following shows a template/sample for the way the script will represent the data from the AtmoTube `.csv` inside each `<Placemark>` of the `.kml` file:

```
<?xml version="1.0" encoding="utf-8"?>
<kml xmlns="http://earth.google.com/kml/2.2">
	<Document>
		<!-- First row of data -->
		<Placemark>
			<ExtendedData>
				<SchemaData schemaUrl="#AtmotubeData">        
					<SimpleData name="date" type="string">2021-03-14 10:38:00</SimpleData>
					<SimpleData name="voc_ppm" type="integer">0</SimpleData>
					<SimpleData name="aqs" type="integer">98</SimpleData>
					<SimpleData name="temperature_c" type="float">9.5</SimpleData>
					<SimpleData name="humidity_pc" type="integer">48</SimpleData>
					<SimpleData name="pressure_mbar" type="float">1007.2</SimpleData>
					<SimpleData name="pm1_ug3" type="integer">1</SimpleData>
					<SimpleData name="pm2_5_ug3" type="integer">2</SimpleData>
					<SimpleData name="pm10_ug3" type="integer">3</SimpleData>
				</SchemaData>
			</ExtendedData>
			<Point>
				<coordinates>51.2725253,-0.8453277</coordinates>
			</Point>
		</Placemark>
		<!-- Second row of data -->
		<Placemark>
			<ExtendedData>
				<SchemaData schemaUrl="#AtmotubeData">        
					<SimpleData name="date" type="string">2021-03-14 10:39:00</SimpleData>
					<SimpleData name="voc_ppm" type="integer">0</SimpleData>
					<SimpleData name="aqs" type="integer">98</SimpleData>
					<SimpleData name="temperature_c" type="float">7.7</SimpleData>
					<SimpleData name="humidity_pc" type="integer">55</SimpleData>
					<SimpleData name="pressure_mbar" type="float">1007</SimpleData>
					<SimpleData name="pm1_ug3" type="integer">1</SimpleData>
					<SimpleData name="pm2_5_ug3" type="integer">2</SimpleData>
					<SimpleData name="pm10_ug3" type="integer">3</SimpleData>
				</SchemaData>
			</ExtendedData>
			<Point>
				<coordinates>51.272167,-0.8337347</coordinates>
			</Point>
		</Placemark>
		<!-- Third row of data -->
		...
		<!-- End of CSV data -->
```

## The code

My sample code for creating a KML file from a Atmotube `.csv` file using Python 3.8 can be found on Github here.

## Sample KML created

A sample of the KML that this script created from my Atmotube `.csv` can be seen on Github here.

## Working with the KML file

Lot's of mapping tools can use `.kml` files natively, including Google Earth.

Note: You can also import `.csv` files to Google Earth, but it requires a level of effort on the user to assign the fields correctly.

We can also write out to Google Maps JS>

