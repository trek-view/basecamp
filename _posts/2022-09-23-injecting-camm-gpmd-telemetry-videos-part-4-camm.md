---
date: 2022-09-23
title: "Injecting Telemetry into Video Files (Part 3): CAMM"
description: "In this post I will the structure of Google's CAMM standard, how to create a CAMM binary, and how to inject it into a mp4 video file."
categories: developers
tags: [gpmd, camm, telemetry, gpmf, gpx]
author_staff_member: dgreenwood
image: /assets/images/blog/2022-09-23/
featured_image: /assets/images/blog/2022-09-23/
layout: post
published: true
---

**In this post I will the structure of Google's CAMM standard, how to create a CAMM binary, and how to inject it into a mp4 video file.**

The CAMM specification is quite a bit simpler to GPMD in it's design, although the general `mdat` and `moov` box structure is the same.

In this post I'll use [Google's CAMM Specification](https://developers.google.com/streetview/publish/camm-spec) as a reference.

Let's start with an example video containing CAMM telemetry `200619_161801314.mp4`. Firstly, examining it using ffprobe;

```shell
ffprobe 200619_161801314.mp4
```

Prints;

```
Input #0, mov,mp4,m4a,3gp,3g2,mj2, from '200619_161801314.mp4':
  Metadata:
    major_brand     : mp42
    minor_version   : 0
    compatible_brands: isommp42
    creation_time   : 2020-06-19T15:18:18.000000Z
    com.android.version: 7.0
    make            : Pisofttech
    make-eng        : Pisofttech
    model           : Pilot Era
    model-eng       : Pilot Era
    firmware        : 5020
  Duration: 00:00:12.00, start: 0.000000, bitrate: 103315 kb/s
  Stream #0:0[0x1](eng): Data: none (camm / 0x6D6D6163), 2 kb/s (default)
    Metadata:
      creation_time   : 2020-06-19T15:18:18.000000Z
      handler_name    : MetadHandle
  Stream #0:1[0x2](eng): Video: h264 (Baseline) (avc1 / 0x31637661), yuv420p(tv, bt2020nc/bt2020/bt709, progressive), 7680x3840, 103310 kb/s, SAR 1:1 DAR 2:1, 7 fps, 7 tbr, 90k tbn (default)
    Metadata:
      creation_time   : 2020-06-19T15:18:18.000000Z
      handler_name    : VideoHandle
      vendor_id       : [0][0][0][0]
    Side data:
      spherical: equirectangular (0.000000/0.000000/0.000000) 
````

The output here is a little different to what we see for GPMF, but that's to be expected.

Here we can see stream 0 (0:0) contains the CAMM metadata

```
  Stream #0:0[0x1](eng): Data: none (camm / 0x6D6D6163), 2 kb/s (default)
```

Looking at bit deepe using exiftool;

```shell
exiftool -ee -G3 -api LargeFileSupport=1 -X 200619_161801314.mp4 > 200619_161801314.txt
```

Firstly we can see the same data that was printed by ffprobe;

```xml
<Track1:HandlerDescription>MetadHandle</Track1:HandlerDescription>
<Track1:MetaFormat>camm</Track1:MetaFormat>
```

And also the telemetry data, here's a snippet;

```xml
<Track1:SampleTime>1.86 s</Track1:SampleTime>
<Track1:SampleDuration>0 s</Track1:SampleDuration>
<Track1:Acceleration>-0.94921875 9.6640625 -0.03515625</Track1:Acceleration>
<Track1:SampleTime>1.86 s</Track1:SampleTime>
<Track1:SampleDuration>0.14 s</Track1:SampleDuration>
<Track1:AngularVelocity>0 -0.1640625 0.029296875</Track1:AngularVelocity>
<Track1:SampleTime>2.00 s</Track1:SampleTime>
<Track1:SampleDuration>0 s</Track1:SampleDuration>
<Track1:GPSDateTime>1980:01:06 00:00:00.016228Z</Track1:GPSDateTime>
<Track1:GPSMeasureMode>3-Dimensional Measurement</Track1:GPSMeasureMode>
<Track1:GPSLatitude>53 deg 10&#39; 55.26&quot; N</Track1:GPSLatitude>
<Track1:GPSLongitude>2 deg 51&#39; 40.66&quot; W</Track1:GPSLongitude>
<Track1:GPSAltitude>20.1 m</Track1:GPSAltitude>
<Track1:GPSHorizontalAccuracy>0.870000004768372</Track1:GPSHorizontalAccuracy>
<Track1:GPSVerticalAccuracy>0.870000004768372</Track1:GPSVerticalAccuracy>
<Track1:GPSVelocityEast>-0.543288171291351</Track1:GPSVelocityEast>
<Track1:GPSVelocityNorth>-0.980521082878113</Track1:GPSVelocityNorth>
<Track1:GPSVelocityUp>0</Track1:GPSVelocityUp>
<Track1:GPSSpeedAccuracy>0</Track1:GPSSpeedAccuracy>
```

Note, how the XML tag names match those shown in the [CAMM specification](https://developers.google.com/streetview/publish/camm-spec).

Exporting the telemetry metadata gives us a binary file, not too dissimlar to GPMF;

```shell
ffmpeg -i GS018423.mp4 -map 0:0 -c copy -f data 200619_161801314-telemetry.dat
```

<img class="img-fluid" src="/assets/images/blog/2022-09-23/camm-binary.png" alt="CAMM metadata binary" title="CAMM metadata binary" />

Finally, looking at the mp4 box structure of this video using the spatial-media tool to unpack ([as shown in part 2](/blog/2022/injecting-camm-gpmd-telemetry-videos-part-2-mp4));

```shell
python3 print_media.py 200619_161801314.mp4 
```

Which prints;

```
mpeg4 [154972743]
 ├── b'ftyp' [8, 16]
 ├── b'mdat' [16, 154967524]
 └── b'moov' [8, 5171]
     ├── b'mvhd' [8, 100]
     ├── b'meta' [8, 111]
     ├── b'trak' [8, 2565]
     │   ├── b'tkhd' [8, 84]
     │   └── b'mdia' [8, 2465]
     │       ├── b'mdhd' [8, 24]
     │       ├── b'hdlr' [8, 36]
     │       └── b'minf' [8, 2381]
     │           ├── b'nmhd' [8, 4]
     │           ├── b'dinf' [8, 28]
     │           └── b'stbl' [8, 2325]
     │               ├── b'stsd' [8, 33]
     │               │   └── b'camm' [8, 17]
     │               ├── b'stts' [8, 1352]
     │               ├── b'stsz' [8, 724]
     │               ├── b'stsc' [8, 80]
     │               └── b'co64' [8, 96]
     ├── b'trak' [8, 2292]
     │   ├── b'tkhd' [8, 84]
     │   ├── b'mdia' [8, 890]
     │   │   ├── b'mdhd' [8, 24]
     │   │   ├── b'hdlr' [8, 36]
     │   │   └── b'minf' [8, 806]
     │   │       ├── b'vmhd' [8, 12]
     │   │       ├── b'dinf' [8, 28]
     │   │       └── b'stbl' [8, 742]
     │   │           ├── b'stsd' [8, 162]
     │   │           │   └── b'avc1' [8, 146]
     │   │           ├── b'stts' [8, 24]
     │   │           ├── b'stss' [8, 20]
     │   │           ├── b'stsz' [8, 348]
     │   │           ├── b'stsc' [8, 44]
     │   │           └── b'co64' [8, 96]
     │   └── b'uuid' [8, 1294]
     └── b'udta' [8, 63]
         ├── b'\xa9mak' [8, 15]
         ├── b'\xa9mod' [8, 14]
         └── b'FIRM' [8, 10]
```

There are two `trak`s, one for the video metadata, the other for the telemetry metadata. The first `trak`, as ordered above, contains the camm data; `moov` > `trak` > `mdia` > `minf` > `stbl` > `stsd` > `camm`. This is the same path as GPMF if you remember back to last weeks post.

OK, lets start to reverse engineer this to understand what we're looking at.

## Raw telemetry (inside `mdat` box)

CAMM telemetry covers a variety of measurement types coming from camera sensors.

<img class="img-fluid" src="/assets/images/blog/2022-09-23/camm-case6-specification.png" alt="CAMM Spec case6" title="CAMM Spec case6" />

In the part of the specification shown above (case 6) you can see the following measurement types are accepted

* time_gps_epoch - Time since the GPS epoch when the measurement was taken
* gps_fix_type - 0 ( no fix), 2 (2D fix), 3 (3D fix)
* latitude - Latitude in degrees
* longitude - Longitude in degrees
* altitude - Height above the WGS-84 ellipsoid
* horizontal_accuracy - Horizontal (lat/long) accuracy
* vertical_accuracy - Vertical (altitude) accuracy
* velocity_east - Velocity in the east direction
* velocity_north - Velocity in the north direction
* velocity_up - Velocity in the up direction
* speed_accuracy - Speed accuracy

In the CAMM specification there are a total of 8 "cases". Above is case 6, this is concerned with positional information. If you take a look at the specification each case contains different measurement types. case 0 is camera angle, case 1 is camera exposure information, and so on.

Cameras come equipt with different sensors. It is not a requiredment to print each case.

For example, lets say a camera only has a GPS chip and produces GPS information. To illustrrate the point I will use a sample GPX file

Let us assume we start with a GPX file with the following;

```xml
<?xml version="1.0" encoding="UTF-8"?>
<gpx xmlns="http://www.topografix.com/GPX/1/1" version="1.1" creator="https://github.com/juanirache/gopro-telemetry">
    <trk>
        <name>undefined</name>
        <desc>GPS (Lat., Long., Alt., 2D speed, 3D speed) - [deg,deg,m,m/s,m/s]</desc>
        <src>GoPro Max</src>
        <trkseg>
            <trkpt lat="51.2725595" lon="-0.8459936">
                <ele>84.067</ele>
            <time>2021-09-04T07:25:17.352Z</time>
              <fix>3d</fix>
              <hdop>139</hdop>
              <cmt>altitude system: MSLV; 2dSpeed: 0.094; 3dSpeed: 0.12</cmt>
            </trkpt>
```

If this looks familiar, it's the output from [GoPro Telemetry](/blog/2021/gopro-telemetry-exporter-getting-started).

It gives us all values the map to case 5 and case 6 in CAMM. case 5 and 6 are very close. case 5 only contains latitude, longitude and altitude values. However, we have more values in our GPX;

* time = 2021-09-04T07:25:17.352Z
* latitude = 51.2725595 degrees
* longitude = -0.8459936 degrees
* altitude = 84.067 meters
* 2dSpeed = 0.094 meters/second
* 3dSpeed = 0.12 meters/second

All of which are covered in case 6. Therefore, if we we're writing a CAMM entry for this point, I would use case 6 to do so.

Converting this to CAMM is quite simple. Ultimatley each telemetry entry is a JSON object. So in this case (once each value has been correctly converted to the format defined by CAMM) we get;

```json
{
	"time_gps_epoch": 1667844041352,
	"latitude": 51.2725595,
	"longitude": -0.8459936,
	"altitude": 183.94700622558594
}
```

With each reported GPS point, another CAMM entry can be reported;

```json
{
	"time_gps_epoch": 1667844041352,
	"latitude": 51.2725595,
	"longitude": -0.8459936,
	"altitude": 183.94700622558594
},
{
	"time_gps_epoch": ...,
	"latitude": ...,
	"longitude": ...,
	"altitude": ...
},
...
```

If there are multiple CAMM cases being used, the file would look something like this







The  can then be converted to binary embedded into the `mdat` box as follows

TODO









## Telemetry metadata (inside `moov` box)

Now the telemetry is inside the `mdat` box, we need to describe it in the metadata in the `moov` nested boxes.

> The video file should contain the following sample entry box to indicate the custom metadata track, and the subComponentType of the track should be set to meta.

<img class="img-fluid" src="/assets/images/blog/2022-09-09/Camera-Motion-Metadata-Spec-Street-View-Publish-API-Google-Developers.jpeg" alt="CAMM Spec" title="CAMM Spec" />

_[CAMM Specification](https://developers.google.com/streetview/publish/camm-spec)._

The "sample entry box" described is the `stbl` box.










