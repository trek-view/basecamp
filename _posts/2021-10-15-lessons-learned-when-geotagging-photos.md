---
date: 2021-10-15
title: "Lessons learned when geotagging timelapse photos and video frames"
description: "Exiftool is a powerful bit of software for geotagging photos, understanding how the process works will save you a few headaches."
categories: developers
tags: [GPX, GPS, GoPro, Fusion, exiftool, geotag]
author_staff_member: dgreenwood
image: /assets/images/blog/2021-10-15/gpx-track-sample-meta.jpg
featured_image: /assets/images/blog/2021-10-15/gpx-track-sample-sm.jpg
layout: post
published: true
---

**Exiftool is a powerful bit of software for geotagging photos, understanding how the process works will save you a few headaches.**

[I've talked previously about creating frames (photos) from video files and how to inject a GPS track log](/blog/2021/turn-360-video-into-timelapse-images-part-2). 

It's a process that's useful for when you're uploading or viewing 360 content, for example, to Mapillary, that doesn't accept video.

In that previous, the process of geotagging is somewhat simplistic. As I have come to learn there's often many other things to be aware of. This post aims to share the lessons I've learned in the intervening 8 months.

## Using SubSecDateTimeOriginal

Camera manufacturers often write photo data time to the DateTimeOriginal metadata field (to second resolution, when not in high framerate timelapse modes).

However, the EXIF standard also supports two other useful time fields (`SubSecTimeOriginal` and `SubSecDateTimeOriginal`). [Details here](https://exiftool.org/TagNames/EXIF.html).

The values for these fields look like this:

* DateTimeOriginal = 2020:04:13 15:37:22
* SubSecDateTimeOriginal = 2020:04:13 15:37:22.444
* SubSecTimeOriginal = 44

For videos these values are important. Let's imagine a camera is shooting a video at 5 frames per second (a common framerate for Google Street View camera modes).

In this case you have a photo every 0.2 seconds. Sub-seconds are therefore vital.

It's fair to assume the first frame extracted inherits the first GPS point (time, latitude, longitude...) from the video telemetry.

Knowing this, we can then simply iterate the SubSecDateTimeOriginal for each photo in the sequence by +0.2 seconds to assign a SubSecDateTimeOriginal to each.

## Understanding the GPX log

Let's start with the GPX track. One of the great features of exiftool is its ability to geotag a sequence with a GPX track.

It's particularly useful for when you're using a secondary GPS device, like a phone, in addition to your camera ([which might be significantly less accurate than an external device](/blog/2020/gps-101)).

[GPX (the GPS Exchange Format)](https://www.topografix.com/gpx.asp) is a light-weight XML data format for the interchange of GPS data (waypoints, routes, and tracks).

You can read more in [the GPX docs here](https://www.topografix.com/GPX/1/1/) or the [full schema here](https://www.topografix.com/GPX/1/1/gpx.xsd). 

Typically, most GPS devices support output of a track in GPX format. A [`<trkseg>`](https://www.topografix.com/GPX/1/1/#type_trksegType) usually contains latitude, longitude, elevation, and time values, like this one from a Columbus V 1000 device: 

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

[As shown in the specification, lots more information can be reported inside a `<trkpt>`](https://www.topografix.com/GPX/1/1/#type_wptType) including:

* `<magvar>` [degreesType](https://www.topografix.com/GPX/1/1/#type_degreesType): Used for bearing, heading, course. Units are decimal degrees, true (not magnetic).
* `<fix>` [FixType](https://www.topografix.com/GPX/1/1/#type_fixType): Type of GPS fix. none means GPS had no fix. To signify "the fix info is unknown, leave out fixType entirely. pps = military signal used
* ...

But let's stick with the basic fields for now, as I am yet to see any device output much more than these standard values in a GPX track file ([_although Garmin does produce lots of its own custom tags_](https://www8.garmin.com/xmlschemas/GpxExtensionsv3.xsd)).

Latitude (reported: -90.0 <= value <= 90.0), longitude (reported: -180.0 <= value < 180.0) and altitude/elevation (reported: -X <= value < Y). _If you want to learn more about latitude and longitude values, read my post titled; [How to read decimal latitude and longitude values like a computer](/blog/2021/reading-decimal-gps-coordinates-like-a-computer)._

In addition to these three spatial measurements, time, is a crucial consideration when geotagging.

The GPX specification notes how time should be reported in a GPX file:

```
<xsd:element name="time" type="xsd:dateTime" minOccurs="0">
<xsd:annotation>
<xsd:documentation> Creation/modification timestamp for element. Date and time in are in Universal Coordinated Time (UTC), not local time! Conforms to ISO 8601 specification for date/time representation. Fractional seconds are allowed for millisecond timing in tracklogs. </xsd:documentation>
</xsd:annotation>
</xsd:element>
```

[ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) is a standard for reporting date/time.

In the example track log above you see time reported to second resolution. However many cameras do in fact report to a sub-second resolution:

```
<time>2020-08-02T11:05:130Z</time>
<time>YYYY-DD-MMThh:mm:sssZ</time>
```

And the GPX time field does support this level of resolution too:

> Fractional seconds are allowed for millisecond timing in tracklogs.

This is especially important when geotagging frames from videos. 

Using the example GSV video earlier (at 5 FPS), if we only report to second level timing, it will result in 5 or more photos with exactly the same time and thus position.

**Protip**: In the above example, the time is reported as UTC (`Z`), but you can also define a UTC offset and still be ISO 8601 compliant, e.g.

```
<time>2020-08-02T11:05:13.130-02:00</time>
```

## Obtaining sub-second GPS times (a GoPro example)

[Let's take GoPro's GPMD as an example](/blog/2021/metadata-exif-xmp-360-video-files-gopro-gpmd).

Note: other manufacturers will write `GPSDateTime` values based on their own hardware and software designs, so this is a very specific example for GoPro camera's only.

As noted in the post linked above, there are many GPS points reported (up to 18) without `GPSDateTime` values by GoPro cameras.

The points without time are assumed to be calculated, as there are not always 18 points reported.

Exactly how this estimations is calculated is not clear (and probably proprietary), but some combination of [IMU measurements](/blog/2020/360-camera-sensors-imu-accelerometer-gyroscope-magnetometer) in conjunction with GPS point captured every second is likely used.

Assuming these points are evenly spaced by time (that is, the camera was traveling at the same velocity over the time period) we can calculate times for each of these points.

Using this assumption, GPS times can be estimated for each latitude, longitude and altitude value reported without time.

This time estimation is done by counting number of points without times between two points that do contain `GPSDateTime` values.

Then by calculating the time delta between the two `GPSDateTime` values reported we can divide that delta by number of GPS points to calculate an evenly spaced time delta between points, and then assign that delta sequentially to all the points reported and write to a GPX file.

```
 <Track3:GPSDateTime>2020:04:13 15:37:00.000</Track3:GPSDateTime>
 <Track3:GPSHPositioningError>2.03</Track3:GPSHPositioningError>
 <Track3:GPSLatitude>51 deg 14&#39; 54.51&quot; N</Track3:GPSLatitude>
 <Track3:GPSLongitude>0 deg 46&#39; 56.80&quot; W</Track3:GPSLongitude>
 <Track3:GPSAltitude>157.641 m</Track3:GPSAltitude>
 <Track3:GPSSpeed>1.348</Track3:GPSSpeed>
 <Track3:GPSSpeed3D>1.28</Track3:GPSSpeed3D>
 <Track3:GPSLatitude>51 deg 14&#39; 54.52&quot; N</Track3:GPSLatitude>
 <Track3:GPSLongitude>0 deg 46&#39; 56.81&quot; W</Track3:GPSLongitude>
 <Track3:GPSAltitude>157.616 m</Track3:GPSAltitude>
 <Track3:GPSSpeed>1.57</Track3:GPSSpeed>
 <Track3:GPSSpeed3D>1.38</Track3:GPSSpeed3D>
 <Track3:GPSDateTime>2020:04:13 15:37:01.000</Track3:GPSDateTime>
 <Track3:GPSLatitude>51 deg 14&#39; 54.52&quot; N</Track3:GPSLatitude>
 <Track3:GPSLongitude>0 deg 46&#39; 56.81&quot; W</Track3:GPSLongitude>
 <Track3:GPSAltitude>157.627 m</Track3:GPSAltitude>
 <Track3:GPSSpeed>1.549</Track3:GPSSpeed>
 <Track3:GPSSpeed3D>1.6</Track3:GPSSpeed3D>

```

For example, in this case we have two `GPSDateTime`'s, 2020:04:13 15:37:00.000 and 2020:04:13 15:37:01.000, with one point in between without a time. Therefore we can assume time is equidistant between the two with the time 2020:04:13 15:37:00.500.

**Note on duplicate points**

In some cases, the telemetry might report duplicate points, because you're standing still. If latitude, longitude and altitude are all the same this is true.

However, due to GPS inaccuracies and [GPS approximation calculations done by the camera's IMU software](/blog/2020/360-camera-sensors-imu-accelerometer-gyroscope-magnetometer) you can also end up with points that are incorrect duplicates where latitude and longitude are the same, but altitude is not.

For example:

```
 <Track4:GPSLatitude>51 deg 16&#39; 21.22&quot; N</Track4:GPSLatitude>
 <Track4:GPSLongitude>0 deg 50&#39; 45.59&quot; W</Track4:GPSLongitude>
 <Track4:GPSAltitude>84.11 m</Track4:GPSAltitude>
 <Track4:GPSSpeed>0.501</Track4:GPSSpeed>
 <Track4:GPSSpeed3D>0.6</Track4:GPSSpeed3D>
 <Track4:GPSLatitude>51 deg 16&#39; 21.22&quot; N</Track4:GPSLatitude>
 <Track4:GPSLongitude>0 deg 50&#39; 45.59&quot; W</Track4:GPSLongitude>
 <Track4:GPSAltitude>84.118 m</Track4:GPSAltitude>
```

Assuming you are not going up vertically (e.g. while standing still in an elevator), this is incorrect. Here you might want to consider some logic to normalise altitude. At the most simplistic level this could be done by calculating a single mean average for all such duplicate points. [A more accurate approach would be to use a digital elevation model to reassign altitude values to these points](/blog/2020/what-is-a-digital-elevation-model).

## Writing sub-second GPS times

It's now possible to use the photo times and GPS time points written into a GPX file to geotag the photos.

Exiftool's geotag function uses [`DateTimeOriginal`](https://exiftool.org/geotag.html) in photos by default. Therefore we need to explicitly pass the `SubSecDateTimeOriginal` for the `-Geotime` flag.

```
exiftool -Geotag GPX.log "-Geotime<SubSecDateTimeOriginal" DIRECTORY
```

[exiftool uses linear interpolation to determine the GPS position at the `SubSecDateTimeOriginal` of the image](https://exiftool.org/geotag.html):

> In mathematics, linear interpolation is a method of curve fitting using linear polynomials to construct new data points within the range of a discrete set of known data points.

- [Wikipedia](https://en.wikipedia.org/wiki/Linear_interpolation)

Thinking about how this works exiftool:

exiftool first reads timings of photo and reads GPS track times.

If an exact time match between track point and photo `SubSecDateTimeOriginal`, exiftool writes GPS data into the image. In this case, image latitude, longitude, and altitude match track.

If there is not an exact time match between track point and photo `SubSecDateTimeOriginal`, exiftool finds the 2 closest track point times on either side of the photo time. exiftool then calculates an estimated position between these two reported positions, based on photo `SubSecDateTimeOriginal` using linear interpolation.

<img class="img-fluid" src="/assets/images/blog/2021-10-15/exiftool-linear-interpolation.jpg" alt="exiftool gps linear interpolation" title="exiftool gps linear interpolation" />

An easy way to think about this would be to imagine you have a GPS track containing only two reported positions, one at 12:00:01 and one at 12:00:11, and the photo you want to geotag has a `SubSecDateTimeOriginal` of 12:00:05. In this case linear interpolation would estimate a point equidistant between the two because the photo `SubSecDateTimeOriginal` is equidistant between the two reported GPS point times in the GPX log (see example below).

In this case, the estimated image latitude, longitude, and altitude would not match the positions reported in the GPX track, because the position has been calculated to reside between the two. 

The exiftool geotag process would then write the following tags into an image for this track point:

```
$ exiftool GPS:GPSLatitude:'AAA' GPS:GPSLatitudeRef:'BBB' GPS:GPSLongitude:'CCC' GPS:GPSLongitude:'DDD' GPS:GPSAltitude:'EEE' GPS:GPSDateStamp:'FFF' GPS:GPSTimeStamp:'GGG' GPS:GPSAltitudeRef:'HHH' photo_NNN.jpg
```

...but don't worry too much about that, exiftool handles all this tagging work in the geotag command.