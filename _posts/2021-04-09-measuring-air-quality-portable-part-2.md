---
date: 2021-04-09
title: "Measuring the Air Quality of Your Trek (Part 2)"
description: "Our initial thoughts after testing the AtmoTube Pro."
categories: guides
tags: [AtmoTube]
author_staff_member: dgreenwood
image: /assets/images/blog/2021-04-09/AQS-map-Farnborough-Airport-Loop-2021-03-14-meta.jpg
featured_image: /assets/images/blog/2021-04-09/AQS-map-Farnborough-Airport-Loop-2021-03-14-sm.jpg
layout: post
published: true
---

**Monitoring air quality on the move.**

[My AtmoTube Pro arrived recently](/blog/2020/measuring-air-quality-portable-part-1). It didn't take long before I started testing it out.

This post is a short review of what I've liked and disliked so far.

## Unboxing

<img class="img-fluid" src="/assets/images/blog/2021-04-09/atmotube-size.jpg" alt="AtmoTube size" title="AtmoTube size" />

The device itself is about the length and width of a credit card, and has a depth of two modern smartphones (exact measurements: 86 x 50 x 22 mm).

Inside the box is:

* AtmoTube Pro
* USB-A to USB-C wire (for charging)
* Caribiner (to attach the device to something)

<img class="img-fluid" src="/assets/images/blog/2021-04-09/atmotube-app-home-screen.png" alt="AtmoTube App Home Screen" title="AtmoTube App Home Screen" />

You'll need to download the accompanying AtmoTube mobile app to get it working:

