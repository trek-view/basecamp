---
date: 2022-08-12
title: "An Open Letter to Mapillary: Update Your API Docs, Please"
description: "In this post I will go through some of the challenges (mainly though lack of documentation) with the v4 Mapillary API we experienced when building Explorer."
categories: developers
tags: [Mapillary, Explorer]
author_staff_member: dgreenwood
image: /assets/images/blog/2022-08-12/mapillary-web-api-requests-meta.jpg
featured_image: /assets/images/blog/2022-08-12/mapillary-web-api-requests-sm.jpg
layout: post
published: true
---

**In this post I will go through some of the challenges (mainly though lack of documentation) with the v4 Mapillary API we experienced when building Explorer.**

[Last year I was excited to hear about the new Mapillary API (v4), and the improvements and the future updates it would bring](/blog/2021/migrating-from-mapillary-api-v3-to-v4).

Alas, over a year later, [the API Documentation hasn't changed at all](https://www.mapillary.com/developer/api-documentation).

It is a real shame, because it still lacks many of the key feature of v3 ([docs archived by the Wayback Machine](https://web.archive.org/web/20201106093440/https://www.mapillary.com/developer/api-documentation/)), and is missing endpoints that do exist.

In this post I documented some of our approaches to cover shortcomings in the Mapillary API and the documentation.

## How Explorer uses Mapillary

Explorer allows users to upload street-level images and videos. In addition to mapping them (in a similar way to Mapillary and Street View), it also allows users to do a one-shot upload to these services.

In the case of Mapillary, Explorer uploads a zipped file of images for each Explorer sequence to Mapillary.

<img class="img-fluid" src="/assets/images/blog/2022-08-12/trek-view-mapillary-app.jpg" alt="Trek View Mapillary Developer App" title="Trek View Mapillary Developer App" />

To initiate the upload, firstly, [Explorer authenticates the user to Mapillary](https://www.mapillary.com/developer/api-documentation/#authentication) using our OAuth app.

Once the user grants Explorer access to their account (and Mapillary provides an OAuth token) we can start the upload flow.

Explorer then checks to ensure each users token validity before upload and refreshes the token if needed, described in the Mapillary API documentation under refresh flow.

Now that Explorer has a valid token, the upload of images can begin. Note, during uploads Mapillary does not have a concept of Sequences. You simply upload images (in a `.zip` file). Mapillary then processes the uploaded images into one or more Sequence server side.

I am not 100% clear on how Sequences are created from uploaded images on the Mapillary server (e.g. how far images can be apart in a sequence, etc.), except for the fact that a Sequence can only hold 500 images. Thus, if 600 images, this will result in at least two Mapillary sequences.

Whilst not documented [the actual upload flow can be deduced from mapillary_tools](https://github.com/mapillary/mapillary_tools/blob/main/mapillary_tools/upload_api_v4.py), which performs an upload of images like so;

1. [Images in the upload are placed into a .zip file](https://github.com/mapillary/mapillary_tools/blob/main/mapillary_tools/commands/zip.py)
2. [An upload session is created and upload begins to the upload endpoint (currently `https://rupload.facebook.com/mapillary_public_uploads`)](https://github.com/mapillary/mapillary_tools/blob/main/mapillary_tools/upload_api_v4.py)
3. [The upload session is closed](https://github.com/mapillary/mapillary_tools/blob/main/mapillary_tools/upload_api_v4.py#L162)

The problem is, after closing the upload session, there is no direct link to what sequences (IDs) or images (IDs) are created. This makes sense, because as noted earlier, the Mapillary server now begins the processing of images into Sequences.

Nor is their a documented endpoint to track the status of an upload and what Sequences are created from it.

The Mapillary API does provide the following responses at step 3 (from `https://graph.mapillary.com/finish_upload)`:

```
{'cluster_id': 'XXXXXXXXXXXXX'}
```
The `cluster_id` is assume to be related to the Sequence in some way (more on that in a bit). We're not quite sure if it's the same as `sfm_cluster` in the docs (which references the [OpenSFM cluster processed by Mapillary](https://opensfm.org/)).

This means whilst we can upload images, it appears very hard to tie an Explorer image/sequence uploaded to Mapillary, to corresponding Mapillary image/sequence. Two of the features we wanted to implement on Explorer, 1) the ability to track Mapillary upload status, and 2) the ability for a user to open the corresponding Mapillary sequence (on mapillary.com) from the Explorer web interface, as we do for other integration points (e.g. Street View).

Therefore we started to Explorer potential workarounds to implement these two features...

## Plan A (tl;dr, works, but lots of potential issues)

To solve this, our first plan was to try an find the Mapillary sequence using information we had (the metadata of the images uploaded). We quickly learned the process to do this is fairly convoluted though.

First, we can query the [coverage tiles endpoint](https://www.mapillary.com/developer/api-documentation/#coverage-tiles) to get sequence in the vicinity of the images in our uploaded sequences like so;

```shell
https://tiles.mapillary.com/maps/vtp/mly1_public/2/{z}/{x}/{y}
```
Where;

* `{z}`: tile zoom level (always 14)
* `{x}`: x Cartesian coordinate
* `{y}`: y Cartesian coordinate

p.s. If you're new to XYZ tiles, [this post](https://developers.planet.com/docs/planetschool/xyz-tiles-and-slippy-maps/) and [this post](https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames#X_and_Y) will prove very helpful. For even more on the subject, the [Mapbox Cookbook by Bill Kastanakis](https://www.packtpub.com/product/mapbox-cookbook/9781784397357) will prove another useful resource.

To find the x,y co-ordinates of the tile, we use the middle image in the sequence (so we can hopefully capture the most images either side) and convert the latitude and longitude to x,y;

```
n = 2 ^ zoom
xtile = n * ((lon_deg + 180) / 360)
ytile = n * (1 - (log(tan(lat_rad) + sec(lat_rad)) / π)) / 2
```

[A Python code snippet for this calculation is also included here](https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames#Lon..2Flat._to_tile_numbers_2).

This request will then provide a response with zero or more sequences (`sequence_id`) found in that tile.

If the response contains zero `sequence_id`s, the assumption being the sequence is still processing (or has failed).

Assuming the response does contain one or more `sequence_id`s, using each `sequence_id` returned, we can then query the [Sequence endpoint](https://www.mapillary.com/developer/api-documentation/#sequence) for each returned `sequence_id`.

```
https://graph.mapillary.com/image_ids?sequence_id=XXX
```

Each response will contain the `image_ids` for the images in the Mapillary Sequence. The [Image endpoint can then be queried to get information about each image in that sequence](https://www.mapillary.com/developer/api-documentation/#image)

```
https://graph.mapillary.com/:image_id
```

This needs to be done for each image in the Mapillary sequence for best accuracy.

The response of this endpoint includes `captured_at`, `altitude`, and `geometry` (a GeoJSON Point geometry object containing the latitude and longitude of the image).

Using this the latitude+longitude+altitude+time of each uploaded image could be compared to these values returned for each image on Mapillary API.

If a match exist, we can be fairly certain that the image on Mapillary is the same as the one from the Explorer upload.

The response of the Image endpoint also contains `sequence_id` which means if a match exists we can then link each Explorer image to both a Mapillary image ID and a Sequence on Mapillary.

Whilst this flow works (and is mostly documented), we decided that this approach was not viable;

* It is excessive. The amount of requests needed to iterate through (potentially) thousands of images is problematic for both client and server at scale
* I have a suspicion Mapillary adjusts the co-ordinates of some images. In cases where this happens, this approach will fail.
* It assumes no other images have same x,y co-ordinates or time (which I can be 99% certain of, barring camera error where same location is reported).
* There is no information about the status of the Sequence upload. The assumption is that if the images don't match between Mapillary and Explorer that the sequence is still uploading. Mapillary usually publishes sequences within 72 hours, so we could also assume if an image does not appear within 72 hours an error has occurred -- though this would be a massive assumption... and one I was not comfortable with.

As such, we came up with a Plan B by watching the request of Mapillary Web.

## Plan B (tl;dr, still hacky, but works, our current approach)

This approach required using Chrome Developer tools to watch the requests the Mapillary Web app made to the Mapillary APIs.

<img class="img-fluid" src="/assets/images/blog/2022-08-12/mapillary-web-api-requests-sm.jpg" alt="Mapillary API Chrome Dev tools" title="Mapillary API Chrome Dev tools" />

One of the first things we noticed when on the user page and opening the sidebar in the Mapillary web app, e.g. https://www.mapillary.com/app/user/trekviewhq, was that a request to get new sequences accepted a username variable (and returned a user id in the response -- needed for other endpoints).

```
https://graph.mapillary.com/graphql?doc=query getNewSequences
```

For us, [and others](https://forum.mapillary.com/t/how-to-query-user-info-from-v4/5378), the lack of ability to get information for an authenticated user is problematic. [This did exist in v3](https://web.archive.org/web/20201106093440/https://www.mapillary.com/developer/api-documentation/).

One advantage we have with Explorer is being able to ask the user for their username during the OAuth process (and keep our fingers crossed they enter it correctly -- because there is no way to validate it is correct, remember, no endpoint for user info!).

Using the username we tried to query the `getNewSequences` using the `username` variable.

Here comes the first issue. This endpoint, like all Mapillary API endpoint required authentication. We tried to use our applications `access_token`, but were denied.

We then noticed Mapillary hardcoded their own `access_token` in all requests from the web app to the API. Using their `access_token` we were able to successfully get a response from this endpoint.

This returns a response like so;

```json

{
  "data": {
    "user_by_username": {
      "id": "101176865463974",
      "new_sequences": {
        "sequence_keys": [
          "T1jwvlYndsWVzhuDHOSb7i",
          "UmFYLgu9n15aBxXbiQH6vs",
          "BsUTIV4RDXhidW7aM6Zvte",
          "Y52dBvChfEaUlLt0TyGMmP",
          "LNShFtI5X9EnqZc07dDRYg",
          "5wiWDzQ1oBrlAeFb27gTER",
          "eBcQxLG1sKJalMomPOYjfU",
          "updPmsU57SQ9T3MlhHWaLV"
        ],
        "geojson": "{XXXXXXXXX}",
        "__typename": "MLYNewSequencesData"
      },
      "__typename": "User"
    },
    "__typename": "Query"
  },
  "extensions": {
    "is_final": true
  }
}
```

[Full example response for trekviewhq](https://gist.github.com/himynamesdave/c940d1eb5311b74e14014e5aed102853).

The endpoint returns a `user_by_username` object which contains `id` (needed for many of the other endpoints). The trekviewhq user id is 101176865463974.

One of the endpoints we identified in the web app using the `user_id` in requests was the `latestActivity` endpoint (also undocumented) which returns the uploads from the user sorted by most recent first (note, the response is paginated, you can use the `first` and `after` parameters to page through the response).

```
https://graph.mapillary.com/graphql?doc=query getLatestActivity
```

This request takes variables:

* `id`; the user ID obtained at last step (for trekviewhq = 101176865463974)
* `first`; the number of items (`nodes`) to be returned (I think) -- the Mapillary web app uses `50`
* `after`; seems to be some sort of ID but no idea for what -- for example, when scrolling to load more results in the sidebar, a request was made with the value for this variable `AQHRAAK9wQE4i9s139Bh_DJev3-CV-L_o9SmWd6lHElM3SI2-BW5djTqY-dphpwUdoskjd_4nBTCS58-oz6ni8RSbA`

In the response from this endpoint, a `node` object with a `cluster_id` is included (remember, a `cluster_id` is also included in the response of the upload).

```json
{
    "data":{
        "fetch__User":{
            "id":"XXXXXXXXXXX",
            "feed":{
                "page_info":{
                    "start_cursor":null,
                    "end_cursor":null,
                    "has_next_page":false,
                    "has_previous_page":false
                },
                "nodes":[
                    {
                        "cluster_id":"XXXXXXXXXXX",
                        "type":"UPLOAD",
                        "thumb_url":null,
                        "item_count":null,
                        "image_id":null,
                        "status":"IN_PROGRESS",
                        "initial_processing_status":"IN_PROGRESS",
                        "anonymization_status":"IN_PROGRESS",
                        "tiler_status":"IN_PROGRESS",
                        "error_code":"UNSET",
                        "__typename":"ClusterLatestActivityItem"
                    }
                ],
                "__typename":"UserFeedConnection"
            },
            "__typename":"User"
        },
        "__typename":"Query"
    },
    "extensions":{
        "is_final":true
    }
}
```

[Here is a full sample response for trekviewhq](https://gist.github.com/himynamesdave/f968885b1b60fdbea33bd11e0dd67dbd).

With this information we can compare each upload reported by the API (each `node`) for a user against the upload `cluster_id`s for that user in Explorer (that we got when the upload was closed). If we get a match we can link the sequence on Mapillary to Sequence on Explorer.

The `cluster_id` object also contains the upload state of the sequence, used to power one of the newer features in the Mapillary UI shows you the state of a sequence upload.

<img class="img-fluid" src="/assets/images/blog/2022-08-12/mapillary-image-pipeline.jpg" alt="Mapillary Web UI Sequence Status" title="Mapillary Web UI Sequence Status" />

It shows four steps and their status; failed, success, or pending.

1. Image ingestion
2. Image processing (`initial_processing_status`)
3. Map data processing (`anonymization_status`)
4. Map update (`tiler_status`)

This information allows us to 1) link images uploaded by a user to an Image ID / Sequence ID on Mapillary, and 2) track the status of sequence uploaded by Explorer on Mapillary.

The response also contains a `error_code` property, allowing the ability to identify the reason for potential failures.

If you're interested, [here is our proof-of-concept for this workflow](https://gist.github.com/himynamesdave/2e2048790096e4e41e845c839fc02717).

It's still not perfect, but solves our use-case and so far is proving stable. My biggest worry is non of these endpoints are documented, and therefore assumed not supported (and could change at any time).

## Dear Meta, Mapillary,

If you don't plan to continue development on the API or its documentation, just let us know -- we can continue to use our workarounds.

It would be incredibly helpful to have some clarity on what we can expect in the future (good or bad) so we can make design decisions accordingly.

Yours sincerely,

Everyone at Trek View