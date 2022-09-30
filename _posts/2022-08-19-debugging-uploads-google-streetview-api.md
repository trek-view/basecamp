---
date: 2022-08-19
title: "Lessons Learned Using the Google Street View Publish API"
description: "Uploading videos is relatively straight forward, but here are some of the things we've learned the hard way (and you should be aware of)."
categories: developers
tags: [streetview, google]
author_staff_member: dgreenwood
image: /assets/images/blog/2022-08-19/streetview-api-docs-meta.jpg
featured_image: /assets/images/blog/2022-08-19/streetview-api-docs-sm.jpg
layout: post
published: true
---

**Uploading videos is relatively straight forward, but here are some of the things we've learned the hard way (and you should be aware of).**

Last week I complained about Mapillary. This week, Google Street View is in my cross-hairs.

I've posted before about the Google Street View API;

1. [Google Street View Publish API - Quick Start Guide](/blog/2020/street-view-publish-api-quick-start-guide/)
2. [Upload a Video to the Street View Publish](/blog/2021/upload-video-street-view-publish-api)
3. [Creating a Video File Ready to be Uploaded to the Google Street View API](/blog/2022/create-google-street-view-video-publish-api)

The second and third post introduces the concept of creating a Google Street View video and then uploading it to the Street View API.

Now we've been working the Street View API for some time to upload videos, I wanted to share some of our findings (and lessons learned the hard way).

## Useful debugging tools

<img class="img-fluid" src="/assets/images/blog/2022-08-19/google-api-explorer.jpeg" alt="Google Street View API Explorer" title="Google Street View API Explorer" />

