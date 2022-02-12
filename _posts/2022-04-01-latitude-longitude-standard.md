---
date: 2022-04-01
title: "Lat,lon or Lon,lat?"
description: "The biggest pain of working with geospatial software; determining the way they present latitude and longitude... or is that longitude and latitude?"
categories: guides
tags: []
author_staff_member: dgreenwood
image: /assets/images/blog/2022-04-01/map-pin-ocean-meta.png
featured_image: /assets/images/blog/2022-04-01/map-pin-ocean-sm.png
layout: post
published: false
---

**The biggest pain of working with geospatial software; determining the way they present latitude and longitude... or is that longitude and latitude?**

Geospatial software has a fundamental inconsistency: the order in which longitude and latitude is displayed.

Let us start by taking a look at the problem this causes.

The summit of Mount Everest has a latitude of `27.986065` and longitude is `86.922623`.

Google search expect [decimal co-ordinates](/blog/2021/reading-decimal-gps-coordinates-like-a-computer) provided as `lat,lon`.

If I search lat,lon; [`27.986065,86.922623`](https://www.google.com/search?q=86.922623%2C27.986065), it resolves correctly.

If I search lon,lat; [`86.922623,27.986065`](https://www.google.com/search?q=86.922623%2C27.986065), it resolves incorrectly (to the middle of the Arctic Ocean).

But the Mapbox API expects [`lnglat`])https://docs.mapbox.com/mapbox-gl-js/api/map/#map#project), here the reverse of the Google example would occur.

This inconsistency is seen everywhere...

### Use Latitude,Longitude order

* Fileformats
	* [GeoRSS](http://www.georss.org/simple.html)
	* [Encoded Polylines (Google)](https://developers.google.com/maps/documentation/utilities/polylinealgorithm)
* Javascript APIs
	* [Leaflet](https://leafletjs.com/reference-1.6.0.html#latlng)
	* [Google Maps API](https://developers.google.com/maps/documentation/javascript/reference/coordinates)
* Mobile APIs
	* [Google Maps iOS/Android](https://developers.google.com/maps/documentation/ios-sdk/overview)
	* [Apple MapKit](https://developer.apple.com/documentation/mapkit/)

### Use Longitude,Latitude order

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

## How to tame this mess

There's some consensus growing around longitude, latitude order for geospatial formats, but still chaos for libraries and software. 

You need to be very careful when working with decimalised latitude and longitude (_or longitude and latitude value_), and ensure you send them / read them in the order defined in the documentation of the tool you're using.

In GoPro metadata all GPS values are reported in 