---
date: 2023-01-20
title: "Google Street View Studio versus the Mapillary Desktop Uploader"
description: "In this post I will compare how the two products stack up with the aim of using the best bits of both to build our own 360 video uploader."
categories: guides
tags: [Google, Street View, Mapillary, Facebook]
author_staff_member: dgreenwood
image: /assets/images/blog/2023-01-20/trek-view-Street-View-Studio.png
featured_image: /assets/images/blog/2023-01-20/trek-view-Street-View-Studio.png
layout: post
published: true
---

**In this post I will compare how the two products stack up with the aim of using the best bits of both to build our own 360 video uploader.**

For a very long time I've been trying to build a pipeline that can take images or video recorded on both 360 and regular action cameras and render them on a map (in a similar way to Street View).

Hopefully you've found some of the posts on this blog somewhat useful if attempting something similar yourself.

Two of my biggest inspirations in this process have been Google's Street View and Facebook's Mapillary, both of whom have their own upload pipelines and map products.

Recently, the Mapillary team have shipped some big updates to their Desktop Uploader. Likewise, Google launched a much more intuitive product to upload content, Street View Studio.

In this post I'll compare the two, and make some educated guesses as to how both companies go from upload to publish (which we could use in our implementation!).

## Google Street View Studio

<img class="img-fluid" src="/assets/images/blog/2023-01-20/trek-view-Street-View-Studio.png" alt="Street View Studio" title="Street View Studio" />

