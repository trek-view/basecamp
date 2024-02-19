---
date: 2023-02-17
title: "Building a Street View Alternative for Exploration... with no money (part 1)"
description: "In this post I will walk you through my thinking about how such an app could be built, and my early experiments."
categories: developers
tags: [YouTube, Meta, Mapillary, Facebook, GoPro, OpenSFM]
author_staff_member: dgreenwood
image: /assets/images/blog/2023-02-17/mapillary-web-api-requests-meta.jpg
featured_image: /assets/images/blog/2023-02-17/mapillary-web-api-requests-meta.jpg
layout: post
published: true
redirect_from:
  - 
---

**In this post I will walk you through my thinking about how such an app could be built, and my early experiments.**

Since the inception of Trek View I've wanted to build a map platform similar to Street View, but designed for adventurers.

A Street View alternative that allowed you to share your own adventures captured in 360. 

A Street View alternative that allowed you to surface trails you're interested in so that they can be explored in 360, filtering by how the images were captured (ski, hike, etc.), the elevation (or elevation changes), etc.

Over the last 4 years I've been doing a lot of research about how to implement the idea, much of which can be found on the blog. That research has made it clear the underlying infrastructure to build something like this is complex, but not impossible.

With a renewed drive to get something built, the following series of posts will summarise what I've found. The final post will describe the design I've settled on based on the surfaced requirements.

## What's wrong with Street View or Mapillary?

Mostly nothing.

The problem with these platforms is they were designed for street level images of roadways. They do a great job at that.

Yes, they both work with trail imagery, users can upload photos and videos shot (mostly) anywhere. However, the user experience for those browsing the uploads is far from perfect.

For me search is the biggest issue. Neither platform offers the ability to search on a specific criteria (e.g. elevation, type of trail, etc.). The assumption is you know where you want to drop into the imagery. For looking up what a store front looks like from an address, or if parking is easy, Mapillary and Street View are perfect. For trails, finding viewpoints or way-markers is more important which you can't easily get an address or fixed point to search on.

## What are the challenges with building your own street level image map?

What seems like a fairly simple tool, a map with images you can drop into, unravels to be very complex (and expensive) once you get under the hood...

### Data types/size

My backup of GoPro imagery and video is more than 30Tb.

