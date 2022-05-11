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
4. Optionally [blur images](https://github.com/smarquardt/samples-for-svpub/blob/master/video_upload/gopro_fusion_timelapse_uploader.py#L263) if the [`--blur`](https://github.com/smarquardt/samples-for-svpub/blob/master/video_upload/gopro_fusion_timelapse_uploader.py#L29) flag is selected. Note, this is done Street View server side and [supports both blurFaces and blurLicensePlates](https://developers.google.com/streetview/publish/alpha/reference/rest/v1/photoSequence/create?authuser=1#blurringoptions).
3. Then [upload_video](https://github.com/smarquardt/samples-for-svpub/blob/master/video_upload/gopro_fusion_timelapse_uploader.py#L211) which [uploads the `.mp4` video created earlier](https://github.com/smarquardt/samples-for-svpub/blob/master/video_upload/gopro_fusion_timelapse_uploader.py#L367)
4. And finally, [publish_video](https://github.com/smarquardt/samples-for-svpub/blob/master/video_upload/gopro_fusion_timelapse_uploader.py#L243) which uploads the [geodata](https://github.com/smarquardt/samples-for-svpub/blob/master/video_upload/gopro_fusion_timelapse_uploader.py#L370) (the `rawGpsTimeline` created in step 1).

Not only does the `photoSequence` resource save the number of requests to the Google API to upload images, it is useful because it natively supports auto-connections and blurring not available for the `photo` resource (no more rejected blue lines!).

The full `photoSequence` resource looks like this.

```
{
  "id": string,
  "photos": [
    {
      object (Photo)
    }
  ],
  "uploadReference": {
    object (UploadRef)
  },
  "captureTimeOverride": string,
  "rawGpsTimeline": [
    {
      object (Pose)
    }
  ],
  "gpsSource": enum (GpsSource),
  "imu": {
    object (Imu)
  },
  "processingState": enum (ProcessingState),
  "failureReason": enum (ProcessingFailureReason),
  "blurringOptions": {
    object (BlurringOptions)
  }
}
```

After successful upload a full `photoSequence` blob will be returned with an `id` and nested `photos` object information (including `photoId`'s) for each image in your sequence.

The `photoSequence` then enters `ProcessingState`: `PENDING` or `PROCESSING`. This indicates it is going through all the backend Street View checks and processing steps before being published to Google Maps.

After the Street View processing completes (usually 72 hours, but potentially longer), the `photoSequence` should enter `ProcessingState`: `PROCESSED`.

However, processing can, and often does fail, producing one of the following potential [`ProcessingFailureReason` error](https://developers.google.com/streetview/publish/alpha/reference/rest/v1/photoSequence/create?authuser=1#processingfailurereason)

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

One final thing to be aware of; the `photoSequence` upload does not allow you to directly assign a `placeID` to photos. Thus, this needs to be done manually using the `photo` resource. Once the `photoSequence` upload is complete and `photoId`'s are returned, [you can update each `photo` 1-by-1 with the `place` information](https://developers.google.com/streetview/publish/reference/rest/v1/photo/update).

Ultimately, if you're working with a sequence with more than 30 images, go with the `photoSequence` method (and make sure any bad images are removed before submission to reduce the likelihood of failed checks), otherwise the `photo` approach [described here](/blog/2020/street-view-publish-api-quick-start-guide/) will work just fine.