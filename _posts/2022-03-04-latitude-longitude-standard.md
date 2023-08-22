---
date: 2022-03-04
title: "Lat,Lon or Lon,Lat?"
description: "One of the biggest pains of working with geospatial software is determining the way each presents latitude and longitude... or is that longitude and latitude?"
categories: guides
tags: [gps, co-ordinated, latitude, longitude]
author_staff_member: dgreenwood
image: /assets/images/blog/2022-03-04/map-pin-ocean-meta.png
featured_image: /assets/images/blog/2022-03-04/map-pin-ocean-sm.png
layout: post
published: true
---

**One of the biggest pains of working with geospatial software is determining the way each presents latitude and longitude... or is that longitude and latitude?**

In Cartography, tradition has been to write co-ordinates as latitude followed by longitude.

There are many theories as to why. The most convincing is that [since we were able to judge latitude much earlier than we could judge longitude, we put it first](https://en.wikipedia.org/wiki/History_of_longitude).

However, mathematical applications tend to prefer longitude followed by latitude.

In the world of geospatial software this has led to a fundamental inconsistency: the order in which longitude and latitude is displayed in [Decimal Degrees](/blog/reading-decimal-gps-coordinates-like-a-computer).

Let us start by taking a look at the problem this causes.

The summit of Mount Everest has a latitude of `27.986065` and longitude is `86.922623`.

Google search expect [decimal co-ordinates](/blog/reading-decimal-gps-coordinates-like-a-computer) provided as `lat,lon`.

If I search lat,lon; [`27.986065,86.922623`](https://www.google.com/search?q=86.922623%2C27.986065), it resolves correctly.

If I search lon,lat; [`86.922623,27.986065`](https://www.google.com/search?q=86.922623%2C27.986065), it resolves incorrectly (to the middle of the Arctic Ocean).

But the Mapbox API expects it the other way around as [`lnglat`](https://docs.mapbox.com/mapbox-gl-js/api/map/#map#project),  the reverse of the Google example would occur.

This inconsistency is seen everywhere and causes headaches when using multiple libraries or a different combination of software in a workflow...

### Use `Latitude,Longitude` order

* Fileformats
	* [GeoRSS](http://www.georss.org/simple.html)
	* [Encoded Polylines (Google)](https://developers.google.com/maps/documentation/utilities/polylinealgorithm)
* Javascript APIs
	* [Leaflet](https://leafletjs.com/reference-1.6.0.html#latlng)
	* [Google Maps API](https://developers.google.com/maps/documentation/javascript/reference/coordinates)
* Mobile APIs
	* [Google Maps iOS/Android](https://developers.google.com/maps/documentation/ios-sdk/overview)
	* [Apple MapKit](https://developer.apple.com/documentation/mapkit/)

### Use `Longitude,Latitude` order

Some examples...

* Fileformats
	* [GeoJSON](https://tools.ietf.org/html/rfc7946#section-3.1.1)
	* [KML](https://developers.google.com/kml/documentation/kmlreference#elements-specific-to-point)
	* [Shapefile](https://www.esri.com/library/whitepapers/pdfs/shapefile.pdf)
* Javascript APIs
	* [OpenLayers](https://openlayers.org/en/latest/apidoc/module-ol_coordinate.html#~Coordinate)
	* [D3](https://github.com/d3/d3-geo#_projection)
	* [ArcGIS API for JavaScript](https://developers.arcgis.com/javascript/latest/api-reference/esri-geometry-Polygon.html#rings)
	* [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/api/map/)
* Mobile APIs
	* [Tangram ES](https://github.com/tangrams/tangram-es/blob/master/core/src/util/types.h#L14)

## What if I don't know the syntax?

As noted in a previous post, [How to Read Co-Ordinates Like a Computer](/blog/reading-decimal-gps-coordinates-like-a-computer), Latitude only ever spans 180 degrees (90 North, 90 South), and longitude 360 degrees (180 East, 180 West).

Therefore if you see a number above 90, it must be referring to a longitude.

Though this is a little crude. Any points in Europe and Africa would be impossible to deduce using this method.

The short answer being, ask the developer (or consult the documentation). That is the only way to know for sure.

## Why is there not a standard for this?

Part of this problem is a data problem.

Geographic coordinates are frequently stored as arrays (e.g `[27.986065,86.922623]`), rather than descriptive objects (e.g `{"latitude": 27.986065, "longitude": 86.922623}`).

[ISO 6709](https://www.iso.org/standard/39242.html) is the international standard for representation of latitude, longitude and altitude for geographic point locations which states:

* Latitude comes before longitude
* North latitude is positive
* East longitude is positive

However, sadly, this ISO standard only applies to form inputs, not storage mechanisms, software or formats.

## What about the future?

There is some consensus growing around the longitude before latitude order for geospatial formats, however, this is still far from the standard that is desperately needed.

Unfortunately, it will be up to the developer working with the software to be aware of this issue and read the requisite documentation for a long time to come.