To give a basic storage estimate using [Amazon S3 storage](https://aws.amazon.com/s3/pricing/) (I know there are cheaper options), it costs $0.023 per GB for storage. So $0.023 * 30000 = $690/mo!

Many services also charge for bandwidth usage. For example, you pay for requests made against your S3 buckets and objects. Assuming a user views 30 or 40 images per session, the costs get even higher!

Another issue with this is simply having a scalable solution for uploading this volume of imagery in a browser (or desktop app). Although this is a fairly trivial problem to solve.

Finally, if you've ever used ffmpeg to process videos on your PC you've probably heard your fan start screaming. Processing videos is fairly intensive. To put videos on the map, you need to convert them to images which required ffmpeg. Therefore, costs to run an ffmpeg processing server also quickly adds up.

For someone with a budget of less than $100/mo to run this, following the approach of hosting all the data myself is impossible.

### Database storage

This is where the complexity can come in. In Street View you have interconnected blue lines. You can jump between images seamlessly in the interface.

In the backend, I am assuming Street View and Mapillary use a graph database to join points with relationships. This is fairly easy at a sequence level, that is for images in a timelapse or a single video uploaded by a user. Though how do you define how sequences close to each other are connected? This is defined in the queries.

Similarly, before images are exposed on the map the metadata for them is processed to ensure accuracy. In the case of Street View, you might notice your images are snapped to existing features that appear on the map (like pathways)... although this is not always correct.

With time, these queries and processing logic can be tuned, but working spacial data is tough (at least for someone that doesn't work full-time in this area).

### User interface

Viewing a single 360 in a panoramic viewer like [Panelleum is easy](https://pannellum.org/).

Introducing navigation arrows to allow user to move between photos with seamless (and not jerky) transitions is much more difficult.

Jumping between images on Street View and Mapillary often looks smooth, with a blur effect employed as the frame moves. This seemingly simple feature is actually a little more complex than it might first appear.

Finally, privacy. Street View and Mapillary employ blurring of personally identifiable information. Whilst there are a few open tools that can be used to do this, they're likely not as accurate and also require a fair bit of additional processing power, at cost, to run.

In short, trying to build this from scratch to a level that would be acceptable for a user would not be easy.

## A hacky plan...

I'm used to working with limitations like this, and weirdly, quite enjoy it.

Mapillary is a _fairly_ open tool in many regards;

* You can upload images and videos with common metadata formats (CAMM and GPMD) using existing open-source tooling ([Mapillary Tools](https://github.com/mapillary/mapillary_tools))
* It processes both images and video uploads and exposes the computed data server side for each sequence via their API
* There is no charge for accessing images via their API (unlike Street View which is eye-wateringly expensive)
* They offer an open-source panoramic browser ([MapillaryJS](https://mapillary.github.io/mapillary-js/) -- as used in Mapillary web)

With this in mind, I toyed with the idea of using Mapillary as a backend as follows...

1. allow user to upload photos or videos shot on GoPro via a Trek View web application
    * design decision to be made: is it acceptable to ask user to upload to Mapillary directly via Mapillary Desktop Uploader?
2. the Mapillary processed metadata for each sequence uploaded is stored in Trek View web application
3. a user views images in Trek View web application (which are loaded from Mapillary servers)

## The (big) risk of this plan...

The obvious risk with this plan, and I hate it, is that Facebook (aka Mapillary) can kill this product at anytime.

If Facebook shut-down Mapillary entierly or simply stop allowing users to upload or retrieve images for free my product is dead in the water.

As this is a hobby project which I'm quite happy to use as a learning experience I am reluctantly happy to overlook this issue. However, I do expect to wake up one day for my map to be broken. To be clear, if this was a commercial project, I would not proceed any further with this approach (I'm putting this warning here for the many I have spoken to considering some form of competing commercial product to Street View or Mapillary. You have been warned!).

## Researching if this is even possible

With a plan in mind, now I had to figure out if such an approach was feasible...

### How to handle uploads

To keep things simple for an MVP I began with the view a user should upload to Mapillary using the existing Mapillary Desktop Uploader (which is very good, and would be time consuming to emulate). This would require them to have an additional account, for Mapillary, but it would save me the potentially messy issue of upload.

That said, I wanted to first determine how this could be done if I did indeed decide to build the upload flow myself.

Unfortunately, Mapillary does not currently have a documented endpoint for uploading photos or videos directly. They do however have a command line tool to handle photo and video uploads, [Mapillary Tools](https://github.com/mapillary/mapillary_tools).

Install it as follows...

```shell
mkdir mapillary_tools
cd mapillary_tools
python3 -m venv mapillary_tools_venv
source mapillary_tools_venv/bin/activate
pip3 install mapillary_tools
mapillary_tools --help
```

#### Uploading Photos using Mapillary tools

Upload a timelapse sequence as follows;

```shell
mapillary_tools process_and_upload <DIRECTORY OF TIMELAPSE PHOTOS> \
  --user_name trekviewhq \
  --desc_path tmp/mapillary_description_file_1.json
```

A few things:

* `--user_name` I pass my Mapillary username using the flag. The command line will ask me for a username and password to actually authenticate before uploading any files.
* `--desc_path` I want to store a copy of the description file Mapillary tools creates to help identify the actual sequence Mapillary creates on the server. [Here's the schema of the JSON structure for the description file](https://github.com/mapillary/mapillary_tools/blob/main/schema/image_description_schema.json).


Here's an example of image processing:

```shell
mapillary_tools process_and_upload test_photos/tes-max-003g \
  --user_name trekviewhq \
  --desc_path tmp/mapillary_description_file_1.json
```

```txt
Extracting geotags from images: 100%|████| 418/418 [00:01<00:00, 290.19images/s]
Validating metadatas: 100%|███████████| 418/418 [00:00<00:00, 1226.21metadata/s]
2024-02-14 14:50:59,403 - INFO    - Checking upload status for 418 metadatas
2024-02-14 14:50:59,429 - INFO    - Check the description file for details: tmp/mapillary_description_file.json
2024-02-14 14:50:59,429 - INFO    -      418 image(s) read in total
2024-02-14 14:50:59,429 - INFO    -         418 image(s) are ready to be uploaded
Uploading IMAGE (1/2): 100%|███████████████| 1.11G/1.11G [01:24<00:00, 14.1MB/s]
Uploading IMAGE (2/2): 100%|█████████████████| 180M/180M [00:12<00:00, 15.0MB/s]
2024-02-14 14:52:43,150 - INFO    -        2  IMAGE sequences uploaded
2024-02-14 14:52:43,150 - INFO    -   1319.3M data in total
2024-02-14 14:52:43,151 - INFO    -   1319.3M data uploaded
```

Which creates a `tmp/mapillary_description_file_1.json` as follows (I've removed many of the track-points in the printed output below for brevity in this post);

```json
[
  {
    "filename": "/Users/dgreenwood/Downloads/mapillary_tools/test_photos/tes-max-003g/GSAC5840.JPG",
    "md5sum": "655077ac078951d8bb52c38e0f41fb31",
    "filetype": "image",
    "MAPLatitude": 50.8966219,
    "MAPLongitude": -0.5591297,
    "MAPCaptureTime": "2021_08_28_10_06_42_000",
    "MAPAltitude": 77.42,
    "MAPCompassHeading": {
      "TrueHeading": 133.54,
      "MagneticHeading": 133.54
    },
    "MAPSequenceUUID": "0",
    "MAPDeviceMake": "GoPro",
    "MAPDeviceModel": "GoPro Max",
    "MAPOrientation": 1
  },
  {
    "filename": "/Users/dgreenwood/Downloads/mapillary_tools/test_photos/tes-max-003g/GSAC5841.JPG",
    "md5sum": "c1bb9c5f383cfc2e838f56b4e9e0a03f",
    "filetype": "image",
    "MAPLatitude": 50.8966029,
    "MAPLongitude": -0.559098,
    "MAPCaptureTime": "2021_08_28_10_06_44_000",
    "MAPAltitude": 77.231,
    "MAPCompassHeading": {
      "TrueHeading": 136.336,
      "MagneticHeading": 136.336
    },
    "MAPSequenceUUID": "0",
    "MAPDeviceMake": "GoPro",
    "MAPDeviceModel": "GoPro Max",
    "MAPOrientation": 1
  },
  {
    "filename": "/Users/dgreenwood/Downloads/mapillary_tools/test_photos/tes-max-003g/GSAC5842.JPG",
    "md5sum": "1039fb7c265bf0a73f89cab21765077d",
    "filetype": "image",
    "MAPLatitude": 50.896584,
    "MAPLongitude": -0.5590694,
    "MAPCaptureTime": "2021_08_28_10_06_46_000",
    "MAPAltitude": 76.932,
    "MAPCompassHeading": {
      "TrueHeading": 134.813,
      "MagneticHeading": 134.813
    },
    "MAPSequenceUUID": "0",
    "MAPDeviceMake": "GoPro",
    "MAPDeviceModel": "GoPro Max",
    "MAPOrientation": 1
  }
]
```

Most of it is fairly self-explanatory (again, [schema here](https://github.com/mapillary/mapillary_tools/blob/main/schema/image_description_schema.json)). 

I do however want to point out the `MAPSequenceUUID` property inside each track-point object, as this is very useful for my use case.

From the schema;

```json
"MAPSequenceUUID": {
    "type": "string",
    "description": "Arbitrary key for grouping images",
    "pattern": "[a-zA-Z0-9_-]+"
}
```

Based on previous experience uploading photos to Mapillary, I know a sequence can only contain 500 images. Thus, if 600 images for a single timelapse, it will probably result in at least two Mapillary sequences. Of course, if I upload 5 distinct captures in one upload that are very far apart in distance or time then the actual sequences generated might be much higher.

Back to the point, this is not defining the actual Sequence UUID Mapillary will generate on the server.

In my sequence above of 418 images, 361 are marked with `"MAPSequenceUUID": "0"` and 57 with `"MAPSequenceUUID": "1"`. I'll come back to this later when I look at the processed images, just keep it in mind for now.

Onto videos...

#### Uploading Videos using Mapillary tools

The upload process for videos is very similar to photos;

```shell
mapillary_tools process_and_upload <DIRECTORY OF VIDEOS / SINGLE VIDEO FILE> \
  --user_name trekviewhq \
  --desc_path tmp/mapillary_description_file.json
```

For example, to upload a single video:

```shell
mapillary_tools process_and_upload test_vids/ESAD001v205vid7-trek_view_full_nadir-2_with-nadir.mp4 \
  --user_name trekviewhq \
  --desc_path tmp/mapillary_description_file_2.json
```

Below is an example of that file (I've removed many `MAPGPSTrack` objects for brevity in this post);

```json
[
  {
    "filename": "/Users/dgreenwood/Downloads/mapillary_tools/test_vids/ESAD001v205vid7-trek_view_full_nadir-2_with-nadir.mp4",
    "md5sum": "e67f95ffe0c10ed700506cadae70089a",
    "filetype": "gopro",
    "MAPGPSTrack": [
      [
        0,
        -13.942725,
        28.5107049,
        549.857,
        null
      ],
      [
        0,
        -13.9427281,
        28.5107056,
        550.076,
        null
      ],
      [
        200,
        -13.9427339,
        28.5107044,
        550.055,
        null
      ]
    ],
    "MAPDeviceMake": "GoPro",
    "MAPDeviceModel": "MAX"
  }
]
```

You'll see the output is different to photos, but much of the data is similar.

The `MAPGPSTrack` list contains;

* a time offset of the track-point relative to the start of the video
* Longitude of the track point
* Latitude of the track point
* Altitude of the track point in meters
* Camera angle of the track point, in degrees (no present in my track as it appears this is not extracted from GPMD by Mapillary tools)

For video uploads there is no specific mention of sequences in the description file.

#### How Uploads actually work in Mapillary tools

As I noted earlier, the Mapillary API docs doesn't mention upload endpoints at all, so of course I was intrigued; what is Mapillary Tools using to send the photos and videos to the Mapillary servers?

As the code for Mapillary Tools is open, this wasn't too hard to figure out. [Here's the part of the code responsible for uploads](https://github.com/mapillary/mapillary_tools/blob/main/mapillary_tools/upload_api_v4.py).

Whilst not documented [the actual upload flow can be deduced from mapillary_tools](https://github.com/mapillary/mapillary_tools/blob/main/mapillary_tools/upload_api_v4.py), which performs an upload of videos or images like so;

1. [Images in the upload are placed into a .zip file](https://github.com/mapillary/mapillary_tools/blob/main/mapillary_tools/commands/zip.py). This step does not apply to videos
2. [An upload session is created (for authenticated user) and upload begins to the upload endpoint (currently `https://rupload.facebook.com/mapillary_public_uploads`)](https://github.com/mapillary/mapillary_tools/blob/main/mapillary_tools/upload_api_v4.py)
3. [The upload session is closed](https://github.com/mapillary/mapillary_tools/blob/main/mapillary_tools/upload_api_v4.py)

The big security issue for baking Mapillary Tools into my own code is that [a user authenticates (to create a session) to Mapillary using their username and password](https://github.com/mapillary/mapillary_tools/blob/main/mapillary_tools/authenticate.py). When they do this on their own machine it poses no direct risk, only their machine sees the raw credentials. With security engineering being my day-job, I didn't want to go anywhere near handling user credentials in my own app.

So then I wondered, could I use OAuth tokens generated for `https://graph.mapillary.com/token` as [publicly documented](https://www.mapillary.com/developer/api-documentation/#request-authorization) with `https://rupload.facebook.com/mapillary_public_uploads`.

The answer appears to be, no, because I only ever received unauthorised errors trying this approach.

### Ignoring authentication issues, this approach is still problematic

For my software to work, I need to implement the ability to track Mapillary uploads through to the corresponding Mapillary sequence (on mapillary.com).

The first problem is, after closing the upload session, there is no direct link to what sequences (IDs) or images (IDs) are created from uploads.

This makes sense, because the Mapillary servers still needs to process the videos or images into actual Sequences.

That said, there could be a key to link an upload to the final Sequences created from it (e.g. many sequences might have the same upload key).

Looking a the Mapillary Tools code the Mapillary API does provide a response at step 3 (`https://graph.mapillary.com/finish_upload`) which includes a property called `cluster_id`.

However, I'm not sure if this is useful at all for what I need. Some quick Googling shows `clusterID` in [MapillaryJS relates to the globally unique id of the SfM cluster to which the image belongs](https://mapillary.github.io/mapillary-js/api/classes/viewer.Image/#clusterid). Keep this in mind... I'll validate if this is in anyway useful later.

### Using the Mapillary public API to link uploads to sequences

I have three key bits of known info;

1. The raw metadata in the photos/videos
2. The description JSON file created by Mapillary Tools (from the photos/videos metadata)
3. The Mapillary username (used to authenticate)

Looking at the filters on the Mapillary API, it should be possible to find the sequences...

```shell
GET https://graph.mapillary.com/images?creator_username=trekviewhq&fields=id,altitude,atomic_scale,camera_parameters,camera_type,captured_at,compass_angle,computed_altitude,computed_compass_angle,computed_geometry,computed_rotation,creator,exif_orientation,geometry,height,is_pano,make,model,width,sequence,thumb_original_url
```

Here's an example of the useful data that can be returned for an image (I have not included some `fields` not useful for this use-case;)

```json
{
    "data": [
        {
            "id": "1386976845208976",
            "altitude": 48.419,
            "atomic_scale": 0.86374780888523,
            "camera_type": "spherical",
            "captured_at": 1683629264000,
            "compass_angle": 43.370713358692,
            "computed_altitude": 2.7760077845305,
            "computed_compass_angle": 165.86355589155,
            "computed_geometry": {
                "type": "Point",
                "coordinates": [
                    4.1447180519741,
                    39.865000210806
                ]
            },
            "computed_rotation": [
                0.31811377810602,
                -1.8970785219694,
                2.3246601655456
            ],
            "creator": {
                "username": "trekviewhq",
                "id": "101176865463974"
            },
            "exif_orientation": 1,
            "geometry": {
                "type": "Point",
                "coordinates": [
                    4.1446528999722,
                    39.8650098
                ]
            },
            "height": 2880,
            "is_pano": true,
            "make": "GoPro",
            "model": "GoPro Max",
            "width": 5760,
            "sequence": "3bVlGmkTzsEOeK1BHvXuLq",
            "thumb_original_url": "https://scontent-lhr8-1.xx.fbcdn.net/m1/v/t6/An9aelHvqqY2XkOUZyZzNmd2jJScV5d6XLmm2dpvUeVYu2DVoT_udUrvuLf0nY6-v9fU1vT52dxcZakYMe9siluxFQfletHcBuZWQJ9pEzp71CZcHZ8Vu5Au-JDCs_YMIDJyvtFmhgiwgSMgzen1pCo?ccb=10-5&oh=00_AfDfuA6juyZ4fdt1ZlTYECDamUFLR5LhZCcHFDwloPn6zQ&oe=65FA9E45&_nc_sid=201bca"
        }
```

The good news is this endpoint also supports more filtering (than just `creator_username` used above). Those useful for my needs are;

* `start_captured_at`: string: filter images captured after. Specify in the  format. For example: "2022-08-16T16:42:46Z"
* `end_captured_at`: string: filter images captured before. Same format as "start_captured_at
* `make`: string, the manufacturer name of the camera device, can only be used when bbox parameter is used. Spaces are allowed.
* `model`: string, the model or product series name of the camera device, can only be used when bbox parameter is used. Spaces are allowed.

So using these, lets see if I can find the sequence ID for the photo I uploaded by taking the values in the description file.

In the description file my first photo has a `MAPCaptureTime` = `2021_08_28_10_06_42_000` and last photo `2021_08_28_10_20_36_000`. So I get `2021-08-28T10:06:42.000Z` and `2021-08-28T10:20:36.000Z` for `start_captured_at` and `end_captured_at` time respectively.

Note on video files, the Mapillary description JSON produced by Mapillary does not include actual times of video GPS. This data will need to be pulled from the metadata of the video itself. The start time of the video can be pulled from the first GPS time, and the end time can be calculated by pulling out the last GPS time in the metadata.

The `make` shown is `GoPro` and `model` `GoPro MAX` (this IS reported in the Mapillary description JSON)

Which gives me the following query;

```shell
GET 'https://graph.mapillary.com/images?creator_username=trekviewhq&make=GoPro&model=GoPro%20Max&start_captured_at=2021-08-28T10:20:36.000Z&end_captured_at=2021-08-28T10:06:42.000Z&fields=id,altitude,atomic_scale,camera_parameters,camera_type,captured_at,compass_angle,computed_altitude,computed_compass_angle,computed_geometry,computed_rotation,creator,exif_orientation,geometry,height,is_pano,make,model,width,sequence,thumb_original_url'
```

Returns 418 matches (the same number that were in my upload).

Here's the first tow results;

```json
{
    "data": [
        {
            "id": "1447075489494186",
            "altitude": 48.737,
            "atomic_scale": 1,
            "camera_type": "spherical",
            "captured_at": 1630146036000,
            "compass_angle": 4.008,
            "computed_altitude": -1.5965052107349,
            "computed_compass_angle": 7.4043872167977,
            "computed_geometry": {
                "type": "Point",
                "coordinates": [
                    -0.5463367458184,
                    50.901142238256
                ]
            },
            "computed_rotation": [
                1.5680816608427,
                -0.12745545191882,
                0.075540302347128
            ],
            "creator": {
                "username": "trekviewhq",
                "id": "101176865463974"
            },
            "exif_orientation": 1,
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -0.5463302,
                    50.9011354
                ]
            },
            "height": 2880,
            "is_pano": true,
            "make": "GoPro",
            "model": "GoPro Max",
            "width": 5760,
            "sequence": "d7DlxwUTp6JZaIWKHGtnMQ",
            "thumb_original_url": "https://scontent-lhr8-1.xx.fbcdn.net/m1/v/t6/An-46IbQjTAS-ZYc_D5swv4wqiJTu4-BhMPe-tlKH3893-VXviidgIvJV-U2aTG5ZxxPfmY-sVXXH7AxJtKY54JMKW4M5rC6mrQNN7YmsM19Bd0GUCmhqKu_KAPbCFtn8AJT8dHCgQXvFANTpsoQqA?ccb=10-5&oh=00_AfD3Yuz37KwIHQRBb71S0LtzSogkr-CbEqhUGy1pbz--Yw&oe=65FA7B9A&_nc_sid=201bca"
        },
        {
            "id": "1345201159514651",
            "altitude": 48.77,
            "atomic_scale": 1,
            "camera_type": "spherical",
            "captured_at": 1630146034000,
            "compass_angle": 4.008,
            "computed_altitude": -1.4189444249496,
            "computed_compass_angle": 7.3760874326204,
            "computed_geometry": {
                "type": "Point",
                "coordinates": [
                    -0.54633846065914,
                    50.901114286844
                ]
            },
            "computed_rotation": [
                1.5525942807035,
                -0.098468494308371,
                0.10331052653854
            ],
            "creator": {
                "username": "trekviewhq",
                "id": "101176865463974"
            },
            "exif_orientation": 1,
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -0.5463332,
                    50.9011084
                ]
            },
            "height": 2880,
            "is_pano": true,
            "make": "GoPro",
            "model": "GoPro Max",
            "width": 5760,
            "sequence": "d7DlxwUTp6JZaIWKHGtnMQ",
            "thumb_original_url": "https://scontent-lhr8-1.xx.fbcdn.net/m1/v/t6/An8PcHhIe7SM0dYrMofubAXgk7plu4RTOU6fKsWn1W5UavD6hMUOyA_ZYAnMnB5znTSVrC_IqB5WXYi0GRl4FOEtKqFpeNcTbkVNEilxum2rLsUQCn0QPW7-ZGanwbnIQWxsVJ84BybR2WqLEulGZg?ccb=10-5&oh=00_AfCbRokwDTBeH7rWHNewrHZ8Zjvi4en0rs1BCYjpocL2lw&oe=65FAA9FC&_nc_sid=201bca"
        }
```

Results appear to be sorted `captured_at` epoch time descending (put another way; the most recent photos first).

In this case I get the same number of published photos as were included in the upload. Of course this might not always be true. It is completely possible for some photos to be discarded if they fail Mapillary's automated checks (e.g. are corrupt).

The response also shows us 361 of the images belong to `"sequence": "s1lP92nCJwpxOaMEWRDX8b"` and 57 to `"sequence": "d7DlxwUTp6JZaIWKHGtnMQ"`. So this upload has created 2 sets of sequences.

As an aside, going back to the confusion about `ClusterID` returned in the upload session response, I wanted to see what each images `sfm_cluster` was.

```shell
GET 'https://graph.mapillary.com/images?creator_username=trekviewhq&make=GoPro&model=GoPro%20Max&start_captured_at=2021-08-28T10:20:36.000Z&end_captured_at=2021-08-28T10:06:42.000Z&fields=id%2Csfm_cluster'
```

Turns out the cluster ID of the response has nothing to do with SFM clusters as far as I can tell. There were XXX distinct `sfm_cluster.id` values as follows;

* `928869945563125` -- 57
* `783706370299876` -- 61
* `408458911861505` -- 75
* `1107885223743223` - 75
* `709720021284571` -- 75
* `1350423708991704` -- 75

In short `ClusterID` in upload != `sfm_cluster.id` returned via API, thus doesn't help us. Ah well.

My API query assumes two things:

1. I know the user which limits the images (which I do, b/c the assumption is they use Mapillary Tools)
2. the user does not have other photos shot at the same time. Now, this is not generally common; how can a user shoot many photos at the same time? True. Though keep in mind
    * some accounts are used for organisations. As such, one account may upload photos shot in different places by different people at the same time, or
    * a single person might shoot with two cameras, thus creating two sets of captures with the same time and similar GPS

2.2 is hard to solve for using the API, and I'd argue is an edge case that can be ignored.

2.1 is a little more common and possible to solve by improving our API request to include a bounding box `bbox`.

A bounding box (usually shortened to bbox) is an area defined by two longitudes and two latitudes;

```
bbox = min Longitude , min Latitude , max Longitude , max Latitude 
```

Using the `MAPLatitude` and `MAPLongitude` in the `mapillary_description_file_1.json` it's fairly trivial to create a bbox for the sequence path as follows;

```python
# python3 path2bbox.py
import json

# File paths
input_file_path = 'tmp/mapillary_description_file_1.json'

# Read the JSON data from the file
with open(input_file_path, 'r') as file:
    data = json.load(file)

# Extract MAPLatitude and MAPLongitude and store as a list of points
points = [[item["MAPLatitude"], item["MAPLongitude"]] for item in data]

def bounding_box_naive(points):
    """returns a list containing the bottom left and the top right 
    points in the sequence
    Here, we use min and max four times over the collection of points
    """
    min_lat = min(point[1] for point in points)
    min_lon = min(point[0] for point in points)
    max_lat = max(point[1] for point in points)
    max_lon = max(point[0] for point in points)

    return min_lon,min_lat,max_lon,max_lat

# Calculate the bounding box
bbox = bounding_box_naive(points)

# Print the bottom left and top right coordinates in the desired format
print(bbox)
```

Which prints;

```json
50.8963246,-0.5591297,50.9011354,-0.5463302
```

You can see this bounding box printed using this very handy website: http://bboxfinder.com/#50.896325,-0.559130,50.901135,-0.546330

Which gives us the following query;

```shell
GET 'https://graph.mapillary.com/images?bbox=50.8963246,-0.5591297,50.9011354,-0.5463302&creator_username=trekviewhq&make=GoPro&model=GoPro%20Max&start_captured_at=2021-08-28T10:20:36.000Z&end_captured_at=2021-08-28T10:06:42.000Z&fields=id%2Caltitude%2Catomic_scale%2Ccamera_parameters%2Ccamera_type%2Ccaptured_at%2Ccompass_angle%2Ccomputed_altitude%2Ccomputed_compass_angle%2Ccomputed_geometry%2Ccomputed_rotation%2Ccreator%2Cexif_orientation%2Cgeometry%2Cheight%2Cis_pano%2Cmake%2Cmodel%2Cwidth%2Csequence'
```

Which returns the same results as before, however is more accurate in terms of getting only the images that were part of a specific upload.

### The problem (and solution) with sequence states

One thing I've ignored here is the time it takes from Mapillary to process and publish an upload. Sometimes this can take hours, other times, days.

All of the above queries will only return data once the upload has been published. This is somewhat problematic, especially when it comes to failed uploads.

If a video or photo sequence uploaded is never published it will never return results, but you will be unable to tell if the upload actually failed or whether it's still being published.

In the Mapillary web app, you can see the state of an upload so this data must be exoposed somewhere...

<img class="img-fluid" src="/assets/images/blog/2023-02-17/mapillary-image-pipeline.jpg" alt="Mapillary API Web" title="Mapillary API Web" />

So I turned to Chrome Developer tools to watch the requests the Mapillary Web app made to the Mapillary APIs.

<img class="img-fluid" src="/assets/images/blog/2023-02-17/mapillary-web-api-requests-sm.jpg" alt="Mapillary API Chrome Dev tools" title="Mapillary API Chrome Dev tools" />

One of the first things I noticed when on the user page and opening the sidebar in the Mapillary web app, e.g. https://www.mapillary.com/app/user/trekviewhq, was that a request to get user info by passing username variable;

```shell
'https://graph.mapillary.com/graphql?doc=query getData($username: String!) {
      user_by_username(username: $username) {
        __typename created_at_seconds description id username stats {
            distance {
              km
              __typename
            }
            images
            __typename
          }
      }
    }&operationName=getData&variables={"username":"trekviewhq"}'
```

Here comes the first issue. This endpoint, like all Mapillary API endpoint required authentication. I tried to use our applications `access_token`, but were denied with an unauthorised response.

I then noticed Mapillary hardcoded their own `access_token` in all requests from the web app to the API (that access token = `MLY|4223665974375089|d62822dd792b6a823d0794ef26450398`). Using their `access_token` I was able to successfully get a response from this endpoint.

This returns a response like so;

```json
{
    "data": {
        "user_by_username": {
            "__typename": "User",
            "created_at_seconds": 1571314260,
            "description": "Unleash your inner explorer and travel the globe without leaving home.\nhttps://www.trekview.org",
            "id": "101176865463974",
            "username": "trekviewhq",
            "stats": {
                "distance": {
                    "km": 4189,
                    "__typename": "MLYUserDistanceStats"
                },
                "images": 1188082,
                "__typename": "MLYUserStats"
            }
        }
    },
    "extensions": {
        "is_final": true
    }
}
```

The endpoint returns a `data.user_by_username` object which contains `id` (needed for many of the other endpoints). The trekviewhq user id is `101176865463974`.

One of the endpoints I identified in the web app using the `user_id` in requests was the `getLatestActivity` query (also undocumented) which returns the uploads from the user sorted by most recent first (note, the response is paginated, you can use the `first` and `after` parameters to page through the response).

```shell
'https://graph.mapillary.com/graphql?doc=query getLatestActivity($id: ID!, $first: Int, $after: ID, $hide_after: Int) {
      fetch__User(id: $id) {
        id
        feed(first: $first, after: $after, hide_failed_sequences_after_days: $hide_after) {
          page_info {
            start_cursor
            end_cursor
            has_next_page
            has_previous_page
          }
          nodes {
            cluster_id type created_at_seconds captured_at_seconds thumb_url item_count image_id status initial_processing_status anonymization_status tiler_status error_code timezone
            __typename
          }
          __typename
        }
        __typename
      }
      __typename
    }&variables={"id":"101176865463974","first":200,"after":null,"hide_after":14}'
```

This request takes variables:

* `id`; the user ID obtained at last step (for trekviewhq = 101176865463974)
* `first`; the number of items (`nodes`) to be returned (I think) -- the Mapillary web app uses `50`
* `after`; seems to be some sort of ID but no idea for what -- for example, when scrolling to load more results in the sidebar, a request was made with the value for this variable `AQHRAAK9wQE4i9s139Bh_DJev3-CV-L_o9SmWd6lHElM3SI2-BW5djTqY-dphpwUdoskjd_4nBTCS58-oz6ni8RSbA`
* `hide_after`: I'm guessing this is for the UI to prompt how many results should be printed in the sidebar at anytime (e.g only show 14 results each time)

```json
"data": {
        "fetch__User": {
            "id": "101176865463974",
            "feed": {
                "page_info": {
                    "start_cursor": null,
                    "end_cursor": "AQHRfgT-8baMlgzS7qKgvm3juNSASu1WNkqnj17anFuWpEqAiSFMXQgOm2MfEWuzlOXm9US41e54dWHHQ2dpxJ-0uA",
                    "has_next_page": true,
                    "has_previous_page": false
                },
                "nodes": [
                    {
                        "cluster_id": "151552211058876",
                        "type": "UPLOAD",
                        "created_at_seconds": 1683759912,
                        "captured_at_seconds": 1683629036,
                        "thumb_url": "https://scontent-lhr8-1.xx.fbcdn.net/m1/v/t6/An8chQDyzKW9PWDh7tfNn_IHJgR1ZI_5wpxf7Il0WmsBHgjlyprG_1pc065QfZmMxD3wksqSjMa7Ho1SITzi08CHPOU2gDoylwby2gBHcJBkBP0Jw9mFCdvqgy-ed_MZvXE3v78K-ga7csmNBd_Qag8?stp=s256x128&ccb=10-5&oh=00_AfD40Tc6NQHagvbNx5y7rpQcuc41u_k8A8KZCyPJ_X9v5g&oe=65FB0E59&_nc_sid=201bca",
                        "item_count": 43,
                        "image_id": "202467835974822",
                        "status": "FINISHED",
                        "initial_processing_status": "FINISHED",
                        "anonymization_status": "FINISHED",
                        "tiler_status": "FINISHED",
                        "error_code": "UNSET",
                        "timezone": "EUROPE_MADRID",
                        "__typename": "ClusterLatestActivityItem"
                    },
```

In the response from this endpoint, a `data.feed.fetch__User.nodes` object with a `cluster_id` is included. This is the same `cluster_id` is also included in the response of the upload -- I now have a key to join upload and sequence in Mapillary!

With this information I can compare each upload reported by the API (each `node`) for a user against the upload `cluster_id`s for that user (that I got when the upload was closed). If I get a match I can link the sequence on Mapillary to an upload.

The `cluster_id` object also contains the upload state of the sequence (as shown in the Mapillary UI screenshot earlier in this post).

It shows four steps and their status; failed, success, or pending. If all four pass, the sequence gets published. Else an error will be reported, and an `error_code` printed.

1. Image ingestion
2. Image processing (`initial_processing_status`)
3. Map data processing (`anonymization_status`)
4. Map update (`tiler_status`)

This information allows us to 1) link images uploaded by a user to an Image ID / Sequence ID on Mapillary, and 2) track the status of sequence uploaded to Mapillary.

The response also contains a `error_code` property, allowing the ability to identify the reason for potential failures.

I also noticed a 

```shell
https://graph.mapillary.com/graphql?doc=query getNewSequences($username: String!) {
      user_by_username(username: $username) {
        id
        new_sequences {
          sequence_keys
          geojson
          __typename
        }
        __typename
      }
      __typename
    }&operationName=getNewSequences&variables={"username":"trekviewhq"}'
```

```json
{
    "data": {
        "user_by_username": {
            "id": "101176865463974",
            "new_sequences": {
                "sequence_keys": [],
                "geojson": "{\"type\":\"FeatureCollection\",\"features\":[]}",
                "__typename": "MLYNewSequencesData"
            },
            "__typename": "User"
        },
        "__typename": "Query"
    },
    "extensions": {
        "is_final": true
    }
}
```

Which doesn't appear too useful. I can't really deduce why the web app fires off this request.

I can see the `getData` request data is also used to query for images;

```shell
'https://graph.mapillary.com/graphql?doc=query getData($id: ID!) {
      fetch__MapImage(id: $id) {
        __typename id thumb(size: SIZE_256) { id url __typename }
      }
    }&variables={"id":1447075489494186}
'
```

Here I am requesting the same image ID that was returned from one of the documented endpoints...

```json
{
    "data": {
        "fetch__MapImage": {
            "__typename": "MapImage",
            "id": "1447075489494186",
            "thumb": {
                "id": "914990453696466",
                "url": "https://scontent-lhr8-1.xx.fbcdn.net/m1/v/t6/An-46IbQjTAS-ZYc_D5swv4wqiJTu4-BhMPe-tlKH3893-VXviidgIvJV-U2aTG5ZxxPfmY-sVXXH7AxJtKY54JMKW4M5rC6mrQNN7YmsM19Bd0GUCmhqKu_KAPbCFtn8AJT8dHCgQXvFANTpsoQqA?stp=s256x128&ccb=10-5&oh=00_AfDgtAbp_qQhqtXWIjVSX8ZEMWhSGsHRByWOGPjGsq6VEw&oe=65FB245A&_nc_sid=201bca",
                "__typename": "MLYMapImageThumbnail"
            }
        }
    },
    "extensions": {
        "is_final": true
    }
}
```


## In summary...

Mapillary Tools and the Mapillary API allow us to upload files, find the uploads using the Mapillary API endpoints, store the Mapillary metadata in Trek View, and then finally render the points/sequences on the map (rendering the actual images from the server).

However, if you've read this far you will probably be thinking; it's a very disjointed approach. My biggest worry is the requirement to use the undocumented Mapillary GraphQL API.

As such, I decided, as per my original inclination, it would be better not to handle any uploads via my app, at least for the MVP.

My plan, allow a user to import their sequences to Mapillary once they've been published. Said plan is still coming together, but lookout for my next post in two weeks where I'll divulge everything!