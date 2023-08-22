---
date: 2020-05-15
title: "Google Street View Publish API - Quick Start Guide"
description: "All third-party Street View tools are built around the Google Street View Publish API. Here's a closer look at how it works for uploading short sequences."
categories: developers
tags: [Google, Street View]
author_staff_member: dgreenwood
image: /assets/images/blog/2020-05-15/google-street-view-documentation-meta.jpg
featured_image: /assets/images/blog/2020-05-15/google-street-view-documentation-sm.jpg
layout: post
published: true
---

**All third-party Street View tools are built around the Google Street View Publish API. Here's a closer look at how it works for uploading short sequences.**

A whole ecosystem has sprung up around Google Street View.

[What was once just Google cars roaming the Streets](/blog/history-of-google-street-view-cameras), is now a whole community of Google Maps users contributing both indoor (look-inside) and outdoor images to Street View [using approved products](https://www.google.com/streetview/contacts-tools/products/).

In fact, all signs point to Google increasing their reliance on external contributors to Street View --  both at hobby level through the Street View app and at professional level thanks to manufacturers building direct Street View integrations for their products.

Getting panoramas into Street View relies on the Google Street View Publish API (application programming interface) that allows developers to interact with Street View's functionality programmatically.

Here's a look at the _public_ endpoints.

## Street Publish API (photos)

The Street Publish API allows developers to publish 360 photos to Google Maps, along with their position, orientation, and connectivity metadata.

Using the Street Publish API endpoints, third-party apps can offer an interface for positioning, connecting, and uploading user-generated Street View images.

The API is built around the [`photo`](https://developers.google.com/streetview/publish/reference/rest/v1/photo#Photo) resource.

### PhotoId

Every Street View `photo` has a unique [`photoId`](https://developers.google.com/streetview/publish/reference/rest/v1/photo#photoid).

Here's the `photoId` of a photo uploaded to Street View (by Trek View): `CAoSLEFGMVFpcE9GcDNYSFNMYmRGT0gtMktHQ3FpTXBpT2FSUFNlSlZyNklFRjNz`.

When you [`create`](https://developers.google.com/streetview/publish/reference/rest/v1/photo/create), a photo a `photoId` is generated for your upload.

### Pose

Each `photo` resource has a `pose`.

`pose` takes the metadata in the uploaded [photo](/blog/metadata-exif-xmp-360-photo-files) to tell Street View more about the camera position and orientation when the photo was taken.

[The `pose` resource](https://developers.google.com/streetview/publish/reference/rest/v1/photo#pose) can contain the following information:

```
{
  "latLngPair": {
    "latitude": number,
    "longitude": number
  },
  "altitude": number,
  "heading": number,
  "pitch": number,
  "roll": number,
  "level": {
    "number": number,
    "name": string
  },
  "accuracyMeters": number
}
```

[`latitude` and `longitude` are essential to make sure the photo is positioned correctly](https://cloud.google.com/datastore/docs/reference/rest/Shared.Types/LatLng).

All other information is optional, but highly recommended to [make sure your Street View photo appears correctly when viewed on Google Maps](/blog/decoding-google-street-view-urls).

* `altitude`: Altitude of the pose in metres above [WGS84 ellipsoid](https://en.wikipedia.org/wiki/World_Geodetic_System).
* `heading`: Compass heading, measured at the center of the photo in degrees clockwise from North. Value must be >=0 and <360. 
* `pitch`: Pitch, measured at the center of the photo in degrees. Value must be >=-90 and <= 90. A value of -90 means looking directly down, and a value of 90 means looking directly up.
* `roll`: Roll, measured in degrees. Value must be >= 0 and <360. A value of 0 means level with the horizon.
* `level`: Level (the floor in a building) used to configure vertical navigation.
* `accuracyMeters`: The estimated horizontal accuracy of this pose in metres with 68% confidence (one standard deviation).

### Connection

A connection is the link from a source photo to a destination photo. This information helps to define the blue line in the Street View web interface.

```
{
  "target": {
    object (PhotoId)
  }
}
```

You'll see that the target needs to be supplied as a `photoId`. As such, the connected photos need to already exist in (have been uploaded to) Street View.

Therefore, the best way to handle connections, is to first upload the images to Street View without defining the connection `target`, then [`update` each Street View record](https://developers.google.com/streetview/publish/reference/rest/v1/photo/update) with the correct connection information.

In the example below, we're updating `pano_2` so that it is connected to `pano_1` and `pano_3`.

```
{
  "updatePhotoRequests": [
    {
      "updateMask": "connections",
        "photo": {
          "photoId": {
            "id": "pano_2"
          },
          "connections": [
            {
              "target": {
                "id": "pano_1"
              }
            },
            {
              target": {
                "id": "pano_3"
              }
            }
          ]
        }
      }
    ]
}
```

Connections need to be defined in every photo record. Therefore you will need to update every Street View photo record like this.

In this example, `pano_1` would need to be update with `pano_2` as a `target`.

**A note on auto connections**

It's important to note, Google does some server side processing of Street View images too.

[Google recommends when taking 360 Street View images](https://support.google.com/maps/answer/7012050?hl=en&ref_topic=627560):

> Space the photos about two small steps apart (1 m / 3 ft) when indoors and five steps apart (3 m / 10 ft) when outdoors.

This video from the Street View Conference in 2017 also [references the 3m interval](https://www.youtube.com/watch?v=EW8YKwuFGkc).

[According to this Stack Overflow answer](https://stackoverflow.com/questions/54237231/how-to-create-a-path-on-street-view):

> You need to have > 50 panoramas with a distance < 5m between two connected panoramas. After some days (weeks?) Google will convert them to a blue line in a separate processing step.

It's safe to assume in some cases Google servers might automatically connect your images into a blue line even if a connection `target` is not defined, [as addressed here](https://support.google.com/contributionpolicy/answer/7411351):

> When multiple 360 photos are published to one area, connections between them may be automatically generated. Whether your connections were created manually or automatically, we may adjust, remove, or create new connections — and adjust the position and orientation of your 360 photos — to ensure a realistic, connected viewing experience

### captureTime

The `captureTime` is the absolute time when the photo was captured.

The timestamp should be in [RFC3339 UTC "Zulu" format](https://tools.ietf.org/html/rfc3339), accurate to nanoseconds, e.g. `2014-10-02T15:01:23.045123456Z`.

### placeId

```
{
  "placeId": string,
  "name": string,
  "languageCode": string
}
```

[`placeId`'s uniquely identify a place in the Google Maps database](https://developers.google.com/places/place-id).

`placeIds` vary in granularity, for example a `placeId` could cover a whole city, or a specific address in that city.

For Street View, `placeIds` will probably fall somewhere in between this spectrum (unless you're doing an indoor tour of a specific address).

For a brief explanation about Place ID's, and why they are important for Street View, [read this post](/blog/place-id-google-street-view).

## A real example

### Uploading your photos

[Read more about setting up a Google Cloud project, enabling the Street View Publish API, and generating a Client ID and Secret to authenticate (all required steps to use the Publish API) here](https://developers.google.com/streetview/publish/first-app).

Once complete you can start uploading your 360 photos:

**1. Request an Upload URL**

```
$ curl --request POST \
        --url 'https://streetviewpublish.googleapis.com/v1/photo:startUpload?key=YOUR_API_KEY' \
        --header 'Authorization: Bearer YOUR_ACCESS_TOKEN' \
        --header 'Content-Length: 0'
```

**2. Upload the photo bytes to the Upload URL**

```
$ curl --request POST \
        --url 'UPLOAD_URL' \
        --upload-file 'PATH_TO_FILE' \
        --header 'Authorization: Bearer YOUR_ACCESS_TOKEN'
```

**3. Upload the metadata of the photo**

```
$ curl --request POST \
        --url 'https://streetviewpublish.googleapis.com/v1/photo?key=YOUR_API_KEY' \
        --header 'Authorization: Bearer YOUR_ACCESS_TOKEN' \
        --header 'Content-Type: application/json' \
        --data '{
                  "uploadReference":
                  {
                    "uploadUrl": "UPLOAD_URL"
                  },
                  "pose":
                   {
                     "heading": 1.0,
                     "altitude": 2.0,
                     "pitch": 3.0,
                     "roll": 4.0,
                     "latLngPair":
                     {
                       "latitude": 5.0,
                       "longitude": 6.0
                     }
                  },
                  "captureTime":
                  {
                    "seconds": 1483202694
                  },
                }'
      
```

### Checking the status

Assuming everything is successful, the Street View API should return the `photoId` for your photo.

```
{
  "photoId": {
    object (PhotoId)
  },
  "uploadReference": {
    object (UploadRef)
  },
  "downloadUrl": string,
  "thumbnailUrl": string,
  "shareLink": string,
  "pose": {
    object (Pose)
  },
  "connections": [
    {
      object (Connection)
    }
  ],
  "captureTime": string,
  "places": [
    {
      object (Place)
    }
  ],
  "viewCount": string,
  "transferStatus": enum (TransferStatus),
  "mapsPublishStatus": enum (MapsPublishStatus)
}
```

Lets take a look at the output values...

* [`transferStatus`](https://developers.google.com/streetview/publish/reference/rest/v1/photo#transferstatus): [It is possible to transfer a 360 photo on Google Maps to another Google user](https://support.google.com/maps/answer/7013640?co=GENIE.Platform%3DAndroid&hl=en). This field tracks the status of the rights transfer on the photo. 
* [`mapsPublishStatus`](https://developers.google.com/streetview/publish/reference/rest/v1/photo#mapspublishstatus): The status in Google Maps, whether this photo is pending (`UNSPECIFIED_MAPS_PUBLISH_STATUS`), published (`PUBLISHED`), or rejected (`REJECTED_UNKNOWN`).
* `viewCount`: View count of the photo after is `mapsPublishStatus=PUBLISHED` . If you've ever looked at your Google Maps account, it will show the sum of all your photo `viewCount`'s.
* `downloadUrl`: The download URL for the photo bytes. This field is set only when [`GetPhotoRequest.view`](https://developers.google.com/streetview/publish/reference/rest/v1/PhotoView) is set to `PhotoView.INCLUDE_DOWNLOAD_URL`.
* `thumbnailUrl`: The thumbnail URL for showing a preview of the given photo. This is what you see when you hover over an image in Google Maps.
* `shareLink`: The share link for the photo to share with anyone to view in Street View (e.g. `https://www.google.com/maps/@0,0,0a,90y,90t/data=!3m4!1e1!3m2!1sAF1QipMLgaiIjCzRWiqt05qITYaz9-NWOYe-zW13Zcag!2e10`)

The following sample requests will allow you to grab this information at a later date;

**Getting a list of your photos**

```
$ curl --request GET \
    --url 'https://streetviewpublish.googleapis.com/v1/photos?key=YOUR_API_KEY' \
    --header 'authorization: Bearer YOUR_ACCESS_TOKEN'
```

**Getting a photo**

```
    $ curl --request GET \
    --url 'https://streetviewpublish.googleapis.com/v1/photo/PHOTO_ID?key=YOUR_API_KEY' \
    --header 'authorization: Bearer YOUR_ACCESS_TOKEN'
```

## Street Publish API (photoSequences)

You might have noticed my emphasis on the word _public_ API endpoints earlier.

The Street Publish API also supports video uploads if they use the [Camera Motion Metadata Spec (CAMM)](https://developers.google.com/streetview/publish/camm-spec) standard.

For more information about the CAMM standard, [read this post introducing the concept of video metadata](/blog/metadata-exif-xmp-360-video-files-gopro-gpmd).

The `photoSequence` method is required for video uploads to the Street View Publish API, but requires authorisation from Google to access. I emailed them earlier this week and received this response:

> Due to the current situation we're not inviting new users to the Publish API's sequence methods. [...] You will need to use the manufacturer recommended way of managing and publishing imagery. Please check back with us at a later date if you're still interested in using the sequence methods. I'm closing this request.

I'll talk more about working with video files and the Street View API in a future post. If you want a sneak peak at how the `photoSequence` method works, [check out some of the sample upload scripts in this repository on Github](https://github.com/smarquardt/samples-for-svpub).

## Other Street View API's

You are probably already familiar with the ability to share Street View panoramas on your website using `<iframe>`'s.

If you're looking to use Street View images on your website or app without using an `<iframe>`, or want a lot more flexibility for what you can do with a Street View image, there are two API's you'll be interested in:

* [Street View Static API](https://developers.google.com/maps/documentation/streetview/intro): The Street View Static API lets you embed a static (non-interactive) Street View panorama or thumbnail into your web page.
* [Google Maps JavaScript API (Street View Service)](https://developers.google.com/maps/documentation/javascript/streetview): The Maps JavaScript API provides a Street View service for obtaining and manipulating the imagery used in Google Maps Street View. This Street View service is supported natively within the browser.