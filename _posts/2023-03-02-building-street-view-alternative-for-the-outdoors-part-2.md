---
date: 2023-03-02
title: "Building a Street View Alternative for Exploration... with no money (part 2)"
description: "In this post I will walk you through my early design decisions and the workflow of the proposed app."
categories: developers
tags: [YouTube, Meta, Mapillary, Facebook, GoPro, OpenSFM]
author_staff_member: dgreenwood
image: /assets/images/blog/2023-03-02/
featured_image: /assets/images/blog/2023-03-02/
layout: post
published: false
redirect_from:
  - 
---

**In this post I will walk you through my early design decisions and the workflow of the proposed app.**

Following on from my last post (which steered me away from some aspects of the app), my web app will do the following

1. allow people to sign up / sign in / log out
  * I'll use an 3rd party to handle this (probably Auth0 as I'm familiar with this)
2. allow authenticated users to import 1 or more of their panoramic (360) sequences from Mapillary.
  * app will import all sequence and image metadata into the database
3. allow authenticated users to publish imported sequences to the map. A user can assign a sequence;
  * name (optional, else sequence ID will be used)
  * description (optional, else blank)
  * transport type (required, dictionary of transport methods)
  * tags (optional list of alphanumeric tags)
4. allow authenticated user to modify published sequences
  * modify values for published sequences
  * delete imported sequences
5. allow unauthenticated/authenticated users to browse sequences using
  * capture data (to and from)
  * northern hemisphere season (winter, spring, summer, autumn)
  * username (Trek View username)
  * altitude meters (min / max)
  * elevation change meters (min / max)
  * length meter (min / max)
  * name/description (wildcard search)
  * transport type (multi-select)
  * tags (multiselect)
  * camera make+model (multiselect)
6. allow authenticated users to mark image as viewpoint (true/false)
7. allow authenticated users to mark sequence as favourite (true/false)

For this post I'll ignore some of the more trivial aspects of the app, like authentication.

The main aim of this post is to describe the import flow and what data the Trek View database will hold.

### Authentication to Mapillary

We don't need a user to authenticate to Mapillary, as all sequence/images are visible to all once published. Thus if I wanted, we could simply use a single OAuth token to grab sequences from Mapillary.

However, I do want to limit users from importing images for Mapillary accounts they own.

As such we will ask all users to authenticate to Mapillary on sign up to Trek View to generate an OAuth token specific to their account (with read only privileges to their Mapillary account);

https://www.mapillary.com/developer/api-documentation#authentication

In this flow, we will capture the Mapillary username of the authenticated user.

There will be a one-to-one relationship between Mapillary user and Trek View user as we will store the OAuth token generated against each Trek View account. Note, the Mapillary username must be unique (that is, two Trek View users cannot share the same Mapillary linked account).

The OAuth token will be automatically refreshed, unless user revokes access to Trek View to read data from their account (done via the Mapillary web UI).

### Retrieval of user sequence metadata

First it's important to define how sequences will be imported.

Before I set out on designing any UI elements I wanted to see what was possible via the Mapillary API.