* [iOS](https://itunes.apple.com/us/app/atmotube/id1080310110?ls=1&mt=8)
* [Android](https://play.google.com/store/apps/details?id=com.atmotube.app)

Unlike some devices, the AtmoTube Pro paired (over Bluetooth) with my phone seamlessly.

<img class="img-fluid" src="/assets/images/blog/2021-04-09/atmotube-backpack-clip.jpg" alt="AtmoTube caribiner" title="AtmoTube caribiner" />

The included caribiner also works perfectly to attach the device to a bag.

## Setup

It's important to note that I'm reviewing the AtmoTube Pro as a data collection device.

The AtmoTube Pro has a number of features I'm not interested in for the purpose of mounting the monitor to a [Trek Pack](/trek-pack).

The mobile app is nicely designed, and generally quite intuitive when trying to figure something out.

I wanted to first set the data capture interval to be as granular as possible.

<img class="img-fluid" src="/assets/images/blog/2021-04-09/atmotube-settings-1.png" alt="AtmoTube App Settings" title="AtmoTube App Settings" />

<img class="img-fluid" src="/assets/images/blog/2021-04-09/atmotube-set-measurement-interval.png" alt="AtmoTube App Set measurement interval" title="AtmoTube App Set measurement interval" />

Under setting you can adjust the PM (Particulate Matter) sensor measurement interval to one of 4 defined settings:

* Always on
* 5 minutes
* 10 minutes
* 15 minutes

For the VOC (Volatile Organic Compounds) sensor, I was unable to find a setting that allowed me to change the interval.

Regardless, always on results in a measurement from all sensors being recorded every 1 minute.

Such a large gap between recorded measurements is not ideal, we'd prefer a resolution of at least ten seconds, but I assume this is a trade-off for battery life on a portable sensor like this.

## Results

The holes in the casing are on the front so I made sure these were facing forward to capture the airflow. I'm not sure if this is recommended, especially when traveling fairly quickly on a bicycle as I did for this test. 

Living close to a number of airports, air quality is always at the back of my mind as planes fly over. I decided to take a quick bike ride with my AtmoTube Pro to capture some measurements. 

<img class="img-fluid" src="/assets/images/blog/2021-04-09/atmotube-settings-2.png" alt="AtmoTube App Settings" title="AtmoTube App Settings" />

<img class="img-fluid" src="/assets/images/blog/2021-04-09/atmotube-set-data-export-time.png" alt="AtmoTube App Data Export Settings" title="AtmoTube App Data Export Settings" />

To export the logged data from the app, you navigate to the settings page and select the date range you want the data for.

<img class="img-fluid" src="/assets/images/blog/2021-04-09/atmotube-csv-save-android.png" alt="AtmoTube App Data Export Android" title="AtmoTube App Data Export Android" />

Once you've selected a date, the app will save a `.csv` file to your phones internal storage. On Android devices to get to the file go to: `Files` > `Internal Storage` > `AtmoTube`.

Open the `.csv` on your computer and you'll find the following values recorded:

* `Date`
* `VOC, ppm` 
* `AQS`
* `Temperature, ¬∞F`
* `Humidity, %`
* `Pressure, mbar`
* `PM1, ug/m¬≥` 
* `PM2.5, ug/m¬≥`
* `PM10, ug/m¬≥`
* `Latitude`
* `Longitude`

[Take a look at the first post in this series for a deeper explanation on each value](/blog/2021/measuring-air-quality-portable-part-1).

[Here's the resulting capture from my morning bike ride](https://docs.google.com/spreadsheets/d/1tK9C1pA1FxVW1fkH60rmpfiiPejtUFvzMo-nDWwZfaw/edit?usp=sharing).

<iframe src="https://www.google.com/maps/d/u/1/embed?mid=1ZbkgoL6nBT3PlL5JoHM7hAzxky6laoYn" width="640" height="480"></iframe>

The above map shows the Air Quality Score (AQS) by position. 

<img class="img-fluid" src="/assets/images/blog/2021-04-09/AQS-pollution-Farnborough-Airport-Loop-2021-03-14.png" alt="AQS on Farnborough Airport Loop (2021-03-14)" title="AQS on Farnborough Airport Loop (2021-03-14)" />

[The mean average AQS for my ride was 96.22](https://docs.google.com/spreadsheets/d/1tK9C1pA1FxVW1fkH60rmpfiiPejtUFvzMo-nDWwZfaw/edit#gid=2042347909), which is very good (the highest score possible being 100).

Overall the AtmoTube Pro reported the air quality as I would expect. For example, during the middle of the journey I rode through thick, visible smoke in the air coming from a bonfire about 20 meters away. At this point you can see the AQS dip to 46.

<img class="img-fluid" src="/assets/images/blog/2021-04-09/PM-pollution-Farnborough-Airport-Loop-2021-03-14.png" alt="PM1, PM2.5, PM10 on Farnborough Airport Loop (2021-03-14)" title="PM1, PM2.5, PM10 on Farnborough Airport Loop (2021-03-14)" />

<img class="img-fluid" src="/assets/images/blog/2021-04-09/VOC-pollution-Farnborough-Airport-Loop-2021-03-14.png" alt="VOC on Farnborough Airport Loop (2021-03-14)" title="VOC on Farnborough Airport Loop (2021-03-14)" />

Looking at the two graphs above you can see the fire caused a massive spike in PM1, PM2.5 and PM10 pollution (having a slight effect on VOC in the air).

When I arrived home you can see VOC spike which I believe is down to household products that had been used to clean the house earlier in the day.

Overtime I've been running the AtmoTube Pro indoors and the amount of VOC's measured isn't quite as high, but still noticeably higher than measurements taken in my garden.

## Things I didn't like

The most obvious flaw is that GPS receiver does not appear to be particularly good (see my post, [GPS 101](/blog/2020/gps-101), for reasons why this might be the case).

In many instances, the latitude and longitude reported is significantly erroneous. I've drawn an outline of my route using the polygon on the map above. Compare that line to the plotted points and you can see many are 100's of meters off-line.

The receiver also seems to struggle to stay locked to satellites in places with mild tree cover. I was moving the whole time on this journey, yet for 5 minutes the device reported that I was in the exact same place (between `11:54:00` and `11:59:00`, `latitude=51.2372807` and `longitude=-0.8153424)`.

For us this is not a deal breaker. If you use a reliable GPS tracker ([like your 360 camera](/blog/2020/metadata-exif-xmp-360-photo-files)) to record your journey, you can match the time of each measurement on each device to overwrite the incorrect GPS points reported in the AtmoTube Pro output.

I also noticed that altitude was not reported in the output file, despite claims on the box and instructions that this was captured. Using an external tracker again or a [Digital Elevation Model](/blog/2020/what-is-a-digital-elevation-model) will solve this problem.

## Coming soon...

We are building functionality that will allow AtmoTube Pro AQS data to be attached to [Map the Paths sequences](https://www.mapthepaths.com/) so that you and viewers of your virtual tours can see the air quality at the time the image was taken.