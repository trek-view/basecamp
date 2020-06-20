---
date: 2020-01-10
title: "Underwater Street View"
description: "The challenges and solutions we've faced capturing underwater 360-degree tours."
categories: guides
tags: [Street View, 360Bubble. HoudahGeo]
author_staff_member: dgreenwood
image: /assets/images/blog/2020-01-10/street-view-underwater-meta.jpg
featured_image: /assets/images/blog/2020-01-10/street-view-underwater-sm.jpg
layout: post
published: true
---

**Mapping underwater highways.**

Unusual creatures, amazing geological features, sunken treasure...

Our oceans are amazing places.

Despite this,

> More than eighty percent of our ocean is unmapped, unobserved, and unexplored. Much remains to be learned from exploring the mysteries of the deep

[As reported by the National Ocean Service (US)](https://oceanservice.noaa.gov/facts/exploration.html).

Knowing the GoPro Fusion's on our Trek Packs are waterproof, we took a boat out to sea to start shooting.

Though we quickly ran into problems...

## Water changes the effect of light

**Problem**

Without going _too deep_, having water directly on the GoPro Fusion's causes light refraction issues.

Light behaves differently in water and differences in light on either side of the camera cause issues during stitching, including stitch lines in the photo and focus problems (blurring of photo).

To solve these problems, a clear barrier between the water and camera is required. The cleanest way to achieve this is with a "fishbowl design".

**Solution**

[Introducing the 360 Bubble](https://360bubble.co/).

<img class="img-fluid" src="/assets/images/blog/2020-01-10/gopro-fusion-360-bubble.jpg" alt="Trek View GoPro Fusion Bubble mount" title="Trek View GoPro Fusion Bubble mount" />

It's suitable for GoPro Fusion, GoPro Max, Ricoh Theta S/V, Samsung Gear 360/Gear 360 2017, Garmin Virb, Insta360 ONE, Nikon Keymission 360 and many other consumer 360 cameras and rated for use to a depth of 10 meters.

The downsides; it's a little bulky to put in your hand luggage (and requires a hard case when placed in checked luggage). And the price.

## GPS does not work underwater

**Problem**

GPS does not work underwater, especially in salt-water.

The reason; radio signals do not propagate very far underwater. The heavy salt-water just makes this worse.

Take a GPS receiver, place it just 30 cm underwater, and it'll probably lose its lock on to any GPS satellites.

Despite the GoPro Fusion being waterproof rated to 10m, this does not include GPS functionality.

This means you'll need a receiver on the surface to capture a GPS track of your dive.

As always, we needed a cheap and easy solution.

**Solution**

<img class="img-fluid" src="/assets/images/blog/2020-01-10/trek-view-swim-buoy-gps-reciever-1.jpg" alt="Trek View GPS Swim Buoy" title="Trek View GPS Swim Buoy" />

After some experimentation we used a swim buoy with a GPS receiver watch inside it tied to the diver using a dive rope (we were diving in an open area).

We chose a cheap [swim buoy](https://www.amazon.co.uk/gp/product/B07DDCMYYZ/) and [GPS receiver with a good chipset](https://www.amazon.com/Columbus-P-1-Professional-Data-Logger/dp/B07MD6TWW9). You could also use a smartphone to track the surface GPS log (we were a little worried about getting ours wet!).

Don't worry about placing the GPS tracker in the dry buoy -- [GPS will work through plastic](https://blog.mapspeople.com/gps-the-complete-guide).

On the boat we turn on the GoPro Fusion, setting it to 5 second timelapse mode without GPS.

When the diver gets in the water, we turn on the watch to capture location every second.

As the diver moves in the water, they keep the buoy string tight to keep it as close to overhead as possible.

It's not perfect, and does not capture depth (we're currently experimenting with dive watch data) but works surprisingly well when out in the harsh conditions of the ocean.

The only issue we've suffered is the camera overheating in the bubble after around 2 hours of continuous shooting (due to the lack of airflow in the 360 Bubble). We've found no solution to this issue yet, and know all housings will suffer the same issue.

## Photo EXIF data and GPS data are separate

**Problem**

After capturing the photos and GPS track, you'll need to geotag the photos (add GPS co-ordinates to photos EXIF data).

Even 1 minute of footage (at 5 second timelapse) will produce 12 photos that need to be geotagged.

[Luckily there are lots of software tools that can automate the geotagging of images](https://havecamerawilltravel.com/photographer/geotagging-software/).

**Solution**

<img class="img-fluid" src="/assets/images/blog/2020-01-10/HoudahGeo5-Screenshot-Automatic.jpg" alt="HoudahGeo5" title="HoudahGeo5" />

[We use HoudahGeo 5](https://www.houdah.com/houdahGeo/) to geotag our photos and believe it is well worth the $50 price tag (there is a free trial).

The geotagging process is fairly straightforward and HoudahGeo 5 gives you an enormous amount of control over the geotagging process.

GoPro Fusion studio looks for GPS co-ordinates in the front images (identified by prefix `GF`), therefore you need to geotag only the front facing images.

For our requirements, we set HoudahGeo 5 to match the time of the photo to the timestamp of GPS co-ordinates for geotagging. Clearly this means that it is vital the camera and GPS receiver clocks are in-sync (although HoudahGeo does allow you to correct time offsets between devices if they deviate -- a very useful feature).

## Google Street View does not support underwater photos

**Problem**

This is not true. Google Street View does support underwater 360-degree photos.

**Solution**

<img class="img-fluid" src="/assets/images/blog/2020-01-10/google-street-view-underwater-diving.png" alt="Google Street View underwater" title="Google Street View underwater" />

[Here are some of the dive sites already captured on Google Street View to inspire you](https://www.google.com/streetview/gallery/#oceans/).

Many of these were captured by [the Underwater Earth team](https://www.underwater.earth) (who inspired this post -- [check out their cameras](https://www.underwater.earth/gallery)!).

## Become a Trekker

Our oceans are changing quickly.

From temperatures bleaching coral reefs to plastic pollution collecting in giant "garbage patches".

We need to do a lot more to protect our oceans, and that starts through education.

Help us capture underwater images to inspire others to get involved in marine conservation efforts and keep a record of our oceans health.

We'll provide the camera kit (including a 360 Bubble), you just need to provide the boat.

[Apply to join our Trekker program here](/loan).