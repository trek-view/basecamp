---
date: 2020-12-11
title: "Export your Photos From Google Street View"
description: "Use Google Takeout to get a copy of all your imagery hosted on Google Street View"
categories: 
tags: [Street View, Google]
author_staff_member: dgreenwood
image: /assets/images/blog/2020-12-11/google-takout-street-view-meta.jpg
featured_image: /assets/images/blog/2020-12-11/google-takout-street-view.jpg
layout: post
published: true
---

**Backup your Google Street View images**

Many of you have been uploading to Google Street View for years.

I know this because many of you have also asked if it’s possible to sync Google Street View data with Map the Paths because you don't have a backup of the original uploads.

Whilst a direct sync between Map the Paths and Street View is not possible due to limitations imposed by Google, you can download images from Google to your computer, and then reupload to Map the Paths.

Here's how to download all of your own imagery that is hosted on Google Street View:

## Google Takeout data download instructions

<img class="img-fluid" src="/assets/images/blog/2020-12-11/google-takout-street-view.jpg" alt="Google Takeout Street View" title="Google Takeout Street View" />

Google allow you download all your data, from any Google tool, using Takeout.

[You can access Google Takeout here](https://takeout.google.com/settings/takeout).

When logged in make sure Google Street View is checked and then select how you want to receive the data (keep in mind you might have 100's of GB's of data on Street View).

## Understanding the data

You’ll receive an email when your Street View imagery files are ready for download and where to download them from.

Depending on the size of the Street View data you've uploaded this process can take between hours and days.

**Photo uploads**

<img class="img-fluid" src="/assets/images/blog/2020-12-11/google-takeout-file-output.jpg" alt="Google Takeout Street View files" title="Google Takeout Street View files" />

For photo files uploaded to Street View you'll receive a mix of `.jpg` and `.json` files in the `.zip` file that Google sends you.

The `.jpg`'s are the photos you originally uploaded to Street View. They are named with [the unique Street View Photo ID of the photo](https://developers.google.com/streetview/publish/reference/rest/v1/photo), for example; `photo_CAoSLEFGMVFpcE5UejF0Q1kzNl9zV1IxZV9fekpZU.jpg`

You'll also notice a corresponding `.json` document for the photo (e.g `photo_CAoSLEFGMVFpcE5UejF0Q1kzNl9zV1IxZV9fekpZU.jpg` -> `meta_CAoSLEFGMVFpcE5UejF0Q1kzNl9zV1IxZV9fekpZU.json`).

This file contains the Photo ID's of other Street View photos that your Street View is connected to (connections that generate blue lines). Here's an example:

```
{"id":"CAoSLEFGMVFpcE5UejF0Q1kzNl9zV1IxZV9fekpZU","connections":["CAoSLEFGMVFpcE53RmVqeS16QXlwMGlnZFpxdENaRnV4akZhZUZZellFeWNDNVpm","CAoSLEFGMVFpcE13LUdPcFl5ZWl6Y3F3cUZtd0dORDQ2QXNMUjZjRHFyTzFXRmlo"]}
```

_For those who regularly use the Street View UI, you might be interested in this post to better understand other Street View variables: [Decoding a Google Street View URL](/blog/2020/decoding-google-street-view-urls)._

**Video uploads**

Update January 2021: [It appears takeout is not possible if your account has uploaded videos to Google Street View](https://campfire.trekview.org/t/downloading-your-own-images-from-google-street-view/505).

Let me know in that thread how you get on with this process. I'm especially keen to hear if Takeout works for people who have uploaded video and/or have a significant amount of content on Street View (100GB+).