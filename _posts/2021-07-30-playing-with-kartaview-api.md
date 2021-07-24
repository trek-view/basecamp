---
date: 2021-07-16
title: "A Quick Start Guide to the KartaView API"
description: "Here's notes from my research of the KartaView API whilst planning an integration for Map the Paths."
categories: developers
tags: [KartaView, Map the Paths]
author_staff_member: dgreenwood
image: /assets/images/blog/2021-07-30/
featured_image: /assets/images/blog/2021-07-30/
layout: post
published: false
---

**`POST KartaView`**

[Last week I took a brief look at KartaView, a street-level imagery platform](/blog/2021/getting-started-with-kartaview).

You will have read my recent posts documenting the [Google Street View Publish](/blog/2021/2preparing-360-video-upload-street-view-publish-api) and [Mapillary v4](/blog/2021/migrating-from-mapillary-api-v3-to-v4) API's.

In my research of their API [I've been exploring their documentation](http://doc.kartaview.org/). This post is a short write up of what I've found.

The core principal of KartaView are [`sequence`](http://doc.kartaview.org/#tag/Sequence)'s.

A sequence is a collection of photos captured continuously by an OpenStreetCam user. 

Looking inside the sequence object gives a good overview of what's exposed (I've removed some of the key/values not valuable to this write up):

```
"data": [
	{
		"id": 112,
		"dateAdded": "2016-04-15 23:05:32",
		"dateProcessed": "2016-04-16 09:00:45",
		"imageProcessingStatus": "PROCESSING_FINISHED",
		"isVideo": 0,
		"currentLat": "37.649595",
		"currentLng": "-122.097050",
		"nwLat": "14.549589",
		"nwLng": "121.236783",
		"seLat": "14.495225",
		"seLng": "121.217797",
		"countryCode": "US",
		"stateCode": "OH",
		"address": "Nimitz Freeway, Hayward, CA, United States of America, US",
		"sequenceType": "VDB",
		"cameraParameters": [],
		"blurVersion": "v2",
		"blurBuild": "GoPro Fusion",
		"deviceName": "GoPro Fusion",
		"countActivePhotos": "198",
		"distance": "4.90",
		"metaDataFileName": "2133_351f7_5711498c72a9d.txt",
		"metaDataFilePath": "2016/4/15/2133_351f7_5711498c72a9d.txt",
		"metaDataFileUrl": "https://storage100.openstreetcam.org/files/photo/2016/4/15/2133_351f7_5711498c72a9d.txt",
		"clientTotal": "11",
		"obdInfo": "0",
		"platformName": "iPhone7Plus",
		"platformVersion": "10.3.2",
		"appVersion": "1.5.5",
		"matched": "yes",
		"uploadSource": "iPhone7Plus",
		"countMetadataPhotos": "198",
		"countMetadataVideos": "4",
		"quality": "10",

	}
]
```

`sequences` can be created using [`photo`](http://doc.kartaview.org/#tag/Photo)'s and [`video`](http://doc.kartaview.org/#tag/Video)'s.

It appears KartaView prefers `photo` uploads, noting for the `video` endpoint:

> Mobile clients upload imagery data as video files to optimize compression. Data will be available after processing as photos.
>
> Usage of this resource for retrieving imagery is advisable only for debugging purposes.

I am assuming KartaView processes videos to photos server side, as Street View does. So once a video is uploaded  


"sequenceId": 30336,
"sequenceIndex": 112

You can http://doc.kartaview.org/#operation/photoCreate



