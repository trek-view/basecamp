---
date: 2022-07-22
title: "Turning a photo or video footage into Strava activity"
description: "Use the telemetry captured by your camera to automatically create and upload an activity to Strava."
categories: developers
tags: [strava, gpx, gps]
author_staff_member: dgreenwood
image: /assets/images/blog/2022-07-22/strava-upload-file-meta.jpg
featured_image: /assets/images/blog/2022-07-22/strava-upload-file-sm.jpg
layout: post
published: true
---

**Use the telemetry captured by your camera to automatically create and upload an activity to Strava.**

Many of you cover a lot of human powered kilometers each week filming street-level footage.

A lot of people have told me that in addition to the imagery taken by the camera, they also run apps like Strava on their phone to track and share their activities.

Though it is completely possible to solely use the GPS recorded by the camera for creating Strava activities.

The flow is fairly simple; 1) get the GPS file created by the camera, and then 2) upload it to Strava. Let me show you how.

Firstly, you need to turn your timelapse photos or video file into a gpx file.

I have previously explained how to do this;

* For video: [Getting started with GoPro Telemetry to parse GPMD](/blog/2022/gopro-telemetry-exporter-getting-started)
* For photo:  [Turning a 360 Timelapse or Video into a GPX or KML track using exiftool](/blog/2022/extracting-gps-track-from-360-timelapse-video)

## Option 1: Using the Strava website

Choose this option if you have a few gpx files to upload.

You can upload the GPX file directly to the Strava web app.

Go to; Upload activity > Files

<img class="img-fluid" src="/assets/images/blog/2022-07-22/strava-upload-file.png" alt="Strava web gpx file upload" title="Strava web gpx file upload" />

After uploading, you can set the information about the activity and publish it.

<img class="img-fluid" src="/assets/images/blog/2022-07-22/strava-set-activity.png" alt="Strava web gpx set activity" title="Strava web gpx set activity" />

Once you click save, the activity should be visible in your Strava account.

## Option 2: Using the Strava API

Choose this option if you have lots of gpx files to upload, or want to provide others the ability to upload their own gpx files.

When building Explorer, I wanted users to be easily able to upload their sequences to Strava in one click.

Strava uses OAuth2 for authentication to their V3 API. I will not describe how to set this up in this post, [as it is explained in detail here](https://developers.strava.com/docs/authentication/). Where `<VALID TOKEN>` is referenced in this post, I am referring to a valid Oauth2 token.

You can create an activity using the [Upload Activity (createUpload) endpoint](https://developers.strava.com/docs/reference/#api-Uploads-createUpload).

This request takes a few parameters for this use-case:

* `file`: the path to the gpx file
* `name`: the name of the activity for the Strava UI (in Explorer, this is Sequence Name)
* `description`: the description of the activity for the Strava UI (in Explorer, this is Sequence Description)
* `data_type`: the format of the uploaded file. In this case is always `gpx`
* `external_id` (optional): when uploaded from Explorer, is the Explorer sequence URL filter

Here is an example request using Python and the requests module;

```python
url = 'https://www.strava.com/api/v3/uploads'
headers = {'Authorization': 'Bearer <VALID TOKEN>'}
payload = {'file': 'path/to/file.gpx', 'name': 'NAME', 'description': 'DESCRIPTION', 'data_type': 'gpx', 'external_id': 'https://explorer.trekview.org/?sequence_uuid=b976328b-6cb5-4578-a297-a7845d592a2c'}
r = requests.post(url=url, headers=headers, data=payload)
```

Explorer also has a concept of transport type (the method of transport used to capture the sequence).

Each transport type in Explorer maps to an [SportType in Strava](https://developers.strava.com/docs/reference/#api-models-SportType). For example, the transport type `Earth > Hike` in Explorer maps to the Strava sport type `Walk`

To update the activity on Strava with the activity details (the transport type used) the [Update Activity (updateActivityById) endpoint](https://developers.strava.com/docs/reference/#api-Activities-updateActivityById) on Strava can be used by passing the parameter;

* `sport_type` = Strava SportType defined in transport type

Here is an example request (setting the `sport_type` as `Walk`) using Python and the requests module;

```python
url = 'https://www.strava.com/api/v3/activities/<ID>'
headers = {'Authorization': 'Bearer <VALID TOKEN>'}
payload = {'sport_type': 'Walk'}
r = requests.put(url=url, headers=headers, data=payload)
```

Now the activity should be public in the authenticated users Strava profile.
