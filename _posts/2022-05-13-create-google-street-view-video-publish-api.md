---
date: 2022-05-13
title: "Creating a Video File Ready to be Uploaded to the Google Street View API"
description: "Using ffmpeg to create a video file with accompanying GPS telemetry."
categories: developers
tags: [Google, Street View, video, ffmpeg]
author_staff_member: dgreenwood
image: /assets/images/blog/2022-05-13/
featured_image: /assets/images/blog/2021-08-13/
layout: post
published: false
---

**Using ffmpeg to create a video file with accompanying GPS telemetry.**

[A few years ago I talked about creating a 360 video from frames](/blog/2021/turn-360-photos-into-360-video).

For example, [when you want to upload them to the Street View Publish API](/blog/2021/upload-video-street-view-publish-api).

In that last post I described how to upload the video, but only briefly touched on how to create the video. Well, a year late, here it is.

## Packing the video

Creating the video is fairly trivial, but you should keep a few things in mind.

Google Street View approve cameras generate videos at a framerate between 5 and 7 frames-per-second. I think part of this is due to battery efficiency when shooting, but I am not sure if this is for another reason (e.g. Google server prefers a slower framerate). As I could not find any docs on the subject, I will blindly follow what other camera manufacturers do and select 5 FPS as the video frame rate.

[According to many ad-hoc observations in various Google Street View groups](https://www.facebook.com/groups/366117726774216), Street View servers appear prefers shorter segments, often rejecting longer videos. Again, this is undocumented but I will play it safe and pack videos with a length not exceeding 60 seconds. 

This means at a frame rate of 5 FPS (0.2 seconds per frame), each video will contain a maximum of 300 frames (60 * 5).

So first thing, batch your extracted photos ([extract from a video first, if needed](/blog/2021/turn-360-video-into-timelapse-images-part-1))) into groups of 300.

Then pack into a video like so;

```shell
ffmpeg -r 5 -i PHOTO_%06d.jpg -c:v libx264 -pix_fmt yuv420p OUTPUT.mp4
```

I won't add any global metadata to the video yet, here's why...

## Adjusting the GPS

[As shown in the `gopro_fusion_timelapse_uploader.py` script I referenced here](/blog/2021/upload-video-street-view-publish-api),  positional information for the video can be passed separately alongside the video when uploading to Street View (as opposed to writing full telemetry into the video in [CAMM](https://developers.google.com/streetview/publish/camm-spec) or [GPMD](https://github.com/gopro/gpmf-parser) format).

By setting the framerate at a fixed 5 FPS we totally ignore the actual time spacing between photos, but that doesn't matter.

The real time spacing between photos does not matter when it comes to Street View (e.g. Google does not really care if photo was taken at the time reported).

However, it does matter the time spacing between GPS points matches the time spacing between the frames in the video.

I talked a bit about this problem with GoPro's [TimeWarp](/blog/2022/turn-gopro-timewarp-video-into-timelapse-images) and [TimeLapse](/blog/2022/turn-gopro-timelapse-video-into-timelapse-images) video modes previously.

Like these modes, what we have from the above command is usually a photo sped up from real-time. So like these modes, we need to modify the GPS times for the photos.

To do this, we can first extract all the `SubSecDateTimeOriginal`, `GPSLatitude`, `GPSLongitude`, and `GPSAltitude` values into a simple text file with the format

`SubSecDateTimeOriginal`,`GPSLatitude`,`GPSLongitude`,`GPSAltitude`

The first `SubSecDateTimeOriginal` value (for the first frame in the video) will remain unchanged.

We know second frame is 0.2 seconds later in the video, so the second frame `SubSecDateTimeOriginal` needs to be adjusted by adding 0.2 seconds to the first frames `SubSecDateTimeOriginal` value: `2020:04:13 15:37:22.444` + 0.2 = `2020:04:13 15:37:22.644`. 

The 3rd frame time will be photo 2 + 0.2 (`2020:04:13 15:37:22.844`), and so on.

## Creating a `rawGpsTimeline`

Once the timestamps have been updated to match the video frame rate, we now need to convert to a format Street View expects.

[In the `gopro_fusion_timelapse_uploader.py` script, a `rawGpsTimeline` object is created that looks like this](https://github.com/smarquardt/samples-for-svpub/blob/master/video_upload/gopro_fusion_timelapse_uploader.py#L309):


```json
"rawGpsTimeline": 
	{
		"latLngPair": {	
			"latitude": lat,
			"longitude": lon
		},
		"altitude": alt,
		"gpsRecordTimestampUnixEpoch": {
			"seconds": timestamp
		}
	},
	{
		"latLngPair": {	
			"latitude": lat,
			"longitude": lon
		},
		"altitude": alt,
		"gpsRecordTimestampUnixEpoch": {
			"seconds": timestamp
		}
	}
```

You'll notice the time value expects and epoch time, therefore the only thing left to do is convert the frame times calculated in the last step and print all the data in the json object format shown above that can be passed with the video.

## Add metadata to video (optional)

Finally, we can add some global metadata to the video to make it easier to work with in the future (though this step is entirely optional, and not required to upload the video to Street View).

This can be done by copying the metadata from the first frame, into the video file like so:

```shell
exiftool -TagsFromFile FIRSTFRAME.jpg "-all:all>all:all" OUTPUT.mp4
```

## Upload the file

[As I previously described here](/blog/2021/upload-video-street-view-publish-api).