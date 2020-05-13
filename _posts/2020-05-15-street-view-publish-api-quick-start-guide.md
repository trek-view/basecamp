---
date: 2020-05-15
title: "Google Street View Publish API - Quick Start Guide"
description: "All third-party Street View tools are built around the Google Street View Publish API. Here's a closer look at how it works."
categories: developers
tags: [Google, Street View]
author_staff_member: dgreenwood
image: /assets/images/blog/2020-05-01/google-street-view-documentation-meta.jpg
featured_image: /assets/images/blog/2020-05-01/google-street-view-documentation-sm.jpg
layout: post
published: false
---

**POST my_beautiful_panorama.jpg**

A whole ecosystem has sprung up around Google Street View.

[What was once just Google cars roaming the Streets](/blog/2019/history-of-google-street-view-cameras), is now a whole community of Google Maps users contributing both indoor (look-inside) and outdoor images to Street View [using approved products](https://www.google.com/streetview/contacts-tools/products/).

In fact, [all signs point to Google increasing their reliance on external contributors to Street View](https://campfire.trekview.org/t/how-do-i-become-google-street-view-trusted-pro/136/7) --  both at hobby level through the Street View app and at professional level thanks to manufacturers building in direct Street View integrations.

Getting panoramas into Street View relies on the Google Street View Publish API's (application programming interface) that allow developers to interact with Street View's functionality.

Here's a look at the _public_ endpoints. Some endpoints and functionality are private, for example; ([access to methods and documentation for 360 photo sequences in the Street View Publish API is by invitation only](https://developers.google.com/streetview/ready))

## Street Publish API (photos / panoramas)

The Street Publish API allows developers to publish 360 photos to Google Maps, along with their position, orientation, and connectivity metadata.

Using the Street Publish API endpoints, third-party apps can offer an interface for positioning, connecting, and uploading user-generated Street View images.

The API is built around the `photo` resource.

### PhotoId

Every Street View `photo` has a unique [`photoId`](https://developers.google.com/streetview/publish/reference/rest/v1/photo#photoid).

Here's a `photoId` of a photo uploaded to Street View (by Trek View): `CAoSLEFGMVFpcE9GcDNYSFNMYmRGT0gtMktHQ3FpTXBpT2FSUFNlSlZyNklFRjNz`.

### Pose

Each `photo` also has a `pose`.

`pose` takes the metadata in the uploaded [photo](/blog/2020/metadata-exif-xmp-360-photo-files) to tell Street View more about the camera position and orientation when the photo was taken.

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

[`latitude` and `longitude` are essential to make sure the photo is positioned correctly](https://cloud.google.com/datastore/docs/reference/rest/Shared.Types/LatLng ).

All other information is optional, but highly recommended to make sure your Street View photo appears correctly when viewed on Google Maps.

* `altitude`: Altitude of the pose in meters above [WGS84 ellipsoid](https://en.wikipedia.org/wiki/World_Geodetic_System).
* `heading`: Compass heading, measured at the center of the photo in degrees clockwise from North. Value must be >=0 and <360. 
* `pitch`: Pitch, measured at the center of the photo in degrees. Value must be >=-90 and <= 90. A value of -90 means looking directly down, and a value of 90 means looking directly up.
* `roll`: Roll, measured in degrees. Value must be >= 0 and <360. A value of 0 means level with the horizon.
* `level`: Level (the floor in a building) used to configure vertical navigation.
* `accuracyMeters`: The estimated horizontal accuracy of this pose in meters with 68% confidence (one standard deviation).



Each segment of the attribute is preceded by "!", a number from 1 - 5 (or more presumably), and a letter (m, e, etc).




    %3D


For some reason the fourth element (3rd, when counting from 0) is the pano attribute.

Therefore, this street view of the Acropolis can be parsed into this url for an image:

https://moz.com/blog/new-google-maps-url-parameters

https://stackoverflow.com/questions/28489214/google-street-view-maps-parsing-url-to-use-as-street-image


### Connection

A connection is the link from a source photo to a destination photo.

The destination of the connection from the containing photo to another photo.

This is an interesting field, and the behaviour I am not 100% cetain of.]

Let's imagine for a moment, you have a photo timelapse of a walk. Photos are _connected_ in time order (the first timelapse photo is at time=0 and as the walk progresses each photo is .

Developing the example, let's imaging the first photo uploaded returns a photoId `1234`

This will be included in the ver

**A brief note on photo connections**

[According to this Stack Overflow answer](https://stackoverflow.com/questions/54237231/how-to-create-a-path-on-street-view):

> You need to have > 50 panoramas with a distance < 5m between two connected panoramas. After some days (weeks?) Google will convert them to a blue line in a separate processing step.

But one of the commenters mentions:

> I can not find my notes for the Street View Summit, but in this talk they are even talking about less the 3m youtu.be/EW8YKwuFGkc?t=2160

Assuming you're not creating an indoor tour (where connections might be close together, but with obstructions e.g. walls), you might not even need to pass connection info if your photos are very close togethr.

### captureTime

The `captureTime` absolute time when the photo was captured.

A timestamp in [RFC3339 UTC "Zulu" format](https://tools.ietf.org/html/rfc3339), accurate to nanoseconds, e.g. `2014-10-02T15:01:23.045123456Z`.

### Place

In Google Maps, Place refers to a location already defined in Google Maps. 

Places vary in specifics, for example a Place could be a whole city, or a specific address.

For Street View, Places will probably be somethwere in between (unless you're doing an indoor tour of a specific address).

[Place IDs uniquely identify a place in the Google Places database and on Google Maps](https://developers.google.com/places/place-id).

For a breif explanation about Place ID's, and why they are important for Street View, [read this post](/blog/2019/place-id-google-street-view).

## A real example

### Uploading your photos

[Read more about setting up a Google Cloud project, enabling the Street View Publish API, and generating a Client ID and Secet to authenticate here](https://developers.google.com/streetview/publish/first-app).

Once, complete you can start uploading your 360 photos:

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
* `downloadUrl`: The download URL for the photo bytes. This field is set only when GetPhotoRequest.view is set to PhotoView.INCLUDE_DOWNLOAD_URL.
* `thumbnailUrl`: The thumbnail URL for showing a preview of the given photo. This is what you see when you hover over an image in Google Maps.
* `shareLink`: The share link for the photo. This will be very similar to the URL shown earlier detailing the breakdown of a Street View URL (e.g. `https://www.google.com/maps/@0,0,0a,90y,90t/data=!3m4!1e1!3m2!1sAF1QipMLgaiIjCzRWiqt05qITYaz9-NWOYe-zW13Zcag!2e10`)

The following sample requests will allow you to grab this information;

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

## Street Publish API (videos)

The Street Publish API supports the [Camera Motion Metadata Spec (CAMM)](https://developers.google.com/streetview/publish/camm-spec)standard is supported in the Street View Publish API.

For more information about this standard, [read this post introducing the concept of video metadata](/blog/2020/metadata-exif-xmp-360-video-files).

I'll talk more about working with video files and the Street View API in a future post.

_Note: the endpoints required for video uploads to Street View require authorisation from Google to access._

## Other Street View API's

[You are probably alrady be familiar with the ability to share Street View panoramas on your website using `<iframes>`](https://campfire.trekview.org/t/posting-interactive-views-of-your-panoramas-in-forum-posts/50/3).

If you're just looking to use Street View images on your website or app (without using the <iframe>, and with a lot of flexibility) there are two API's you'll be interested in:

* [Street View Static API](): The Street View Static API lets you embed a static (non-interactive) Street View panorama or thumbnail into your web page.
* [Google Maps JavaScript API (Street View Service)](https://developers.google.com/maps/documentation/javascript/streetview): The Maps JavaScript API provides a Street View service for obtaining and manipulating the imagery used in Google Maps Street View. This Street View service is supported natively within the browser.

## Explorer Desktop Uploader

