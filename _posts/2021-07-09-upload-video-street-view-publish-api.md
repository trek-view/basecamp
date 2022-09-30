---
date: 2021-07-09
title: "Upload a Video to the Street View Publish API"
description: "All third-party Street View tools are built around the Google Street View Publish API. Here's a closer look at how it works for uploading long sequences."
categories: developers
tags: [Google, Street View, video]
author_staff_member: dgreenwood
image: /assets/images/blog/2021-07-09/photosequence-google-street-view-api-meta.jpg
featured_image: /assets/images/blog/2021-07-09/photosequence-google-street-view-api-sm.jpg
layout: post
published: true
---

**All third-party Street View tools are built around the Google Street View Publish API. Here's a closer look at how it works for uploading long sequences.**

Google offers a coupld of ways to do this using the [Google Street View Publish API's](https://developers.google.com/streetview/publish)

## Photo upload

The `photo` resource can be used to upload single images.

Those of you who like to take things apart woll enjoy [a previous post of mine introducing exactly how the Street View API and `photo` resource works](/blog/2020/street-view-publish-api-quick-start-guide/).

This works well for individual photos, or for smaller sequences. However it starts to cause issues for tours of 30+ images. There are a few reasons for this:

* [Google imposed API limits put restrictions on the amount of data that can be uploaded per day](https://stackoverflow.com/a/59987499)
* Blue line connections don't work particularly well (resulting in lots of single photos on the Google Maps)
* We've noticed lots of black images can be returned (the `photoId` returned by Street View does not resolve to a photo and presents a black screen to a user)

## Video upload

The [`photoSequence`](https://developers.google.com/streetview/publish/alpha/reference/rest/v1/photoSequence) resource allows you to upload video files to be turned into mapped photos.

Officially this is still in alpha phase (you will need to request access), but there are some good examples of how it's used in the wild, [including these examples on GitHub];

* [Samples for Street View Publish API](https://github.com/smarquardt/samples-for-svpub)
* [GoPro Street View](https://github.com/llarco/gopro-streetview)

The [`gopro_fusion_timelapse_uploader.py`](https://github.com/smarquardt/samples-for-svpub/blob/master/video_upload/gopro_fusion_timelapse_uploader.py) script in the Samples for Street View Publish API repo linked above converts a series of timelapse photos into a `photoSequence` (packaging all the photos into a single `.mp4` file for uploading).

Looking at the script in more detail, the overall flow works like so;

1. Extract [extract_geodata](https://github.com/smarquardt/samples-for-svpub/blob/master/video_upload/gopro_fusion_timelapse_uploader.py#L275) from images (gps timestamp, latitude, longitude, altitude) to create a [`rawGpsTimeline`](https://github.com/smarquardt/samples-for-svpub/blob/master/video_upload/gopro_fusion_timelapse_uploader.py#L317).
2. Then [convert_video](https://github.com/smarquardt/samples-for-svpub/blob/master/video_upload/gopro_fusion_timelapse_uploader.py#L321) which takes images and creates an .mp4 file from the photos using ffmpeg.
3. Then [upload_video](https://github.com/smarquardt/samples-for-svpub/blob/master/video_upload/gopro_fusion_timelapse_uploader.py#L211) which [uploads the `.mp4` video created earlier](https://github.com/smarquardt/samples-for-svpub/blob/master/video_upload/gopro_fusion_timelapse_uploader.py#L367)
4. And finally, [publish_video](https://github.com/smarquardt/samples-for-svpub/blob/master/video_upload/gopro_fusion_timelapse_uploader.py#L243) which uploads the [geodata](https://github.com/smarquardt/samples-for-svpub/blob/master/video_upload/gopro_fusion_timelapse_uploader.py#L370) (the `rawGpsTimeline` created in step 1).

Not only does the `photoSequence` resource save the number of requests to the Google API to upload images, it is useful because it natively supports auto-connections and blurring not available for the `photo` resource (no more rejected blue lines!).

Once any required processing is complete (steps 1 and 2 above), to upload the video (step 3) a request to open an upload session is needed.

```shell
POST https://streetviewpublish.googleapis.com/v1/photoSequence:startUpload
```

This will return an upload URL which will look something like this;

```json
{
  "uploadUrl": "https://streetviewpublish.googleapis.com/media/user/<account_id>/photo/<uploadReference>"
}
```

e.g. https://github.com/smarquardt/samples-for-svpub/blob/master/video_upload/gopro_fusion_timelapse_uploader.py#L192

The raw video should then be uploaded to the `uploadUrl` value returned by the previous request.

e.g. https://github.com/smarquardt/samples-for-svpub/blob/master/video_upload/gopro_fusion_timelapse_uploader.py#L211

On successful upload, [the video can be published by using the create method](https://developers.google.com/streetview/publish/reference/rest/v1/photoSequence/create).

This is where the GPS data can be added (if it is not natively held in the video as a [CAMM track](https://developers.google.com/streetview/publish/camm-spec)).

To do this an `inputType` request parameter should be used which will always be `"VIDEO"`.

With the body of the request [containing a variety of available parameters](https://developers.google.com/streetview/publish/reference/rest/v1/photoSequence/create#InputType), the ones below being critical if CAMM telemetry is not embedded in the video;

```json
{
  "rawGpsTimeline": [
    {
      "latLngPair": {
        "latitude": 90,
        "longitude": 90
      },
      "altitude": 90,
      "gpsRecordTimestampUnixEpoch": "2014-10-02T15:01:23.045123456Z"
    },
    {
      "latLngPair": {
        "latitude": 80,
        "longitude": 80
      },
      "altitude": 80,
      "gpsRecordTimestampUnixEpoch": "2014-10-02T15:01:24.045123456Z"
    }
  ],
  "captureTimeOverride": {
    "seconds": "2014-10-02T15:01:23.045123456Z"
  },
  "uploadReference": {
    "uploadUrl": "https://streetviewpublish.googleapis.com/media/user/<account_id>/photo/<uploadReference>"
  }
}
```

Where `captureTimeOverride.seconds` is the first photo time, `uploadReference.uploadUrl` is the URL where the video was uploaded to previously, and the `rawGpsTimeline` contains the available GPS information from the captured sequence (usually generated from a GPX file).

e.g. https://github.com/smarquardt/samples-for-svpub/blob/master/video_upload/gopro_fusion_timelapse_uploader.py#L243

Note, if the uploaded video contains a CAMM telemetry track you can simply pass the `uploadReference.uploadUrl` in the body of the request (no GPS information is required).

After publishing a `photoSequence`, you will recieve a response with the `processingState`.

```json
{
    "name": "<SEQUENCE_ID>", 
    "response": {
        "@type": "type.googleapis.com/google.streetview.publish.v1.PhotoSequence", 
        "id": "<SEQUENCE_ID>", 
        "processingState": "PROCESSING", 
        "uploadTime": "2020-09-26T20:11:01.878Z"
        }
    }
}
```

When the video is uploaded the `photoSequence` enters `ProcessingState`: `PENDING`. When the sequence is published (by uploading GPS information, if required) it enters `ProcessingState`: `PROCESSING` (note, videos uploaded containing CAMM telemetry will automatically enter this state).

After the Street View processing completes (usually 72 hours, but potentially longer), the `photoSequence` should enter `ProcessingState`: `PROCESSED`.

However, processing can, and often does fail, producing one of the following potential [`ProcessingFailureReason` error](https://developers.google.com/streetview/publish/alpha/reference/rest/v1/photoSequence/create?authuser=1#processingfailurereason).

<table class="tableizer-table">
<thead><tr><th>`ProcessingFailureReason` value</th><th>Error Description</th></tr></thead><tbody>
 <tr><td>PROCESSING_FAILURE_REASON_UNSPECIFIED</td><td>The failure reason is unspecified, this is the default value.</td></tr>
 <tr><td>LOW_RESOLUTION</td><td>Video frame's resolution is too small.</td></tr>
 <tr><td>DUPLICATE</td><td>This video has been uploaded before.</td></tr>
 <tr><td>INSUFFICIENT_GPS</td><td>Too few GPS points.</td></tr>
 <tr><td>NO_OVERLAP_GPS</td><td>No overlap between the time frame of GPS track and the time frame of video.</td></tr>
 <tr><td>INVALID_GPS</td><td>GPS is invalid (e.x. all GPS points are at (0,0))</td></tr>
 <tr><td>FAILED_TO_REFINE_POSITIONS</td><td>The sequence of photos could not be accurately located in the world.</td></tr>
 <tr><td>TAKEDOWN</td><td>The sequence was taken down for policy reasons.</td></tr>
 <tr><td>CORRUPT_VIDEO</td><td>The video file was corrupt.</td></tr>
 <tr><td>INTERNAL</td><td>A permanent failure in the underlying system occurred.</td></tr>
 <tr><td>INVALID_VIDEO_FORMAT</td><td>The video format is invalid or unsupported.</td></tr>
</tbody></table>

One downside of using the `photoSequence` upload is that if one image in the uploaded video fails the Street View server side checks, the entire `photoSequence` will fail. As opposed to `photo` upload, where a single photo failure will not result in an entire failure for all photos uploaded in the sequence.

Ultimately, if you're working with a sequence with more than 10 images, go with the `photoSequence` method (and make sure any bad images are removed before packing as a video to reduce the likelihood of failed checks), otherwise the `photo` approach [described here](/blog/2020/street-view-publish-api-quick-start-guide/) is probably preferable.