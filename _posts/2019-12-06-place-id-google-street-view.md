---
date: 2019-12-06
title: "What is a Place ID?"
description: "And how to make sure you're not missing out on Google Local Guide points from Street View photos."
categories: developers
tags: [Google, Street View, PlaceID, Tourer, Map the Paths]
author_staff_member: dgreenwood
image: /assets/images/blog/2019-12-06/unknown-place-google-street-view-meta.jpg
featured_image: /assets/images/blog/2019-12-06/unknown-place-google-street-view-sm.png
layout: post
published: true
---

**And how to make sure you're not missing out on Google Local Guide points from Street View photos.**

It's because your photo has no Place ID.

[Place IDs uniquely identify a place in the Google Places database and on Google Maps](https://developers.google.com/places/place-id).

The Place ID for the UK Houses of Parliament is:
`ChIJGeGDRsQEdkgRZ6FVAXOU4ds`

The White House Place ID is: `ChIJ37HL3ry3t4kRv3YLbdhpWXE`

And the Mount Everest Place ID is: `ChIJvZ69FaJU6DkRsrqrBvjcdgU`

If you're interested, you can find the Place ID of a particular location using [this online tool](https://developers.google.com/places/place-id), although it won't have much use outside of Google.

Whilst it might not have much use outside of Google, it is an important part of Google Street View uploads.

When we started publishing photos to Street View using Tourer [we we're just passing `photo.pose` information along with the photo to the Street View Publish API (latitude, longitude and altitude)](https://developers.google.com/streetview/publish/reference/rest/v1/photo#pose).

This was enough information for the photo to be published, but not enough to locate the photo to a place against the Google Places database.

<img class="img-fluid" src="/assets/images/blog/2019-12-06/unknown-place-google-street-view-sm.png" alt="Unknown Place Google Street View" title="Unknown Place Google Street View" />

Now, the place is not critical to Street View (as I mentioned, the photo will still upload), however, it is critical to [Google Maps Local Guides](https://maps.google.com/localguides) scoring functionality. Without a Place ID your photos will show as "Unknown Location" and they will not be eligible for Local Guides points.

[And we wanted our Local Guides points](https://www.google.co.uk/maps/contrib/103906017035515964929/)!

For those unaware, you can earn points by contributing content to Google Maps by becoming a [Local Guide](https://support.google.com/local-guides/answer/6225846?hl=en-GB&ref_topic=6225845).

Every place that you review, photograph, add, edit or provide additional info for on Google Maps [earns you points towards unlocking something new](https://support.google.com/local-guides/answer/6225851?hl=en-GB).

[Each published GSV photo upload earns 5 points](https://support.google.com/local-guides/answer/6225851?hl=en-GB) -- BUT ONLY IF it is assigned to a Place in the Google Places database (using Place ID).

To do this, you need to [submit `photo.place` (the Place ID) when uploading  the photo using the Street View Publish API](https://developers.google.com/streetview/publish/reference/rest/v1/photo#Place).

So how do you get a Place ID?

[Using the Google Maps Reverse Geocoding API](https://developers.google.com/maps/documentation/geocoding/intro#ReverseGeocoding).

Submitting the latitude and longitude to the Geocoding API will usually return a number of `place_id` in the response (with lots of other information too). 

For example: `https://maps.googleapis.com/maps/api/geocode/json?latlng=40.714224,-73.961452&key=YOUR_API_KEY`

[Here's the response](https://developers.google.com/maps/documentation/geocoding/intro#ReverseGeocoding).

Google will usually return a number of `place_id`'s for each place that matches the co-ordinates. Note, Google classifies various levels of places from buildings to cities to states (e.g the Googleplex has a `place_id=ChIJj61dQgK6j4AR4GeTYWZsKWw` and California has a `place_id=ChIJPV4oX_65j4ARVW8IJ6IJUYs`).

You can filter the response to include / exclude certain place levels. For example, passing using the `result_type=locality` only returns results for places at locality level (usually towns / cities).

Building this into Tourer, the following tour / photo creation logic is performed:

1. User defines tour (photos and meta-data)
2. Tourer photo validation (does it have GPS? correct size? correct format?)
3. Tourer performs reverse geocoding (assigns country, location codes, etc.). The reverse geocoding also returns matching Places and assciated Place IDs for the user to select.
4. Tourer uploads to Google Street View (and/or other selected integrations)

[You can read more about Tourer's logic in the developer docs](https://github.com/trek-view/tourer).

And with a Place ID now being submitted to Street View, you will earn every single Local Guide point you deserve when using Tourer!

## Download Tourer

[Download now](https://github.com/trek-view/tourer).

_Update October 2020: Tourer has been replaced with the Map the Paths Desktop Uploader. [More information and download links are here](/blog/2020/map-the-paths-desktop-uploader)._