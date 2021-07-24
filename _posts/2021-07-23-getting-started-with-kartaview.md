---
date: 2021-07-23
title: "An Introduction to KartaView"
description: "Formerly named OpenStreetView and then OpenStreetCam, KartaView is a completely open-source street-level image platform."
categories: guides
tags: [KartaView, Map the Paths]
author_staff_member: dgreenwood
image: /assets/images/blog/2021-07-23/kartaview-index-map-meta.jpg
featured_image: /assets/images/blog/2021-07-23/kartaview-index-map-sm.jpg
layout: post
published: true
---

**Yet another street-level imagery platform.**

I've recently begun exploring the possibility of adding an integration with [KartaView](https://kartaview.org/) to the [Map the Paths Uploader](https://www.mapthepaths.com/uploader).

KartaView was founded in 2009 as OpenStreetView. In 2016, [TeleNav](https://www.telenav.com/) took over the openstreetview.org domain and started its own service under the name. The service was renamed to OpenStreetCam after an intervention by an unnamed trademark holder (probably Google).

On December 12, 2019, TeleNav sold OpenStreetCam to [Grab Holdings](https://www.grab.com/sg/) for an undisclosed amount. In November 2020, OpenStreetCam became KartaView.

[There are already more than 384 million images on KartaView, covering almost 8 million kilometers of road](https://blog.improveosm.org/en/).

<img class="img-fluid" src="/assets/images/blog/2021-07-23/kartaview-index-map-sm.jpg" alt="KartaView street-level road imagery" title="KartaView street-level road imagery" />

The focus of KartaView is road based imagery, much of which is from dashcam footage and is not 360 (`equirectangular`). This explains why it was of interest to Grab for an acquisition (they are a Singapore based food delivery service).

There are a two ways to upload imagery to KartaView:

1. [iOS](https://apps.apple.com/us/app/kartaview/id1089548849) and [Android](https://play.google.com/store/apps/details?id=com.telenav.streetview&hl=en_GB&gl=US) mobile apps 
2. [Using the KartaView upload scripts](https://github.com/kartaview/upload-scripts)

Most dashcam footage uploaded to KartaView comes from people capturing images in their vehicles using their phones.

[KartaView has a leaderboard of uploads](https://kartaview.org/leaderboard), the top contributor at the time of writing, [JB Brown](https://kartaview.org/user/jb-brown), has uploaded 653,091.26k (or 97,407,587 points in KartaView) using an Android device.

Any image uploaded to KartaView is released under a [CC-By-SA License](https://kartaview.org/terms#terms3) by it's owner and can be downloaded in the web app or API by other users.

<img class="img-fluid" src="/assets/images/blog/2021-07-23/kartaview-sequence-navigation.jpg" alt="KartaView sequence navigation" title="KartaView sequence navigation" />

One of the neat features of KartaView I really like is the ability to recreate the journey bu quickly navigating through the images in a sequence using the timeline (though no automatic playback like Mapillary).

Like Mapillary, KartaView has a good level of integration with OpenStreetMap, [including their OpenStreetCam JOSM plugin](https://blog.improveosm.org/en/openstreetcam-josm-plugin-new-features-2/). When browsing images in the web app, you can use the OSM tab to jump into editing tools.

<img class="img-fluid" src="/assets/images/blog/2021-07-23/kartaview-image-detections.jpg" alt="KartaView object detections" title="KartaView object navigation" />

KartaView also offer three types of detections inside the images:

1. Traffic signs
2. Personal identifiable info
3. POIs

That said, I have not been able to get this to display on the UI, [nor do I see this data exposed via the KartaView API](http://doc.kartaview.org/#tag/Photo).

All of their codebase is open on GitHub, including the [core website](https://github.com/kartaview) and mobile apps ([Android](https://github.com/kartaview/android) and [iOS](https://github.com/kartaview/ios)) for uploading imagery, all of which are offered under [MIT licenses](https://kartaview.org/terms#terms4).

I'm going to spend a few hours in the coming week exploring the KartaView codebase and the KartaView API. Check back next Friday when I should have a detailed technical write up of my findings.