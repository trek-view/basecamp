---
date: 2021-07-16
title: "Migrating from version 3 to version 4 of the Mapillary API"
description: "The Mapillary v3 API is being shutdown on August 18. Here's a summary of the updates we're making to Map the Paths to support the changes."
categories: guides
tags: [Mapillary, Map the Paths]
author_staff_member: dgreenwood
image: /assets/images/blog/2021-07-16/mapillary-js-docs-meta.jpg
featured_image: /assets/images/blog/2021-07-16/mapillary-js-docs-sm.jpg
layout: post
published: true
---

**Updating Map the Paths to support the new version of the Mapillary API.**

[Since Facebook's acquisition of Mapillary last year](https://blog.mapillary.com/news/2020/06/18/Mapillary-joins-Facebook.html) the Facebook team have been making some fairly significant changes to the backend infrastructure of the platform and how they expose it.

[Part of this includes a brand new version of their API](https://blog.mapillary.com/update/2021/06/23/getting-started-with-the-new-mapillary-api-v4.html).

Our apps, [Map the Paths Web](https://www.mapthepaths.com/) and [Map the Paths Uploader](https://www.mapthepaths.com/uploader), rely heavily on various Mapillary API endpoints.

As some of the new API documentation is yet to be published by Mapillary and the shutdown of v3 on August 18, 2021 is rapidly approaching ([evolving Mapillary API v4 documentation here](https://www.mapillary.com/developer/api-documentation)), I wanted to use this weeks post to document our migration path from v3 to v4, should it prove useful to anyone else.

Mapillary have removed all v3 API documentation from their site, [luckily the Wayback Machine allowed me to cross-reference the old docs](https://web.archive.org/web/20201106093440/https://www.mapillary.com/developer/api-documentation/).

## Authorization

This still follows an Oauth 2.0 flow in v4, as was the case in v3.

We use this flow in both Map the Paths Web (allowing users to import images from Mapillary) and Map the Paths Uploader (to allow users to upload images to Mapillary)

The endpoint for the Oauth 2.0 token exchange remains identical between v3 and v4: `https://www.mapillary.com/connect`.

## Mapillary JS

> MapillaryJS is an interactive street imagery and semantic mapping visualization platform on the web. It takes spatial, semantic, and texture data and renders it using JavaScript and WebGL. MapillaryJS can be augmented and extended with custom rendering, animation, camera controls, interactivity, and data providers.

* [Github repo](https://github.com/mapillary/mapillary-js)
* [Documentation](https://mapillary.github.io/mapillary-js/docs/main/guide)
* [Mapillary blog post](https://blog.mapillary.com/update/2021/06/24/mapillaryjs-v4.html)

We use Mapillary JS for the core navigation between images within Map the Paths Webs.

Mapillary JS is also used to create shapes for manually tagging images for [Map the Paths Challenges](https://www.mapthepaths.com/challenge).

The jump for v3 to v4 brings in a lot of new features round 3D content... something we're very interested in exploring in the future... but the core components for our current usage remain largely unchanged.

## Importing Images

<img class="img-fluid" src="/assets/images/blog/2021-07-16/mapthepaths-import-mapillary-sm.jpg" alt="Map the Paths Web Mapillary import" title="Map the Paths Web Mapillary import" />

Users can import sequences from Mapillary manually or automatically via Map the Paths Uploader into Map the Paths Web.

Importing images allows users to add metadata to the sequences (e.g. type of transport used to capture them) and group them together (e.g. create tours) for users to browse in Map the Paths Web.

The root endpoint for getting images/sequences has changed and requires updating:

* Old: `https://a.mapillary.com/v3/images` / `https://a.mapillary.com/v3/sequences`
* New: `https://graph.mapillary.com/:image_id?sequence_id=XXX`

_It should also be noted that the `images` response for v4 no longer provides user (at time of writing) the URL to download the original image uploaded (as existed in v3), providing only a processed 2048 wide image (`thumb_2048_url`)._

## Mapillary Image Upload

<img class="img-fluid" src="/assets/images/blog/2021-07-16/mapthepaths-uploader-integrations-sm.jpg" alt="Map the Paths Uploader integrations" title="Map the Paths Uploader integrations" />

The [Map the Paths Uploader](https://www.mapthepaths.com/uploader) allows you to upload your sequences to Mapillary.

Not much has changed here between v3 and v4, beyond a different endpoint;

* old: `https://a.mapillary.com/v3/me/uploads/`
* new: `https://rupload.facebook.com/mapillary_public_uploads`

Whilst this new endpoint is not documented at the time of writing, it's fairly easy to understand using the logic written into [Mapillary Tools](https://github.com/mapillary/mapillary_tools/), Mapillary's own command line upload tool.

[The actual upload flow, beyond endpoint change, remains unchanged between v3 and v4](https://github.com/mapillary/mapillary_tools/blob/a0716c0a5f9ebce451ec1ef362bacb460c4737f9/mapillary_tools/upload_api_v4.py):

1. open upload session
2. start upload using users Oauth token
3. close upload session

## Mapping Images / Sequences

<img class="img-fluid" src="/assets/images/blog/2021-07-16/mapthepaths-map-sm.jpg" alt="Map the Paths map view" title="Map the Paths Web map view" />

All our map views call images from the Mapillary API. Our map views show a mix of:

* imported imagery from Mapillary
* images not imported but exist on Mapillary

Using v3 of the Mapillary API we used a mix of image and sequence endpoint searches to return results in a an area (bounding box, `bbox`) to place on the map.

This has been completely replaced with a [vector tile endpoint](https://www.mapillary.com/developer/api-documentation/#vector-tiles) in v4 (`https://tiles.mapillary.com`).

Querying `bbox`es in v3 was very expensive in terms of number of API calls. Vector tiles in v4 provide a much easier way to visualise the vast amounts of results usually returned by such searches.

[Mapillary vector tiles follow the Mapbox tile specification](https://docs.mapbox.com/vector-tiles/specification/).

[Chris Beddow shows a nice example of querying the tile endpoint on the Mapillary blog here](https://blog.mapillary.com/update/2021/06/23/getting-started-with-the-new-mapillary-api-v4.html).

The endpoint for coverage tiles is `https://tiles.mapillary.com/maps/vtp/mly1_public/2/{z}/{x}/{y}`.

* [Mapillary v4 API docs -- vector tiles](https://www.mapillary.com/developer/api-documentation/#vector-tiles)

## Mapillary Detections / Features

We have used Mapillary detections and features and in Map the Paths Web since its first release.

[If you're new to these Mapillary concepts, I would first recommend taking a look at a previous post from last year which describes the v3 API endpoints for these functions in detail and also defines the difference between detections and features](/blog/2020/playing-with-mapillary-api).

For our usage, the changes are not significantly different between v3 and v4.

### Features

<img class="img-fluid" src="/assets/images/blog/2021-07-16/mapthepaths-photo-feature-filter-sm.jpg" alt="Map the Paths Web Photo Features" title="Map the Paths Web Photo Features" />

* [Mapillary v4 API docs -- map features](https://www.mapillary.com/developer/api-documentation/#map-feature)

[From the Mapillary blog](https://blog.mapillary.com/update/2021/06/23/getting-started-with-the-new-mapillary-api-v4.html): 

_If we know the ID of a map feature, we can retrieve information about it using the same method as images. For example, with map feature ID `852766358956987` we can find out what type it is (traffic sign or point), the value, the timestamp of the first image to capture it, and the geometry of the point:_

```
Curl -H “Authorization OAuth: MLY|XXX” https://graph.mapillary.com/852766358956987?fields=id,object_value,object_type,geometry,first_seen_at
```

_The response is a JSON object:_

```
{ "id": "852766358956987", "object_value": "object--street-light", "object_type": "mvd_fast", "geometry": { "type": "Point", "coordinates": [ 55.616435388977, 12.99796317955 ] }, "first_seen_at": "2013-11-01T10:41:56+0000" }
```

_A small note; for our use in Map the Paths, we lookup features on a per image basis (we only display features when a user is viewing a single image). However, I should also point out that to search for features in a given map area (not single image), [the tile endpoint is what you need](https://www.mapillary.com/developer/api-documentation/#point-tiles): `https://tiles.mapillary.com/maps/vtp/mly_map_feature_point/2/{z}/{x}/{y}`._

### Object Detections

<img class="img-fluid" src="/assets/images/blog/2021-07-16/mapthepaths-detections-sm.jpg" alt="Map the Paths Web Object Detections" title="Map the Paths Web Object Detections" />

* [Mapillary v4 API docs -- map detections](https://www.mapillary.com/developer/api-documentation/#detection)

[From the Mapillary blog](https://blog.mapillary.com/update/2021/06/23/getting-started-with-the-new-mapillary-api-v4.html): 

_With an image key in mind, you can also make a request to get all detections in the image. This is achieved by making the same basic API request as previously demonstrated, but adding `/detections`. For detections, we also should specify fields which we want in the response data, such as `value` which describes what the detection’s class is, and `created_at` which is the timestamp when the detection was derived from the image. If a field is not specified, it will be excluded from the response data. Recycling our last example, we can make this request:_

```
Curl -H “Authorization OAuth: MLY|XXX” https://graph.mapillary.com/1933525276802129/detections?fields=id,value,created_at
```

_This will return a list of detections, each a JSON object:_

```
{ "id": "1942105415944115", "value": "regulatory--no-parking--g2", "created_at": "2021-05-20T17:49:01+0000" }
```

_Similarly, you can make the same request with a map feature ID rather than an image ID, and get a list of detections that were used to compose the map feature._

## There's more...

This post only covers our use-cases for Map the Paths, and not everything possible using the Mapillary v4 API.

Keep an eye on the Mapillary official documentation. [The team at Mapillary are making regular changes and updates to it](https://www.mapillary.com/developer/api-documentation).

## Coming soon to Map the Paths

We're getting ready to ship the changes to bump our code from using the Mapillary v3 API to using v4.

You won't notice any differences in the applications user interfaces (except for improved speed), but if you'd like to take a look at the code and how our implementation works you can check out the open-source Github repositories for each of them:

* [Map the Paths Web](https://github.com/trek-view/mtp-web)
* [Map the Paths Uploader](https://github.com/trek-view/mtp-desktop-uploader)

[Stay tuned for all Trek View product announcements by signing up for our updates here](https://landing.mailerlite.com/webforms/landing/i5h6l6).