The Google API Explorer will help you test your request to the Street View API from your browser. The API Explorer is available for all Street View Publish endpoints [e.g.](https://developers.google.com/streetview/publish/reference/rest/v1/photoSequence/create#PhotoSequence).

<img class="img-fluid" src="/assets/images/blog/2022-08-19/street-view-studio-ui.jpeg" alt="Google Street View Studio" title="Google Street View Studio" />

Street View Studio will also help you track uploads done via the API (as well as through the SV Studio Web app) in the browser (though the information is provides for debugging is somewhat limited, as I will cover in this post). 

## My video has been pending for days!

This generally happens when a video has been uploaded via the API but has not been published successfully.

The Street View API and Street View Studio are not particularly helpful as the state will simply show the state as pending ([which in the docs is defined as](https://developers.google.com/streetview/publish/reference/rest/v1/photoSequence/create); "The sequence has not yet started processing.").

<img class="img-fluid" src="/assets/images/blog/2022-08-19/street-view-studio-pending.jpeg" alt="Google Street View Studio pending" title="Google Street View Studio pending" />

```shell
GET https://streetviewpublish.googleapis.com/v1/photoSequences
```

```json
{
  "photoSequences": [
    {
      "name": "MTEwNjg4ODA0NDI5NjI3NDYxMDAyLzE2NjQ0NjQ0MTU4MzgvY2JjYzQ2MjRiZjFjZWRiYTZjMWYyMDc4MGEyODkxMGM",
      "response": {
        "@type": "type.googleapis.com/google.streetview.publish.v1.PhotoSequence",
        "id": "MTEwNjg4ODA0NDI5NjI3NDYxMDAyLzE2NjQ0NjQ0MTU4MzgvY2JjYzQ2MjRiZjFjZWRiYTZjMWYyMDc4MGEyODkxMGM",
        "captureTimeOverride": "2022-02-05T12:34:05Z",
        "processingState": "PENDING",
        "uploadTime": "2022-09-29T15:13:35.838Z"
      }
    },
    {
      "name": "MTEwNjg4ODA0NDI5NjI3NDYxMDAyLzE2NjQ0NTQzNTk3MDAvYjdjOThkYzRmMGVjOTM0MTAwNDg0MDgyZjM1NDE5OTQ",
      "done": true,
      "response": {
        "@type": "type.googleapis.com/google.streetview.publish.v1.PhotoSequence",
        "id": "MTEwNjg4ODA0NDI5NjI3NDYxMDAyLzE2NjQ0NTQzNTk3MDAvYjdjOThkYzRmMGVjOTM0MTAwNDg0MDgyZjM1NDE5OTQ",
        "captureTimeOverride": "2021-09-28T15:46:42.724Z",
        "processingState": "PROCESSED",
        "distanceMeters": 126.51931588970882,
        "uploadTime": "2022-09-29T12:25:59.700Z",
        "sequenceBounds": {
          "southwest": {
            "latitude": 28.523168725393,
            "longitude": -16.1459641684085
          },
          "northeast": {
            "latitude": 28.523623527775765,
            "longitude": -16.145229071755011
          }
        },
        "filename": "GS068493.mp4"
      }
    }
  ]
}
```

Above, I've also included a successfully `PROCESSED` sequence as a comparison.

If you see `PENDING` for more than 72 hours (i.e. it hasn't moved to `PROCESSING` or `FAILED` state) it's likely you haven't successfully made a request to publish the sequence or that there is an error with the data submitted. For example, we ran into this issue caused by the timestamp used for the `captureTimeOverride.seconds` being incorrect. It should have thrown a `FAILED` state (in our opinion), however instead resulted being in the sequence remaining in `PENDING` in perpetuity.

You can also use the parameter `published_status=<STATE>` to filter the response by `processingState` using the `published_status` parameter, e.g. 

```shell
GET https://streetviewpublish.googleapis.com/v1/photoSequences?published_status=PENDING
```

If an error is flagged you'll receive a fairly detail reason as to why it failed. For example,

```json
{
  "photoSequences": [
    {
      "name": "MTEwNjg4ODA0NDI5NjI3NDYxMDAyLzE2NjQ1NDczOTEyNjgvMmJmNWE2NWE3YjQwZTQ2NWQ0NWI5OGVjOTQxZTY1YTQ",
      "done": true,
      "error": {
        "code": 3,
        "message": "Video trips ended with a failure, so no more work to do. One of the failures was [GPS track does not have any GPS points]",
        "details": [
          {
            "@type": "type.googleapis.com/google.streetview.publish.v1.PhotoSequence",
            "id": "MTEwNjg4ODA0NDI5NjI3NDYxMDAyLzE2NjQ1NDczOTEyNjgvMmJmNWE2NWE3YjQwZTQ2NWQ0NWI5OGVjOTQxZTY1YTQ",
            "processingState": "FAILED",
            "failureReason": "INSUFFICIENT_GPS",
            "uploadTime": "2022-09-30T14:16:31.268Z",
            "filename": "GS010146-player-win.mp4"
          }
        ]
      }
    }
  ]
}
```

Note, [not all possible errors are detailed in the docs](https://developers.google.com/streetview/publish/reference/rest/v1/Code). For example, above the `failureReason` is `INSUFFICIENT_GPS` which is not shown in the docs.

## How do I get more information about my published video?

When a video is uploaded to Street View it is converted into a series of photos.

You can get information about each photo processed using the `photoSequence` endpoint and supplying a sequence `id`.

Using the `PENDING` sequence shown in the last example gives the request;

```shell
GET https://streetviewpublish.googleapis.com/v1/photoSequence/MTEwNjg4ODA0NDI5NjI3NDYxMDAyLzE2NjQ0NjQ0MTU4MzgvY2JjYzQ2MjRiZjFjZWRiYTZjMWYyMDc4MGEyODkxMGM
```

Returns;

```json
{
  "name": "MTEwNjg4ODA0NDI5NjI3NDYxMDAyLzE2NjQ0NjQ0MTU4MzgvY2JjYzQ2MjRiZjFjZWRiYTZjMWYyMDc4MGEyODkxMGM",
  "response": {
    "@type": "type.googleapis.com/google.streetview.publish.v1.PhotoSequence",
    "id": "MTEwNjg4ODA0NDI5NjI3NDYxMDAyLzE2NjQ0NjQ0MTU4MzgvY2JjYzQ2MjRiZjFjZWRiYTZjMWYyMDc4MGEyODkxMGM",
    "captureTimeOverride": "2022-02-05T12:34:05Z",
    "processingState": "PENDING",
    "uploadTime": "2022-09-29T15:13:35.838Z"
  }
}
```

An example of a sequence in `PROCESSING` state;

```shell
GET https://streetviewpublish.googleapis.com/v1/photoSequence/MTEwNjg4ODA0NDI5NjI3NDYxMDAyLzE2NjQ1NDY5NzQ5MzIvMzRkNjk1NTUxYzZhYTFlMTQ0NzYyOTQ5NDNjYzU1N2Y
```

Returns;

```json
{
  "name": "MTEwNjg4ODA0NDI5NjI3NDYxMDAyLzE2NjQ1NDY5NzQ5MzIvMzRkNjk1NTUxYzZhYTFlMTQ0NzYyOTQ5NDNjYzU1N2Y",
  "response": {
    "@type": "type.googleapis.com/google.streetview.publish.v1.PhotoSequence",
    "id": "MTEwNjg4ODA0NDI5NjI3NDYxMDAyLzE2NjQ1NDY5NzQ5MzIvMzRkNjk1NTUxYzZhYTFlMTQ0NzYyOTQ5NDNjYzU1N2Y",
    "processingState": "PROCESSING",
    "uploadTime": "2022-09-30T14:09:34.932Z",
    "filename": "GS028557.mp4"
  }
}
```


Using the `PROCESSED` sequence shown in the last example gives the request;

```shell
GET https://streetviewpublish.googleapis.com/v1/photoSequence/MTEwNjg4ODA0NDI5NjI3NDYxMDAyLzE2NjQ0NTQzNTk3MDAvYjdjOThkYzRmMGVjOTM0MTAwNDg0MDgyZjM1NDE5OTQ
```

Which gives a response with much more information;

```json
{
  "name": "MTEwNjg4ODA0NDI5NjI3NDYxMDAyLzE2NjQ0NTQzNTk3MDAvYjdjOThkYzRmMGVjOTM0MTAwNDg0MDgyZjM1NDE5OTQ",
  "done": true,
  "response": {
    "@type": "type.googleapis.com/google.streetview.publish.v1.PhotoSequence",
    "id": "MTEwNjg4ODA0NDI5NjI3NDYxMDAyLzE2NjQ0NTQzNTk3MDAvYjdjOThkYzRmMGVjOTM0MTAwNDg0MDgyZjM1NDE5OTQ",
    "photos": [
      {
        "photoId": {
          "id": "CAoSLEFGMVFpcE10RTdmRFM1LW1jd2FuZnNmOFF2QllRSkVMR0MtZVlvdEstaUJh"
        },
        "pose": {
          "latLngPair": {
            "latitude": 28.523549745592653,
            "longitude": -16.14551641704594
          }
        },
        "thumbnailUrl": "https://lh3.googleusercontent.com/p/AF1QipMtE7fDS5-mcwanfsf8QvBYQJELGC-eYotK-iBa"
      },
      {
        "photoId": {
          "id": "CAoSLEFGMVFpcE9KUFEwazFGN0lrem40V1lNYUhMQUhzMTJqR3ZNeDRONk5pMzVN"
        },
        "pose": {
          "latLngPair": {
            "latitude": 28.523517073709378,
            "longitude": -16.14561210413661
          }
        },
        "thumbnailUrl": "https://lh3.googleusercontent.com/p/AF1QipOJPQ0k1F7Ikzn4WYMaHLAHs12jGvMx4N6Ni35M"
      }
    ],
    "captureTimeOverride": "2021-09-28T15:46:42.724Z",
    "processingState": "PROCESSED",
    "distanceMeters": 126.51931588970882,
    "uploadTime": "2022-09-29T12:25:59.700Z",
    "sequenceBounds": {
      "southwest": {
        "latitude": 28.523168725393,
        "longitude": -16.1459641684085
      },
      "northeast": {
        "latitude": 28.523623527775765,
        "longitude": -16.145229071755011
      }
    },
    "filename": "GS068493.mp4"
  }
}
```

You can see each photo has an `photoID`, a position (latitude/longitude), and a link to download the image thumbnail (`thumbnailUrl`).

Using the `photoID`, you can also query the photo endpoint for even more information about an image processed from the video;

```shell
GET https://streetviewpublish.googleapis.com/v1/photo/CAoSLEFGMVFpcE10RTdmRFM1LW1jd2FuZnNmOFF2QllRSkVMR0MtZVlvdEstaUJh?view=INCLUDE_DOWNLOAD_URL
```

Note, I have also included the parameter `view=INCLUDE_DOWNLOAD_URL` in the request. This will provide a direct link (`downloadUrl`) to download the processed image.

```json
{
  "photoId": {
    "id": "CAoSLEFGMVFpcE10RTdmRFM1LW1jd2FuZnNmOFF2QllRSkVMR0MtZVlvdEstaUJh"
  },
  "downloadUrl": "https://lh3.googleusercontent.com/22xFyx3ZKTDXw7CzL0MgjcYWi-eRaxh2u_a2FYu2TPoMyxNCUSExILW8PTh3E5JYrQL2tFh6tpY4trbKqrs88gW5SgFeTC2Z7D1a",
  "pose": {
    "latLngPair": {
      "latitude": 28.523549710463382,
      "longitude": -16.145516442892163
    },
    "altitude": 248.21652221679688,
    "heading": 343.91921997070312,
    "pitch": -0.2907257080078125,
    "roll": 6.9708080291748047
  },
  "connections": [
    {
      "target": {
        "id": "CAoSLEFGMVFpcE9KUFEwazFGN0lrem40V1lNYUhMQUhzMTJqR3ZNeDRONk5pMzVN"
      }
    }
  ],
  "captureTime": "2021-09-28T15:46:42Z",
  "thumbnailUrl": "https://lh3.googleusercontent.com/p/AF1QipMtE7fDS5-mcwanfsf8QvBYQJELGC-eYotK-iBa",
  "viewCount": "9",
  "shareLink": "https://www.google.com/maps/@28.5235497,-16.1455164,3a,75y,343.92h,89.71t/data=!3m4!1e1!3m2!1sAF1QipMtE7fDS5-mcwanfsf8QvBYQJELGC-eYotK-iBa!2e10",
  "transferStatus": "NEVER_TRANSFERRED",
  "uploadTime": "2022-09-30T06:00:00Z"
}
```

This time a `pose` property reveals other metadata about the photo including `heading`, `pitch` and `roll`.

A `connections` object also lists the other `photoId`s of images linked to that photo (these values are what is used to create the navigational arrows in the Street View UI).

## Why can't I access photos of other Street View contributors?

Having seen the above, you might want to start accessing the millions of contributions from other Street View users.

The Publish API is specifically designed to return data owned by the authenticated user.

This means you can browse and download your own images as you desire, without cost.

It is possible to query other users images, however for this you'll need to use one of the following Google Maps API endpoints:

* Maps [JavaScript API](https://developers.google.com/maps/documentation/javascript/streetview) / [Embed API](https://developers.google.com/maps/documentation/embed/get-started#street_view_mode) -- best for Web Apps that need interactivity
* Maps Mobile API for [Android](https://developers.google.com/streetview/android) / [iOS](https://developers.google.com/maps/documentation/ios-sdk/streetview) -- best for Mobile Apps that need interactivity
* [Street View Static API](https://developers.google.com/maps/documentation/streetview/overview) -- best for static images in a single location

However, all these services are paid.

<img class="img-fluid" src="/assets/images/blog/2022-08-19/google-maps-street-view-pricing.jpeg" alt="Google Street View Maps API Pricing" title="Google Street View Maps API Pricing" />

At the time of writing the first $200 of API charges are waived, however, as you can see 100,000 requests to the Maps Javascript API to retrieve Street View images [would cost $1,400](https://mapsplatform.google.com/pricing/), or about $0.014 per request. At first glance that doesn't sound too bad, but now imagine a user navigating between 50 images in Street View, which equates to 50 API requests, or $0.70. As you can see, it could quickly get expensive, and is a cost you have no control over unless you limit how a user in your app browses through Street View images.

Pricing is not so much an issue (or at least more controllable) for the Street View Static API as it returns individual images and does not allow users the interactively browse through as many Street View as they want by default.