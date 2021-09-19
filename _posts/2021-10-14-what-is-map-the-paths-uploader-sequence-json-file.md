---
date: 2021-09-24
title: "Using trigonometry to calculate how photos in a sequence are connected"
description: "In another look back at some existing Map the Paths Uploader functionality, I wanted to take a look at the files it produces, specifically the sequence.json file."
categories: guides
tags: [gpx, Map the Paths, exiftool, heading, yaw, bearing, pitch, roll, speed]
author_staff_member: dgreenwood
image: /assets/images/blog/2021-09-24/
featured_image: /assets/images/blog/2021-09-24/
layout: post
published: false
---

**In another look back at some existing Map the Paths Uploader functionality, I wanted to take a look at the files it produces, specifically the `sequence.json` file.**

The Map the Paths Uploader outputs a variety of files and directories in its root directory:

<img class="img-fluid" src="/assets/images/blog/2021-09-24/map-the-paths-uploader-root-directory.jpg" alt="Map the Paths Uploader root directory" title="Map the Paths Uploader root directory" />

* `originals/`:
  * if images are used, this contains a copy of the original, untouched, images selected.
  * if video is used, this contains a copy of the original, untouched, video and the raw frames extracted from the video.
* `final_raw/`: only exists if no nadir added, this contains the final photos after any GPS, time, or images have been edited or removed.
* `final_nadir/`: only exists if nadir added, this contains the final photos after nadir added and any GPS, time, or images have been edited or removed.
* `SEQUENCE.gpx`: a .gpx track file of the final images in the sequence (in `final_*/` directories). _[Check out my post last week for a detailed look at what GPX files contain.](/blog/2021/lessons-learned-geotagging-photos)_
* `SEQUENCE.json`: a .json file of calculated measurements of the final images in the sequence (in `final_*/` directories). Let me explain more...

Many of you will have uploaded your sequences to Map the Paths, Mapillary, or Google Street View. Like me, you have probably taken for granted, or complained about, how the arrows appear in the frame and how the seamless transitions between images occurs when they are clicked.

In order to position the arrows in the image correctly, the metadata in each image is crucial.

Below is an example `SEQUENCE.json` file. This sequence has 35 photos, so I've removed the bulk of photos shown by `[...]`):

