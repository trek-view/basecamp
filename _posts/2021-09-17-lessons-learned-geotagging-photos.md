---
date: 2021-09-17
title: "Lessons learned when geotagging photos"
description: "Exiftool is a powerful bit of software for geotagging photos but understanding how it works will save you a few headaches."
categories: guides
tags: [GPX, GPS, GoPro, Fusion, exiftool]
author_staff_member: dgreenwood
image: /assets/images/blog/2021-09-17/gpx-track-sample-meta.jpg
gpx-track-sample-meta.jpg
featured_image: /assets/images/blog/2021-09-17/gpx-track-sample-sm.jpg
gpx-track-sample-meta.jpg
layout: post
published: false
---

**Exiftool is a powerful bit of software for geotagging photos but understanding how it works will save you a few headaches.**

As we get ready to release the next version of [the Map the Paths Uploader](https://www.mapthepaths.com/uploader), I've been going through some existing functionality.

One of its really useful features that a lot of people use is the ability to geotag a sequence with a GPX track.

It's particularly useful for when you're using a secondary GPS device, like a phone, in addition to your camera -- [which might not be all that accurate](/blog/2020/gps-101).

I've talked about geotagging frames using exiftool previously ([see 4. Geotag the frames](/blog/2021/turn-360-video-into-timelapse-images-part-2).

The Map the Paths Uploader uses exiftool to geotag images, but I wanted to take this weeks post to describe in a little more detail how this works and how we've implemented it.

## Understanding the GPX log

[GPX (the GPS Exchange Format)](https://www.topografix.com/gpx.asp) is a light-weight XML data format for the interchange of GPS data (waypoints, routes, and tracks).

You can read more in [the GPX docs here](https://www.topografix.com/GPX/1/1/) or the [full schema here](https://www.topografix.com/GPX/1/1/gpx.xsd). 

Typically, most GPS devices support output of a track in GPX format. A [`<trkseg>`](https://www.topografix.com/GPX/1/1/#type_trksegType) usually contains latitude, longitude, elevation, and time values, like the one shown below from a Columbus V 1000 device: 

```
<?xml version="1.0" encoding="UTF-8"?>
<gpx
version="1.1"
creator="Columbus GPS - http://cbgps.com/"
xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
xmlns="http://www.topografix.com/GPX/1/1"
xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">
<trk>
<name>2020-08/02120507.GPX</name>
<trkseg>
<trkpt lat="28.689014" lon="-13.931480"><ele>92</ele>
<time>2020-08-02T11:05:06Z</time></trkpt>
<trkpt lat="28.689009" lon="-13.931502"><ele>93</ele>
<time>2020-08-02T11:05:09Z</time></trkpt>
<trkpt lat="28.689007" lon="-13.931502"><ele>91</ele>
<time>2020-08-02T11:05:10Z</time></trkpt>
<trkpt lat="28.689007" lon="-13.931502"><ele>92</ele>
<time>2020-08-02T11:05:11Z</time></trkpt>
<trkpt lat="28.689005" lon="-13.931502"><ele>92</ele>
<time>2020-08-02T11:05:12Z</time></trkpt>
<trkpt lat="28.689005" lon="-13.931500"><ele>92</ele>
<time>2020-08-02T11:05:13Z</time></trkpt>
<trkpt lat="28.689005" lon="-13.931500"><ele>92</ele>
<time>2020-08-02T11:05:14Z</time></trkpt>
</trkseg>
</trk>
</gpx>
```

[As shown in the specification, lots more information can be repored inside a <trkpt>](https://www.topografix.com/GPX/1/1/#type_wptType) including:

* `<magvar>` [degreesType](https://www.topografix.com/GPX/1/1/#type_degreesType): Used for bearing, heading, course. Units are decimal degrees, true (not magnetic).
* `<fix>` [FixType](https://www.topografix.com/GPX/1/1/#type_fixType): Type of GPS fix. none means GPS had no fix. To signify "the fix info is unknown, leave out fixType entirely. pps = military signal used

But let's stick with the basic fields for now, as I am yet to see any device output much more than these values in a GPX track file (_prove me wrong device manufacturers!_).

Latitude (reported: -90.0 <= value <= 90.0), longitude (reported: -180.0 <= value < 180.0) and elevation (reported: -X <= value < Y). _If you want to learn more about latitude and longitude values, read last weeks post titled; [How to read decimal latitude and longitude values like a computer](/blog/2021/reading-decimal-gps-coordinates-like-a-computer)._

In addition to these three spatial measurements, time, is a crucial consideration for geotagging.

The GPX specification notes how time should be reported in a GPX file:

```
<xsd:element name="time" type="xsd:dateTime" minOccurs="0">
<xsd:annotation>
<xsd:documentation> Creation/modification timestamp for element. Date and time in are in Univeral Coordinated Time (UTC), not local time! Conforms to ISO 8601 specification for date/time representation. Fractional seconds are allowed for millisecond timing in tracklogs. </xsd:documentation>
</xsd:annotation>
</xsd:element>
```

[ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) is a standard for reporting date/time.

In the example track log above, we see time reported as:

```
<time>2020-08-02T11:05:13Z</time>
<time>YYYY-DD-MMThh:mm:ssZ</time>
```

In the above example, the time is reported as UTC (`Z`), but you can also define a UTC offset and still be ISO 8601 compliant, e.g.

```
<time>2020-08-02T11:05:13-00:00</time>
```

The example track log shared above reports to a second resolution, but you'll see the specification reads:

> Fractional seconds are allowed for millisecond timing in tracklogs.

This is especially important when geotagging videos. Many 360 cameras can shoot 60 or more frames per second, and normal action cameras can often shoot at an even higher framerate.

A GPX track reporting fractional seconds could have time values that look like this:

```
<time>2020-08-02T11:05:13.100Z</time>
<time>2020-08-02T11:05:13.200Z</time>
<time>2020-08-02T11:05:13.900Z</time>
<time>YYYY-DD-MMThh:mm:ss.sZ</time>
```

If you're familiar with racing, you'll know about 10th's of a second, 100th's of a second, etc. These are all fractional seconds.

Demonstrating this in practice; let's say we had a video shooting at 30 frames per second. In this scenario we would need one GPS trackpoint every 0.03333 seconds to ensure all frames can be tagged with the highest level of accuracy (e.g, 2020-08-02T11:05:13.03333Z, 2020-08-02T11:05:13.06666Z, 2020-08-02T11:05:13.09999Z, etc.).

It's also worth noting almost all mobile devices process GPS at the rate of 1Hz (1 GPS measurement a second) to save power (and cost of GPS chips), so you'll need to get a dedicated GPS receiver to get fractional second measurements... or, more likely at consumer level, attempt to estimate the positions of each photo using their time values and GPS positions in track log (more on that below).

## Time Issues

In order to geotag the frames (photos), the photos must have time reported in some way.

[Usually date/time can be obtained from the EXIF `DateTimeOriginal` field](https://exiftool.org/TagNames/EXIF.html), reported as a date/time (YYYY-DD-MM hh:mm:ss). There is also a lesser used `SubSecTimeOriginal` for reporting the fractional seconds for `DateTimeOriginal`. This value is essential, if you want to have fractional seconds in your GPX track.

In some cases `DateTimeOriginal` in the image can be inaccurate. For example, I have seen some stitching software overwrite `DateTimeOriginal` with the time the photo was stitched (not created)... but most cameras don't support this level of time resolution.

If you're writing GPS into frames extracted from a video where there is more than one frame per second, you will need to process the photos to include fractional seconds using either EXIF `DateTimeOriginal` and `SubSecTimeOriginal` tags, or GPS tag `GPSTimeStamp` which supports fractional seconds.

By default, exiftool will only read the `DateTimeOriginal` value in an image during the geotag process (so no fractional seconds).

If the images `DateTimeOriginal` is incorrect in a uniform manner (e.g. due to bad stitching software), you can use the [exiftool `-Geosync` tag](https://exiftool.org/geotag.html#geosync) to set a time offset.

To solve the issue of support for fractional seconds, the [exiftool `-Geotime` flag](https://exiftool.org/geotag.html#geotime) can be used to specify another time field to use from image metadata.

For example, to use `GPS:GPSTimeStamp` for time value to be used in my images (`FRAMES/`), I could use the `-Geotime` like so:

```
exiftool -geotag VIDEO_7152.gpx -Geotime<${GPS:GPSTimeStamp} FRAMES/
```

Note, if the GPX track does not report to fractional seconds, but the image data does (e.g. in `GPS:GPSTimeStamp`), it is not a problem, as I'll explain below...

## Geotagging the frames

Now we understand time considerations in more detail, we can geotag the photos using exiftool.

[exiftool uses linear interpolation to determine the GPS position at the time of the image](https://exiftool.org/geotag.html):

> In mathematics, linear interpolation is a method of curve fitting using linear polynomials to construct new data points within the range of a discrete set of known data points.

- [Wikipedia](https://en.wikipedia.org/wiki/Linear_interpolation)

Thinking about how this works exiftool:

1. exiftool reads timing of photo
2. exiftool reads GPS track times
3. then
	3.1 If exact time match between track point and photo, exiftool writes supported GPS data into the image. In this case, image latitude and longitude match track.
	3.2 Else; exiftool finds the 2 closest track point times on either side of the photo time. exiftool then calculates an estimated position between these two reported positions, based on photo time using linear interpolation. An easy way to think about this would be to imagine you have a GPS track containing only two reported positions, one at 12:00:01 and one at 12:00:11. Now the photo you want to geotag has a `DateTimeOriginal` time of 12:00:05. In this case linear interpolation would estimate a point equidistant between the two because photo time equidistant between GPS points (see example below). The estimated image latitude and longitude would not match the positions reported in track, because the position has been calculated to reside between the two. 

<img class="img-fluid" src="/assets/images/blog/2021-09-17/exiftool-linear-interpolation.jpg" alt="exiftool gps linear interpolation" title="exiftool gps linear interpolation" />

Depending on the amount of fields in a track file (which, as noted earlied, is usually very limited), exiftool will write in the following [GPS tags](https://exiftool.org/TagNames/GPS.html):

* GPS:GPSLatitude (required)
* GPS:GPSLongitude (required)
* GPS:GPSAltitude (required)
* GPS:GPSDateStamp (required)
* GPS:GPSTimeStamp (required)
* GPS:GPSLatitudeRef (required)
* GPS:GPSLongitudeRef (required) 
* GPS:GPSAltitudeRef (required)
* GPS:GPSTrack
* GPS:GPSSpeed
* GPS:GPSImgDirection
* GPS:GPSPitch
* GPS:GPSTrackRef
* GPS:GPSSpeedRef
* GPS:GPSImgDirectionRef
* GPS:GPSRoll
* GPS:AmbientTemperature
* GPS:CameraElevationAngle

Using the following GPX trackpoint as an example:

```
<trkpt lat="28.689005" lon="-13.931500"><ele>92</ele>
<time>2020-08-02T11:05:14Z</time></trkpt>
```

The exiftool geotag process would write the following tags into an image for this track point, assuming there is a match:

```
$ exiftool GPS:GPSLatitude:'28.689005' GPS:GPSLatitudeRef:'N' GPS:GPSLongitude:'13.931500' GPS:GPSLongitude:'W' GPS:GPSAltitude:'92' GPS:GPSDateStamp:'2020-08-02' GPS:GPSTimeStamp:'11:05:14Z' GPS:GPSAltitudeRef:'0' my_photo.jpg
```

... but don't worry too much about that, exiftool handles all this hard work in the geotag command:

```
exiftool -geotag VIDEO_7152.gpx FRAMES/
```

## Check out Map the Paths Uploader...

<img class="img-fluid" src="/assets/images/blog/2021-09-17/mapthepaths-uploader-add-gpx-sm.jpg" alt="Map the Paths Uploader Geotagging" title="Map the Paths Uploader Geotagging" />

You can already use [the Map the Paths Uploader](https://www.mapthepaths.com/uploader) to geotag photos using a GPX track (and use it to account for the timing issues described in this post).

[Stay tuned for upcoming improvements to the Map the Paths Uploader by signing up for Trek View updates](https://landing.mailerlite.com/webforms/landing/i5h6l6)!