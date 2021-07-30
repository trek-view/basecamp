---
date: 2021-07-16
title: "A Quick Start Guide to the KartaView API"
description: "Here's notes from my research of the KartaView API whilst planning an integration for Map the Paths."
categories: developers
tags: [KartaView, Map the Paths]
author_staff_member: dgreenwood
image: /assets/images/blog/2021-07-30/kartaview-api-docs-meta.jpg
featured_image: /assets/images/blog/2021-07-30/kartaview-api-docs-sm.jpg
layout: post
published: true
---

**`POST KartaView`**

[Last week I took a brief look at KartaView, a street-level imagery platform](/blog/2021/getting-started-with-kartaview).

You will have read my recent posts documenting the [Google Street View Publish](/blog/2021/2preparing-360-video-upload-street-view-publish-api) and [Mapillary v4](/blog/2021/migrating-from-mapillary-api-v3-to-v4) API's.

In my research of the KartaView API [I've been exploring their documentation](http://doc.kartaview.org/). This post is a short write up of what I've found.

Authentication is done using an auth token passed as `X-Auth-Token` in the header of each request. It seems the generation of new tokens is currently limited (I am waiting for a response from KartaView about this).

The core principal of KartaView are [`sequence`](http://doc.kartaview.org/#tag/Sequence)'s.

A sequence is a collection of photos captured continuously by an OpenStreetCam user. 

`sequences` can be created using one or more [`photo`](http://doc.kartaview.org/#tag/Photo)'s and [`video`](http://doc.kartaview.org/#tag/Video)'s.

The upload flow for an `photo` works like so:

1. Optional. [`POST` a new `sequence`](http://doc.kartaview.org/#operation/sequenceCreate). This will return an ID for the sequence (`result.data.id`).
2. [POST a new `photo`](http://doc.kartaview.org/#operation/photoCreate) by posing the required parameters in the request, including the sequence ID returned in step one.

It appears KartaView prefers `photo` uploads, noting for the POST `video` endpoint:

> Mobile clients upload imagery data as video files to optimize compression. Data will be available after processing as photos.
>
> Usage of this resource for retrieving imagery is advisable only for debugging purposes.

KartaView processes videos to photos server side, as Street View does. So once a video is uploaded the `photo` objects it produces can be obtained by:

1. querying the `GET /video?id=X` endpoint using the `id` of video provided in the upload response which returns the `sequenceid`
2. then querying the `GET /photo?sequenceId=X` endpoint using the `sequenceid` returned from step one which returns all the `photo.id`'s in the `sequenceid` 
3. querying the `GET /photo?id=X` endpoint using the `id`'s' returned from step two

Looking inside the `photo` object gives a good overview of what's exposed:

```
{
	"status": {
	"apiCode": 600,
	"apiMessage": "The request has been processed without incidents",
	"httpCode": 200,
	"httpMessage": "Success",
	"executionTime": 0.0946
	},
		"result": {
		"data": [
			{
			"id": 112,
			"sequenceId": 213,
			"videoId": 555,
			"rawDataId": 112,
			"videoIndex": 20,
			"sequenceIndex": 1000,
			"dateAdded": "2016-04-15 23:05:32",
			"dateProcessed": "2016-04-16 09:00:45",
			"name": "16ada_56cc3645da3c9.jpeg",
			"lat": "37.649595",
			"lng": "-122.097050",
			"heading": "161.082520",
			"visibility": "private",
			"autoImgProcessingStatus": "FINISHED",
			"status": "deleted",
			"gpsAccuracy": "10.000",
			"distance": "10.000",
			"autoImgProcessingResult": "ORIGINAL",
			"matchLat": "46.781887054443360",
			"matchLng": "23.688762664794922",
			"matchSegmentId": "23.688762664794922",
			"from": "30074863",
			"to": "186970534",
			"wayId": "140474913",
			"storage": "storage1",
			"width": "2592",
			"cameraParameters": [],
			"height": "2592",
			"filepath": "2018/9/4/{{sizeprefix}}/1286317_c3307_42f.jpg",
			"filepathLTh": "2018/9/4/{{sizeprefix}}/1286317_c3307_42f.jpg",
			"filepathProc": "2018/9/4/{{sizeprefix}}/1286317_c3307_42f.jpg",
			"filepathTh": "2018/9/4/{{sizeprefix}}/1286317_c3307_42f.jpg",
			"fileurl": "http://storage9.openstreetcam.org/files/photo/2018/9/4/{{sizeprefix}}/1286317_c3307_42f.jpg",
			"fileurlLTh": "http://storage9.openstreetcam.org/files/photo/2018/9/4/lth/1286317_c3307_42f.jpg",
			"fileurlProc": "http://storage9.openstreetcam.org/files/photo/2018/9/4/proc/1286317_c3307_42f.jpg",
			"fileurlTh": "http://storage9.openstreetcam.org/files/photo/2018/9/4/th/1286317_c3307_42f.jpg",
			"projection": "PLANE",
			"imagePartProjection": "DUAL_FISHEYE",
			"fieldOfView": "180.00",
			"shotDate": "2016-04-16 09:00:45",
			"hasObd": "0",
			"isWrapped": "1",
			"isUnwrapped": "0",
			"projectionYaw": "180",
			"wrapVersion": "1",
			"unwrapVersion": "0"
			}
		],
	"hasMoreData": false
	}
}
```

The `photo` object contains the map position, projection, dates and oath to download the  processed AND raw images ([something Mapillary removed in their v4 API](/blog/2021/migrating-from-mapillary-api-v3-to-v4)).

The `photo` endpoint also offers [`DELETE`](http://doc.kartaview.org/#operation/photoDeleteById) and [`UPDATE`](http://doc.kartaview.org/#operation/photoUpdateById) methods, including the ability to `UPDATE` the `payload` (the actual photo file).

The [`DELETE`](http://doc.kartaview.org/#operation/photoDeleteById) and [`UPDATE`] methods are also exposed on the `sequence` endpoints.

Once you start adding content to KartaView the [`usermetrics`](http://doc.kartaview.org/#operation/userMetricsGetByUserId) endpoints might be of particular interest, allowing you to track the statistics of the imagery you've uploaded and where you rank amongst the KartaView community.

```
{
	"status": {
		"apiCode": 600,
		"apiMessage": "The request has been processed without incidents",
		"httpCode": 200,
		"httpMessage": "Success",
		"executionTime": 0.0946
		},
		"result": {
		"data": {
		"rank": "33",
		"rankWeekly": "21",
		"totalDistance": "13.06",
		"totalOBDDistance": "89.556280",
		"totalPhotos": "2746",
		"totalPoints": "521",
		"totalProcessingSequences": "11",
		"totalSequences": "30",
		"totalUploadingSequences": "135",
		"totalWaylensDistance": "89.556280",
		"totalWaylensPoints": "89.556280"
		}
	}
}

```

## Protip for existing Mapillary contributors

[SviMik has built a Mapillary to OpenStreetCam synchronisation tool allowing you to clone your existing images automatically between the two products without having to re-upload anything](https://forum.mapillary.com/t/mapillary-openstreetcam-synchronization-tool/4246).

## Coming soon to Map the Paths Uploader...

<img class="img-fluid" src="/assets/images/blog/2021-07-30/mapthepaths-uploader-integrations-sm.jpg" alt="Map the Paths Uploader integrations" title="Map the Paths Uploader integrations" />

I'm working on a new KartaView integration to upload your Sequences using the [Map the Paths Uploader](https://www.mapthepaths.com/uploader).

[Stay tuned for the release announcement by signing up for Trek View updates](https://landing.mailerlite.com/webforms/landing/i5h6l6)!