I was hopeful when I saw the [Mapillary Sequence ID endpoint](https://www.mapillary.com/developer/api-documentation#sequence), however, the requires you to pass explicit `sequence_id`s with no options to search.

The only real way to retrieve sequences IDs for a user is via the [Image search endpoints](https://www.mapillary.com/developer/api-documentation#image).

Which raises another issue, there is no way to paginate through any of the Mapillary endpoints. The maximum results that can be returned (using the `limit` parameter) is 2000. 2000 image might return just 5 unique sequences (the most recently uploaded by the user). To put this into context, the trekviewhq Mapillary account has over 10 million images!

Immediately I wondered if exposing a way for a user to filter Mapillary images in the Trek View UI by;

* date/time range (using `start_captured_at` and `end_captured_at` parameters on the Image Search endpoint)
* bounding box by allowing user to draw it on a map (using `bbox` parameter on the Image Search endpoint)

However, it's feasible that even by first applying filters in the Trek View UI to limit the number of sequences returned from Mapillary could be problematic. Why? Even by applying a time range of a few hours could return more than 2000 images in the payload.

So I thought about how to do this using the trekviewhq data, which 

We often shoot video with frames that are extracted at 2 frames per second = 120 frames min = 7200 frames per hour (or 1800 frames per 15 mins)

Assuming users don't upload sequences with more than 2 frames per second, we could paginate through the Mapillary API using the `creator_username` parameter as well as the `start_captured_at` and `end_captured_at` at 15 minute increments for a certain time period.

At this point I also made the decision that Trek View would only contain 360 images, hence the use of `is_pano=true` parameter too.

e.g.

```shell
GET "https://graph.mapillary.com/images?creator_username=trekviewhq&start_captured_at=2020-01-01T00:00:00.000Z&end_captured_at=2020-01-01T00:15:00.000&is_pano=true&fields=sequence"
```

The certain time period could be defined by the user in the Trek View UI up to a maximum allowable range (e.g. 1 year, that's 8760 hours or 35040 fifteen minute increments).

[Requests to graph.mapillary.com are limited to 50,000 per minute per app](https://www.mapillary.com/developer/api-documentation#rate-limits). So spreading these requests for a year of data over a minute would still be well within limits. Of course, request to the Mapillary API would have to be queued (as many users might be importing sequences from Mapillary in parallel).

The app could then grab all unique entries returned via the image search endpoint for the `data.sequence` property.

Originally my plan was to pass the unique IDs one-by-one to the [Sequence ID endpoint](https://www.mapillary.com/developer/api-documentation#sequence) to get a list of image IDs that belong to the sequence...

```shell
GET "https://graph.mapillary.com/image_ids?sequence_id=vgeD6wUXBZWp1f5rVPE3zi"
```

```shell
{
    "data": [
        {
            "id": "6340819595977317"
        },
        {
            "id": "609628197766091"
        },
        {
            "id": "654815293145144"
        }
    ]
{
```

But that's super inefficient... as I remember we were already given this information in the previous request to the Image Search endpoint where all the image IDs were already posted.

This was all starting to prove frustrating, so I decided to simplify it both for the user and myself as follows;

When a user links their Mapillary account to Trek View at sign up, we simply iterate through all their images in 15 minute intervals, as describe above, from the year 2018 to now. 2018 is an arbitrary date, but one that seemed fairly sensible in terms of when 360 became mainstream.

For each user account, we check every 24 hours for new sequences (24 * 4 = 96 requests, per user, per day) and add them.

All sequences from Mapillary for a user will enter a draft sequence state, requiring a user to publish one or more of them (more on that later).

Now I needed to decide what data returned by the Image search endpoint needed to be stored in Trek View and also how it should be stored.

### Database design

We have a concept of images that are linked in a graph under the umbrella of a sequence.

e.g. Image 1 is joined to image 2 is joined to image 3.

As noted earlier in this post a Sequence has the following values properties by the user;

* name (optional, else sequence ID will be used)
* description (optional, else blank)
* transport type (required, dictionary of transport methods)
* tags (optional list of alphanumeric tags)

And some that are auto assigned;

* uuid 

* mapillary_id (data.sequence)
* mapillary_make (data.make)
* mapillary_model (data.model)
* mapillary_height (data.height)
* mapillary_width (data.height)
* mapillary_is_pano (data.is_pano), should always be true
* calculated_distance_meters (sum of distance between all ordered points in sequence, e.g. image 1 -> 2 -> 3)
* calculated_max_altitude_meters (image with highest mapillary_altitude)
* calculated_min_altitude_meters (image with lowest mapillary_altitude)
* calculated_elevation_change_meters (= calculated_max_altitude_meters - calculated_min_altitude_meters)
* calculated_average_speed_meters_second (speed = distance/time)
* trek_view_favourited_user_ids (a list of user IDs who have marked the sequence as a favourite)

Note, the assumption here is that the photo values (make, model, height and width) are the same for all images in the sequence (thus don't need to be stored per image, as they seem to be in Mapillary)

For each sequence one or more image. For each image we hold the following data that is all auto-assigned

* uuid
* sequence_uuid (the sequence ID the image belongs too)
* favourited_user_ids (a list of user IDs who have marked the image viewpoint)
* mapillary_id (data.id)
* mapillary_altitude (data.altitude)
* mapillary_captured_at (data.captured_at)
* mapillary_compass_angle (data.compass_angle)
* mapillary_geometry_latitude_longitude (data.geometry.coordinates)
* mapillary_computed_altitude (data.computed_altitude)
* mapillary_computed_compass_angle (data.computed_compass_angle)
* mapillary_computed_latitude_longitude (data.computed_geometry.coordinates)
* mapillary_computed_rotation (data.computed_rotation)
* calculated_next_image_uuid
* calculated_next_image_distance_meters
* calculated_previous_image_uuid

Images can be joined in the graph using the `sequence_uuid` and `mapillary_captured_at` properties.

To do this the images can first be sorted by `mapillary_captured_at` time with the earliest time (smallest epoch) first. This sort order defines how the images are connected. The first image has a n