[https://streetviewstudio.maps.google.com/](https://streetviewstudio.maps.google.com/)

* Video metadata standards supported: CAMM (mp4), GPMF (mp4)
* Image metadata standards supported: only video uploads supported

[Google will kill off the Street View mobile app in March of this year (2023)](https://www.theverge.com/2022/11/1/23435733/google-maps-street-view-standalone-app-discontinue-support). The app did allow for uploads to Street View, but was only really useful for content taken on a phone (although it can upload video files shot on other cameras with some success).

For those wanting to contribute Street View images to Google Maps, the relatively new Street View Studio web app is much more suited to uploading action camera footage.

Street View Studio accepts footage from almost all action cameras. Most major brands use the CAMM standard, except GoPro who use their own GPMF format. Both are supported.

Where Street View Studio lacks functionality is the ability to upload a series of timelapse images. It only supports video file uploads. [At the end of last year I explained how to turn 360 timelapse images into geo-tagged videos](/blog/2021/injecting-camm-gpmd-telemetry-videos-part-1-introduction) that can then be uploaded to Street View Studio.

In testing Street View Studio with GoPro MAX videos, the success rate of getting a blue line on Google Maps is high. 

My assumption is the images go through a few stages in Google's pipeline;

1. GPS in video telemetry checked for issues ([list of possible errors here](https://developers.google.com/streetview/publish/reference/rest/v1/photoSequence/create?authuser=2)). In most cases, insufficient or [noisy GPS](/blog/2020/gps-101) will lead to upload errors.
2. Extracted GPS is compared against known paths (e.g. roads, footpaths, etc.). Where the GPS is similar enough to an existing path, Google snaps the video positions to that path.
3. The uploaded video is turned into images spaced at set distances ([probably using some sort of ffmpeg pipeline](/blog/2021/turn-360-video-into-timelapse-images-part-1)) and extracted images geo-tagged.
4. Blue line published

There are a few complaints with Google snapping GPS tracks to an existing path on Google Maps on the [Google Street View Trusted Photographers Facebook Group](https://www.facebook.com/groups/611098829065834).

When snap-to path is used, which is only in a handful of cases, it's not always completely accurate. I suspect for a similar reason, sometimes a blue line is also broken in places with individual photo dots placed on the map between blue lines.

It's worth mentioning that the Street View upload pipelines were historically built around mapping roads where a snap-to functionality can prove very useful because it can account for lanes on a road, direction of travel, etc, which are all specific to road infrastructure.

For the types of images we shoot - usually on footpaths, trails or waterways - the underlying Google Maps data does not always know these paths always exist. These paths are also very different to roads -- a dirt footpath might be only 50 cm wide, there are no designated lanes or direction of travel, etc.

In my experience, this is the cause of the blue line processing errors at step two stem from.

Mapillary takes a different approach to this problem with their Desktop Uploader...

## Facebook Mapillary Desktop Uploader

<img class="img-fluid" src="/assets/images/blog/2023-01-20/trek-view-mapillary-desktop-uploader.png" alt="Mapillary Desktop Uploader" title="Mapillary Desktop Uploader" />

[https://www.mapillary.com/desktop-uploader](https://www.mapillary.com/desktop-uploader)

* Video metadata standards supported: CAMM (mp4), GPMF (mp4)
* Image metadata standards supported: EXIF (jpg)

The Mapillary Desktop Uploader has two big differences to Street View Studio; 1) it's a desktop app (you cannot upload images via Mapillary web), and 2) it accepts both video (exactly the same video standards as GSV Studio) and timelapse images.

My assumption is the Mapillary Desktop Uploader is a UI built on [Mapillary Tools](https://github.com/mapillary/mapillary_tools) which allows for [video and image uploads via the command line](https://github.com/mapillary/mapillary_tools#process-and-upload). 

Once image or video has been uploaded to the Mapillary servers, I believe they go through a similar pipeline to Street View before publication with two major exceptions.

Firstly Mapillary doesn't try and adjust the GPS reported by the video.

<img class="img-fluid" src="/assets/images/blog/2023-01-20/mapillary-uploader-gps-issues.png" alt="Mapillary GPS Errors" title="Mapillary GPS Errors" />

Once the frames are extracted they are geo-tagged. Mapillary accepts the GPS in the video as accurate and will simply assign the location reported in the video to the extracted frame. As shown above, this can cause GPS points be mapped incorrectly. Often this occurs for one or two points, causing those two points to jump hundreds of meters off-line in a sequence.

You cannot edit the sequence in the Mapillary web app once it has been uploaded, nor can you adjust for it in the Uploader. The only option is to delete the entire sequence once it has been published should there be any errors.

To fix these issues, you can pre-process the videos using Mapillary Tools, before using the Desktop Uploader.

Mapillary Tools has a process function that creates a JSON array of objects ([Image Description file](https://github.com/mapillary/mapillary_tools#image-description)) that describes metadata for each image or video. Users may edit the image description file before passing them to the upload command to remove them from the upload (or edit the GPS as they choose). For example;

```shell
# Remove images outside the bounding box 
mapillary_tools process MY_IMAGE_DIR | \
    ./filter_by_bbox.py 5.9559,45.818,10.4921,47.8084  | \
    ./map_match.py > /tmp/mapillary_image_description.json
```

Whilst the snap-to function is temperamental with Google Maps data, it's worth pointing out the Mapillary base map relies heavily on [Open Street Map data](https://www.openstreetmap.org/#map=5/54.910/-3.432), which is much richer in terms of "off-road" paths and is thus much more likely to yield better results.

The second difference is that Mapillary has a distinct concept of sequences where each sequence is unique to a user.

Mapillary breaks long uploads (where more than 500 images exist) into multiple sequences. Google simply maps individual images, and connects them to nearby images on Street View, regardless of who uploaded them. This can be seen in the responses of the [GET Photo Street View Publish endpoint](https://developers.google.com/streetview/publish/reference/rest/v1/photo?authuser=2#Photo);

```json
  "connections": [
    {
      object (Connection)
    }
  ],
```

## What I've learned from this exercise

Both approaches offer there own advantages and trade-offs as a result. In the design of our uploader and web app, we've decided to take inspiration from both Google and Facebook;

* Doing some basic pre-processing locally in a desktop app reduces the load server side (thus reducing costs). However, we're aware supporting a desktop app is much harder than a web app.
* Image uploads should be allowed because many people still shoot in timelapse mode.
* Adding the ability to pre-process images or videos before mapping would be highly valuable. If it was possible to poor quality images, remove noisy images, smooth images to fit the line, or add a snap-to path function (using OSM date) with the ability to approve or reject the snapped edits, the final published data will be much more accurate and also give users more control (the assumption being they are motivated to accurately map images)
* The concept of sequences in Mapillary is constraining. It's useful to keep track of images that belong to the same upload as a sequence, but Google's approach of linking images using connections based on proximity to each other allows for a more fluid user experience when moving between images.

Hopefully we can incorporate these ideas into our own uploader soon!