---
date: 2021-04-02
title: "Measuring the Air Quality of Your Trek (Part 1)"
description: "Our hunt for a device that could measure air quality during adventures."
categories: guides
tags: [Atmotube]
author_staff_member: dgreenwood
image: /assets/images/blog/2020-04-09/uk-air-quality-meta.jpg
featured_image: /assets/images/blog/2020-04-09/uk-air-quality-sm.jpg
layout: post
published: true
---

**Searching for a portable air quality monitor.**

We've been on the hunt for a mobile air quality sensor [since we discovered they were fitted to Google Street View cars](/blog/2019/google-street-view-cameras-more-than-meets-the-eye
).

The [Aclima](https://www.aclima.io/) sensors fitted to Street View offer a very high level of accuracy.

Speaking to experts in the field we quickly realised that to achieve a high degree of accuracy we would need to spend a lot of money. To quote one person I spoke to:

> Trying to monitor AQ accurately you are looking into the £1000's  to do it properly. Low cost PM sensors are really indoor dust monitors only and without a heated element for high humidity readings the accuracy is less than 20%.

And even if we could afford it, such sensors require a large amount of power thus making them unsuitable for our [Trek Packs](https://guides.trekview.org/trek-pack/).

Though accuracy is indeed important, we are looking for more aggregate statistics. Questions like:

* Did we observe significant increases pollution during the journey
* In what areas?
* Did pollution change as we climbed to higher altitudes?

So we decided to see if consumer grade air quality sensors could answer these questions, with the consideration of accuracy at the forefront of our minds.

Our main requirements dictated the sensor:

* detected PM1, PM2.5, and PM10 pollutants
* could record data at defined interval, ideally up to 1 second apart
* had long battery life, ideally longer than 8 hours when in maximum use, and the ability to connect a powerpack to charge on the go
* data that could be exported in a generic format (like `.csv`) so that it could be used with other tool

[Looking at reviews online](https://www.which.co.uk/news/2019/10/my-week-with-the-atmotube-pro-air-quality-monitor/), we found the [Atmotube Pro](https://atmotube.com/products/atmotube-pro?view=en).

> Atmotube PRO detects PM1, PM2.5, and PM10 pollutants, like dust, pollen, soot, and mold, plus a wide range of Volatile Organic Compounds (VOCs). All in real time!

Sounds good! But remembering the advice from experts we dug a little deeper.

[Some reports for (seemingly) independent sources look promising](https://seetheair.wordpress.com/2020/02/18/low-cost-portable-monitors-vs-reference-monitors-part1/).

[The device also has a number of certifications](https://help.atmotube.com/technical/15-certification/).

And Atomotube also [publish the sensor specifications (which include parts from brand name manufacturers)](https://help.atmotube.com/technical/1-atmotube-specs/) and how they work...

## VOC sensor

A VOC (Volatile Organic Compounds) sensor directly measures ambient concentrations of a broad range of “reducing gases” associated with bad air quality. 

<img class="img-fluid" src="/assets/images/blog/2021-04-02/atmotube-voc-sensor.gif" alt="Atmotube VOC sensor" title="Atmotube VOC sensor" />

The sensing principle is based on a heated film of metal-oxide (MOx) nanoparticles. Adsorbed oxygen on the metal-oxide particles reacts with the target gas and thereby releases electrons. This results in a change of the electrical resistance of the metal-oxide layer that is measured by the sensor.

[More details can be found here](https://help.atmotube.com/technical/2-atmotube-voc/).

## PM sensor

A PM (Particulate Matter) sensor measures solid and liquid particles suspended in air, many of which are hazardous. This complex mixture includes both organic and inorganic particles, such as dust, pollen, soot, smoke, and liquid droplets.

These particles vary greatly in size. To help classify particulate matter in the air the particles are typically grouped by size.

* PM1 – particles <1 μm (microns) in size (diameter). Examples: dust, combustion particles, bacteria and viruses.
* PM2.5 – particles <2.5 μm in size. Examples: pollen, spoors and other organic particles.
PM10 – particles <10 μm in size. Examples: coarser fine dust and organic particles.

<img class="img-fluid" src="/assets/images/blog/2021-04-02/atmotube-pm-sensor.png" alt="Atmotube PM sensor" title="Atmotube PM sensor" />

The PM sensor uses [a laser scattering principle](https://en.wikipedia.org/wiki/Light_scattering_by_particles), which works by using a laser to radiate suspending particles in the air. Then scattering light is collected in a certain degree, and finally the curve of scattering light change with time is obtained. In the end, equivalent particle diameter and the number of particles with different diameter per unit volume can be calculated by microprocessor based on [MIE theory](https://en.wikipedia.org/wiki/Mie_scattering).

[More details can be found here](https://help.atmotube.com/technical/3-atmotube-pm/).


## AQS

TO help make all these reported measurements easier to understand at a glance, [AtmoTube have created an accumulative parameter called Air Quality Score (AQS)](https://help.atmotube.com/faq/9-atmotube-aqs/) that can instantly give you an understanding of the quality of the air around you. The reported value is a function of VOC and all PM measurements.

The AtmoTube AQS ranges from 0 (severely polluted air) to 100 (very clean) points.

* Air is good (81-100)
* Air is moderate (61-80)
* Air is polluted (41-60)
* Air is very polluted (21-40)
* Air is severely polluted (0-20)

## Data / Storage

The Atmotube PRO has an accompanying app for [iOS](https://itunes.apple.com/us/app/atmotube/id1080310110?ls=1&mt=8) and [Android](https://play.google.com/store/apps/details?id=com.atmotube.app). Both allow

> If you need to dive deeper into analysis all your gathered data always can be exported in basic CSV format. 

[Both allow you to export data](https://help.atmotube.com/app/6-atmotube-csv/).

The data is perfect because it reports the raw result, the date/time of the result which can be used to link it to a photo, and GPS positioning information at the time of the measurements allowing for easy mapping (the only thing missing is altitude, but I can use a [Digital Elevation Model](what-is-a-digital-elevation-model))  for that.

Here's a sample of the data reported:

|Date               |VOC, ppm|AQS|Temperature, ¬∞F|Humidity, %|Pressure, mbar|PM1, ug/m¬≥|PM2.5, ug/m¬≥|PM10, ug/m¬≥|Latitude  |Longitude   |
|-------------------|--------|---|----------------|-----------|--------------|-----------|-------------|------------|----------|------------|
|2019-09-18 18:37:00|0.21    |87 |73.4            |52.0       |1004.64       |1.0        |2.0          |3.0         |37.7749243|-122.4544349|
|2019-09-18 18:38:00|0.21    |87 |73.4            |52.0       |1004.64       |1.0        |2.0          |3.0         |37.7749243|-122.4544349|
|2019-09-18 18:39:00|0.207   |87 |73.4            |52.0       |1004.68       |1.0        |2.0          |3.0         |37.7749243|-122.4544349|
|2019-09-18 18:40:00|0.205   |87 |73.4            |52.0       |1004.69       |1.0        |2.0          |3.0         |37.7749243|-122.4544349|
|2019-09-18 18:41:00|0.205   |87 |73.4            |52.0       |1004.73       |1.0        |2.0          |3.0         |37.7749243|-122.4544349|

In the table above, the measurement interval is every 1 minute, which is too far apart for our use-case.

The VOC sensor can measure at [2 second intervals](https://help.atmotube.com/technical/2-atmotube-voc/) which is much closer to our needs.

PM sensor....

Increasing the amount of measurements will reduce battery life. [According to Atmotube's specifications the PRO will last](https://help.atmotube.com/technical/1-atmotube-specs/):

> up to 10 days (depending on the measurement intervals)

Though this which report notes it "[will last two and a half days with the PM set to five-minute intervals](https://www.which.co.uk/news/2019/10/my-week-with-the-atmotube-pro-air-quality-monitor/)".

Luckily [the Atmotube has a USB-C port the can be connected to external power on the move](https://help.atmotube.com/technical/6-atmotube-charging/), like a powerpack, thus significantly increasing the devices' range.

Memory is also a consideration when increasing interval. The PRO has 256kB storage which Atmotube say equates to a 10 days worth of data.

## Other considerations

> Atmotube is not a water-resistant device; keep the Atmotube away from water or any moisture.

[One downside is that the PRO is not waterproof, which is understandable given how the sensors work](https://help.atmotube.com/technical/7-atmotube-operation/).

> Product can be used at a temperatures between -5°C and 50°C (23°F and 122°F). Avoid any extreme temperature changes. Recommended conditions for accurate readings are: 0°C to 30°C at less than 85% humidity.

Which is about right for most of Central and Northern Europe / America / Asia for the Spring, Summer, and Autumn months.

## Final verdict

Sounds promising!

[We stumped up the £150 and purchased one](https://atmotube.com/products/atmotube-pro?view=en).

We're not expecting the results to be perfect, but hope they can provide some general understanding of the environment around our trekkers.

I'll report back on our experiences as we start using it with the [Trek Packs](/trek-pack). Check back soon!