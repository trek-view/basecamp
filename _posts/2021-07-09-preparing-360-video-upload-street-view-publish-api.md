---
date: 2021-07-09
title: "Preparing a Video Upload for the Street View Publish API"
description: "All third-party Street View tools are built around the Google Street View Publish API. Here's a closer look at how it works for uploading long sequences."
categories: developers
tags: [Google, Street View]
author_staff_member: dgreenwood
image: /assets/images/blog/2021-07-09/photosequence-google-street-view-api-meta.jpg
featured_image: /assets/images/blog/2021-07-09/photosequence-google-street-view-api-sm.jpg
layout: post
published: true
---

**All third-party Street View tools are built around the Google Street View Publish API. Here's a closer look at how it works for uploading long sequences.**

Those who use our Map the Paths Uploader will be familiar with [its ability to upload your sequences to Google Street View](https://www.mapthepaths.com/uploader).

Those of you who are even more techie might know we use the [Google Street View Publish API's](https://developers.google.com/streetview/publish) `photo` resource to upload each image ([developer docs here](https://guides.trekview.org/mtp-desktop-uploader/developer-docs/integrations/google-street-view)).

Those of you who like to take things apart might enjoy [a previous post of mine introducing exactly how the Street View API and `photo` resource works](/blog/2020/street-view-publish-api-quick-start-guide/).

In short, currently the Map the Paths Uploader works with the Google Street View Publish API like so:

1. The Uploader creates a sequence of photo files from videos/photos selected
2. User selects to the Street View integration, and assigns a [`placeID`](/blog/2019/place-id-google-street-view/) to the sequence.
2. The Uploader uploads all photos in a sequence 1-by-1 to Street View using the [`photo` resource](https://developers.google.com/streetview/publish/alpha/reference/rest/v1/photo?authuser=1#resource:-photo).
4. The Street View API returns information about the `photo` on Google (including its `photoId`. The Uploader stores the returned `photoId` for each image in the sequence.
5. Around 72 hours later the [`mapsPublishStatus`](https://developers.google.com/streetview/publish/alpha/reference/rest/v1/photo?authuser=1#mapspublishstatus) of each photo moves to `PUBLISHED` or `REJECTED_UNKNOWN`.
6. The Uploader syncs this information with [Map the Paths Web](https://www.mapthepaths.com/).

This process has worked _fairly_ well to date, but it starts to cause issues for tours of 30+ images. There are a few reasons for this:

* [Google imposed API limits put restrictions on the amount of data that can be uploaded per day](https://stackoverflow.com/a/59987499)
* Blue line connections don't work particularly well (resulting in lots of single photos on the Google Maps)
* Lots of black images returned (the `photoId` returned by Street View does not resolve to a photo and presents a black screen to a user)

As more Map the Paths trekkers upload longer tours, it became clear we needed to take a look at alternative methods, and discovered Google offered an alternative resource named [`photoSequence`](https://developers.google.com/streetview/publish/alpha/reference/rest/v1/photoSequence) on the Street View Publish API.

Officially this is still in alpha phase (you will need to request access), but there are some good examples of how it's used in the wild, [including this example on GitHub](https://github.com/smarquardt/samples-for-svpub/blob/master/video_upload/gopro_fusion_timelapse_uploader.py). 

That `gopro_fusion_timelapse_uploader.py` script converts a series of timelapse photos into a `photoSequence` (packaging all the photos into a single `.mp4` file for uploading).

Not only does the `photoSequence` resource save the number of requests to the Google API to upload images, it is useful because it natively supports auto-connections and blurring not available for the `photo` resource (no more rejected blue lines!).

Looking at the script in more detail, the overall flow works like so;

1. Extract [extract_geodata](https://github.com/smarquardt/samples-for-svpub/blob/master/video_upload/gopro_fusion_timelapse_uploader.py#L275) from images (gps timestamp, latitude, longitude, altitude) to create a [`rawGpsTimeline`](https://github.com/smarquardt/samples-for-svpub/blob/master/video_upload/gopro_fusion_timelapse_uploader.py#L317).
2. Then [convert_video](https://github.com/smarquardt/samples-for-svpub/blob/master/video_upload/gopro_fusion_timelapse_uploader.py#L321) which takes images and creates an .mp4 file from the photos using ffmpeg.
4. Optionally [blur images](https://github.com/smarquardt/samples-for-svpub/blob/master/video_upload/gopro_fusion_timelapse_uploader.py#L263) if the [`--blur`](https://github.com/smarquardt/samples-for-svpub/blob/master/video_upload/gopro_fusion_timelapse_uploader.py#L29) flag is selected. Note, this is done Street View server side and [supports both blurFaces and blurLicensePlates](https://developers.google.com/streetview/publish/alpha/reference/rest/v1/photoSequence/create?authuser=1#blurringoptions).
3. Then [upload_video](https://github.com/smarquardt/samples-for-svpub/blob/master/video_upload/gopro_fusion_timelapse_uploader.py#L211) which [uploads the `.mp4` video created earlier](https://github.com/smarquardt/samples-for-svpub/blob/master/video_upload/gopro_fusion_timelapse_uploader.py#L367)
4. And finally, [publish_video](https://github.com/smarquardt/samples-for-svpub/blob/master/video_upload/gopro_fusion_timelapse_uploader.py#L243) which uploads the [geodata](https://github.com/smarquardt/samples-for-svpub/blob/master/video_upload/gopro_fusion_timelapse_uploader.py#L370) (the `rawGpsTimeline` created in step 1).

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

<table>
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

## Coming soon to Map the Paths Uploader...

<img class="img-fluid" src="/assets/images/blog/2021-07-09/mapthepaths-uploader-spacing-sm.jpg" alt="Map the Paths Uploader image spacing" title="Map the Paths Uploader image spacing" />

We're planning to migrate from `photo` to `photoSequence` when uploading final sequences to Google Street View in the Map the Paths Uploader after making any desired edits or deletions.

As noted, the Uploader supports the `photo` upload resource at present, but if you've got a slightly longer sequence it is worth holding out for a few more weeks when we'll ship the more stable `photoSequence` approach in the next version (v0.4) of the [Map the Paths Uploader](https://www.mapthepaths.com/uploader).

[Stay tuned for the announcement by signing up for Trek View updates](https://landing.mailerlite.com/webforms/landing/i5h6l6)!