```
{
  "sequence": {
    "id": "67dda928-e948-4079-ac03-89288980130e",
    "distance_km": 0.005251140031753352,
    "earliest_time": "2020-05-10T06:45:03",
    "latest_time": "2020-05-10T06:45:38",
    "durationsec": 35,
    "average_speed_kmh": 1.1172604089162,
    "uploader_sequence_name": "My first sequence",
    "uploader_sequence_description": "Just a short sequence whilst snowboarding",
    "uploader_transport_type": "Snow",
    "uploader_transport_method": "Snowboard",
    "uploader_tags": [backflip,Switzerland],
    "created": "2021-06-10T20:41:09",
    "uploader_camera": "GoPro MAX",
    "destination": {}
  },
  "photo": {
    "c0f604c3-55b7-479d-9831-344cd3d26026": {
      "original": {
        "filename": "_1.jpg",
        "GPSDateTime": "2020-05-10T06:45:03",
        "originalDateTime": "2020-05-10T06:45:03",
        "altitude": 14,
        "latitude": 52.255262,
        "longitude": 6.7798662,
        "gps_direction_ref": "",
        "heading": 73.73727212463024,
        "pitch": 0,
        "roll": 0,
        "projection": "equirectangular"
      },
      "modified": {
        "filename": "_1.jpg",
        "GPSDateTime": "2020-05-10T06:45:03",
        "originalDateTime": "2020-05-10T06:45:03",
        "altitude": 14,
        "latitude": 52.255262,
        "longitude": 6.7798662,
        "gps_direction_ref": "",
        "heading": 73.73727212463024,
        "pitch": 0,
        "roll": 0,
        "projection": "equirectangular"
      },
      "connections": {
        "0a7c6412-dbb0-4131-889f-d985f9683807": {
          "distance_mtrs": 0.19853240813946677,
          "heading_deg": 73.73727212463024,
          "adj_heading_deg": 16.262727875369762,
          "pitch_deg": 0,
          "time_sec": -1,
          "speed_kmh": -0.7147166693020804,
          "elevation_mtrs": 1.2
        }
      }
    },
    "0a7c6412-dbb0-4131-889f-d985f9683807": {
      "original": {
        "filename": "_2.jpg",
        "GPSDateTime": "2020-05-10T06:45:04",
        "originalDateTime": "2020-05-10T06:45:04",
        "altitude": 14,
        "latitude": 52.2552625,
        "longitude": 6.779869,
        "gps_direction_ref": "",
        "heading": 90,
        "pitch": 0,
        "roll": 0,
        "projection": "equirectangular"
      },
      "modified": {
        "filename": "_2.jpg",
        "GPSDateTime": "2020-05-10T06:45:04",
        "originalDateTime": "2020-05-10T06:45:04",
        "altitude": 14,
        "latitude": 52.2552625,
        "longitude": 6.779869,
        "gps_direction_ref": "",
        "heading": 90,
        "pitch": 0,
        "roll": 0,
        "projection": "equirectangular"
      },
      "connections": {
        "c0f604c3-55b7-479d-9831-344cd3d26026": {
          "distance_mtrs": 0.006806738011432161,
          "heading_deg": 73.73727212463024,
          "pitch_deg": 0,
          "adj_heading_deg": 16.262727875369762,
          "time_sec": 1,
          "speed_kmh": 0.02450425684115578,
          "elevation_mtrs": -1.2
        },
        "bbe78668-64b5-4246-9ce7-55c612608ecd": {
          "distance_mtrs": 0.006806738011432161,
          "heading_deg": 90,
          "adj_heading_deg": 161.90674083969918,
          "pitch_deg": 0,
          "time_sec": -1,
          "speed_kmh": -0.02450425684115578,
          "elevation_mtrs": 1.2
        }
      }
    },
[...]

  }
}
```

