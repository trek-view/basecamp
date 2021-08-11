---
date: 2021-09-24
title: ""
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

* `originals/`: if images added, this contains a copy of the original, untouched, images uploaed. if video added, this contains a copy of the original, untouched, video and the raw frames extracted from the video.
* `final_raw/`: only if no nadir addded, this contains the final photos after any GPS, time, or images have been edited or removed.
* `final_nadir/`: only if nadir addded, this contains the final photos after nadir added and any GPS, time, or images have been edited or removed.
* `SEQUENCE.gpx`: a .gpx track file of the final images in the seqenece (in `final_*/` directories). _[Check out my post last week for a detailed look at GPX files.](/blog/2021/lessons-learned-geotagging-photos)_
* `SEQUENCE.json`: a .json file of calculated measurements of the final images in the sequence. Let me explain more...

Below is an example `SEQUENCE.json` file (because the sequence has many photos, I've removed many reported photos in file shown by `[...]`):

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
          "speed_kmh": -0.7147166693020804
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
          "speed_kmh": 0.02450425684115578
        },
        "bbe78668-64b5-4246-9ce7-55c612608ecd": {
          "distance_mtrs": 0.006806738011432161,
          "heading_deg": 90,
          "adj_heading_deg": 161.90674083969918,
          "pitch_deg": 0,
          "time_sec": -1,
          "speed_kmh": -0.02450425684115578
        }
      }
    },
[...]

  }
}
```

For the old school followers of our work, you might remember this from our old CLI tool, [Sequence Maker](https://github.com/trek-view/sequence-maker).

The code used to generate this file in the Uploader uses much of the same logic.

The main reason for the SEQUENCE.json file in the Uploader is to populate the index page of the app which shows a list of all the sequences you've created, pulled from the `sequence` object: 

```
"sequence": {
[...]
	"uploader_sequence_name": "My first sequence",
    "uploader_sequence_description": "Just a short sequence whilst snowboarding",
    "uploader_transport_type": "Snow",
    "uploader_transport_method": "Snowboard",
```

However, it also contains some aggregate statistics for the sequence, including;

```
    "durationsec": 35,
    "average_speed_kmh": 1.1172604089162,
```

Which are calculated through the values computed in the connections section of the photos object.

In each `"photo"` object (defined by UUID, e.g. `c0f604c3-55b7-479d-9831-344cd3d26026`), you'll find 3 sections.

**1. `"original"`**

This section shows raw metadata stripped from the image. In the example above, I didn't modify any of the images when creating the sequence, so there was no metadata in the extracted frames (it gets added later in the process). Note, if an image has been deleted from a sequence, it will not appear at all in the sequence.json file.

**2. `"modified"`**

This section shows the final metadata in the images. This can often be different to the original if GPS positions have been modified, or copyright information added. The values reported here are those used in the connection calculations below.

**3. `"connections"`**

Each photo has 1 or 2 connections to another photo. The first and last photos in seqence always have 1 connection (either forward and back). All other photo connections will have 2 connections (both forward and back).

You can see what photos are connected under the `"connections"` object and seeing the UUID's of the other photos listed.

For example, in the snippet above, photo `0a7c6412-dbb0-4131-889f-d985f9683807` has 2 connections (the next photo in the sequence is `c0f604c3-55b7-479d-9831-344cd3d26026` and previous photo in the sequence is `bbe78668-64b5-4246-9ce7-55c612608ecd`)

```
		"connections": {
			"[CONNECTION_1_PHOTO_UUID (NEXT PHOTO)]": {
				"distance_mtrs": # distance to next photo. Reported in meters (is negative for previous photo in sequence),
				"time_sec": # time to next photo. Reported in seconds (is negative for previous photo in sequence),
				"speed_kmh": # speed to travel to next photo. Reported in kilometers per hour (is negative for previous photo in sequence),
				"heading_deg": # heading to next photo. Reported in degrees between 0 and 359.99 degrees,
				"adj_heading_deg": # reported in degrees between 0 and 359.99 degrees. reported for previous photo connection only,
				"pitch_deg": # reported in degrees between -90 to 90 degrees
		},
			"[CONNECTION_2_PHOTO_UUID (PREVIOUS PHOTO)]": {
				[...]
			}
		}
```

<img class="img-fluid" src="/assets/images/blog/2021-09-22/sequence-maker-diagram.jpeg" alt="Calculating heading GPS" title="Calculating heading GPS" />

The diagram above aims to demonstrates how some of the above field values are calculated. In my post, [What Direction are you Facing?](/blog/2020/what-direction-are-you-facing), I tkae a much deeper look into these (for example; why an adjusted heading value is needed).

These values are useful rendering images in the sequence, so that they face eac other, or to understand a bit more about the telemetry of the sequences.

## Check out Map the Paths Uploader...

<img class="img-fluid" src="/assets/images/blog/2021-09-22/" alt="Map the Paths Uploader Geotagging" title="Map the Paths Uploader Geotagging" />

Take a look at a sequence.json file for one of your sequence generated in [the Map the Paths Uploader](https://www.mapthepaths.com/uploader).

[Stay tuned for upcoming improvements in the Map the Paths Uploader covering data sharing by signing up for Trek View updates](https://landing.mailerlite.com/webforms/landing/i5h6l6)!