For the old school followers of our work, you might remember this file from our old CLI tool, [Sequence Maker](https://github.com/trek-view/sequence-maker).

The code used to generate this file in the Uploader uses much of the same logic.

The main reason for the `SEQUENCE.json` file in the Uploader is to act as a mini database to populate the views in the app.

At the top of the document, you'll find the information you entered when creating the sequence, like title and description 

```
"sequence": {
[...]
	"uploader_sequence_name": "My first sequence",
    "uploader_sequence_description": "Just a short sequence whilst snowboarding",
    "uploader_transport_type": "Snow",
    "uploader_transport_method": "Snowboard",
```

It also contains some aggregate statistics for the sequence, including;

```
    "durationsec": 35,
    "average_speed_kmh": 1.1172604089162,
```

Which are calculated through the values computed in the connections section of the `"photo"` object.

In each `"photo"` object (defined by UUID, e.g. `c0f604c3-55b7-479d-9831-344cd3d26026`), you'll find 3 sections.

**1. `"original"`**

This section shows raw metadata stripped from the image or video.

_Read more about metadata stored in [images](/blog/2020/metadata-exif-xmp-360-photo-files) and videos ([GoPro](/blog/2020/metadata-exif-xmp-360-video-files-gopro-gpmd) / [most other cameras](/blog/2020/metadata-exif-xmp-360-video-files-camm-camera-motion-metadata-spec))._

Map the Paths accepts both flat and equirectangular projections (non-360 and 360 cameras), this field will only populate if image is a 360 (equirectangular). If the `"projection"` is empty, it means the image is flat.

Note, if an image has been deleted from a sequence during processing, it will not appear at all in the `SEQUENCE.json` file.

**2. `"modified"`**

This section shows the final metadata in the images. Often this will be different to the original values because GPS positions have been modified, or copyright information added during sequence creation.

The values reported here are those used in the connection calculations below.

**3. `"connections"`**

Each photo has 1 or 2 connections to another photo. The first and last photos in the sequence always have 1 connection (either forward and back). All other photo connections will have 2 connections (both forward and back).

You can see what photos are connected under the `"connections"` object and seeing the UUID's of the other photos listed.

For example, in the snippet above, photo `0a7c6412-dbb0-4131-889f-d985f9683807` has 2 connections (the next photo in the sequence is `c0f604c3-55b7-479d-9831-344cd3d26026` and previous photo in the sequence is `bbe78668-64b5-4246-9ce7-55c612608ecd`)

Here's a description of what each of the field values contains:

```
		"connections": {
			"[CONNECTION_1_PHOTO_UUID (NEXT PHOTO)]": {
				"distance_mtrs": # distance to next photo. Reported in meters (is negative for previous photo in sequence),
				"time_sec": # time to next photo. Reported in seconds (is negative for previous photo in sequence),
				"speed_kmh": # speed to travel to next photo. Reported in kilometers per hour (is negative for previous photo in sequence),
				"heading_deg": # heading to next photo. Reported in degrees between 0 and 359.99 degrees,
				"adj_heading_deg": # reported in degrees between 0 and 359.99 degrees. reported for previous photo connection only,
				"pitch_deg": # reported in degrees between -90 to 90 degrees,
        "elevation_mtrs": # reported in meters. Elevation change to next photo
		},
			"[CONNECTION_2_PHOTO_UUID (PREVIOUS PHOTO)]": {
				[...]
			}
		}
```

Explained in more detail, these fields represent:

* elevation change to destination (`elevation_mtrs`): can be calculated using the equation "`destination photo altitude - current photo altitude`"
* distance to destination (`distance_mtrs`): using the position of both photos (using the reported `GPSLatitude` to `GPSLongitude` in each) can calculate distance using the [Haversine formula](https://en.wikipedia.org/wiki/Haversine_formula).
* time difference to destination (`time_sec`): using either `GPSDateTime` or `originalDateTime`, can be calculated as as "`destination photo time - current photo time`"
* speed to destination (`speed_kmh`): using `distance_mtrs` and `time_sec` it is possible to calculate speed between two photos (`speed = distance_mtrs / time_sec`)
* azimuth to destination (`heading_deg`) (estimate): calculated using the vertical angle between the `GPSAltitude` value of current and destination photo.
* pitch to destination (`pitch_deg`) (estimate): calculated using the horizontal angle between the current photo and the destination photo using `elevation_mtrs`.
* adjusted heading to destination (`adj_heading_deg`): reported in degrees between 0 and 359.99 degrees. Only calculated for previous photo connection. Calculated using next photo `heading_deg` - previous `heading_deg`. Calculation can return negative value, in which case it is converted to positive number.

<img class="img-fluid" src="/assets/images/blog/2021-09-22/sequence-maker-diagram.jpeg" alt="Calculating heading GPS" title="Calculating heading GPS" />

The diagram above aims to visually demonstrates how some of the values are calculated. In my post, [What Direction are you Facing?](/blog/2020/what-direction-are-you-facing), I take a much deeper look into these calculations (for example; why an adjusted heading value is needed).

These values are useful rendering images in the sequence, and placing the arrows to connected photos correctly. Google Street View and Mapillary calculate these values on their servers (albeit in a slightly different way). We calculate them in the Map the Paths Uploader for local rendering of sequences.

## Check out Map the Paths Uploader...

<img class="img-fluid" src="/assets/images/blog/2021-09-22/" alt="Map the Paths Uploader Geotagging" title="Map the Paths Uploader Geotagging" />

Take a look at a `SEQUENCE.json` file for one of your sequences generated in [the Map the Paths Uploader](https://www.mapthepaths.com/uploader).

[Stay tuned for upcoming improvements to the Map the Paths Uploader by signing up for Trek View updates](https://landing.mailerlite.com/webforms/landing/i5h6l6)!