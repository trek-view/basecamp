---
date: 2021-03-12
title: "Measuring the Condition of Cycle Paths With Only Your Phone"
description: "Use the rRuf mobile app to measure the surface of your ride."
categories: guides
tags: [rRuf, data bike, DMAMPO]
author_staff_member: dgreenwood
image: /assets/images/blog/2021-03-12/dmampo-data-bike-trail-quality-2019-meta.jpg
featured_image: /assets/images/blog/2021-03-12/dmampo-data-bike-trail-quality-2019-sm.jpg
layout: post
published: true
---

**Some new features for your data bike**

In 2019 I briefly mentioned the Des Moines Area Metropolitan Planning Organization Data Bike in my [DIY Street View Bike post](/blog/2019/diy-street-view-bike-tours).

<img class="img-fluid" src="/assets/images/blog/2021-03-12/dmampo-data-bike.jpg" alt="DMAMPO Data Bike report 2019 Data Bike" title="DMAMPO Data Bike report 2019 Data Bike" />

The [Data Bike](https://dmampo.org/data-bike/) specifications:

1. Yuba Spice Curry electric bike
2. Samsung Gear 360 degree camera
3. iPhone with [rRuf app](https://apps.apple.com/us/app/rruf/id968766794) installed
4. A rear facing GoPro Hero camera aimed at the ground

Not only is the 360 imagery used [on Google Street View](https://www.google.com/maps/contrib/104211468250721497845), the rRuf app and GoPro cameras are used to capture trail quality data which in turn is used to identify areas of maintenance and help set future trail budgets.

You can see an example of the augmented data in the [DMAMPO Central Iowa Trail Condition 2019 Report](https://dmampo.org/wp-content/uploads/2020/02/2019-Data-Bike-Report-1.pdf).

The DMAMPO team used a five point grading system for the quality of each trail:

1. Very Smooth
2. Smooth
3. Fair
4. Rough
5. Very Rough

<img class="img-fluid" src="/assets/images/blog/2021-03-12/dmampo-data-bike-trail-quality-2019.png" alt="DMAMPO Data Bike report 2019" title="DMAMPO Data Bike report 2019" />

For each trail captured, this grading system provides a very easy way to identify the trails in best and worst conditions.

This information is captured from the rRuf ('Road Roughness') app which  measures the roughness of a road using [the phones IMU](/blog/2020/360-camera-sensors-imu-accelerometer-gyroscope-magnetometer) and reports it in a scale known as a Riding Comfort Index (RCI).

## rRuf app

The app is available for [iOS](https://apps.apple.com/us/app/rruf/id968766794) and [Android](https://play.google.com/store/apps/details?id=com.rivalsolutions.rRuf) phones.

<img class="img-fluid" src="/assets/images/blog/2021-03-12/rruf-app-setup.png" alt="rruf app" title="rruf app" />

Once installed you can set the transport type. The app seems mainly designed for use with cars, but it does allow you to select Bike as a method of transport.

<img class="img-fluid" src="/assets/images/blog/2021-03-12/Quadlock-iPhone-Bike-Mount-and-Cycling-Case.jpg" alt="Quadlock iPhone Bike Mount" title="Quadlock iPhone Bike Mount" />

You'll want to find a secure and snug mount for your phone so that the data recording is captured in the most controlled way.

If you're planning to capture the quality of paved roads, [I can personally recommend the Qualock mount]https://www.quadlockcase.co.uk/products/bike-mount?variant=347933016082).

<img class="img-fluid" src="/assets/images/blog/2021-03-12/rruf-app-graph.png" alt="rruf app" title="rruf app" />

As you ride, the app captures the vibration recorded over time. Once complete, the app saves the following pieces of data into a `.txt` file:

* TimeStamp
* Roll
* Pitch
* Yaw
* UserAccX
* UserAccY
* UserAccZ
* GravX
* GravY
* GravZ
* GPSTimeStamp
* Lon
* Lat
* Alt
* Course
* Heading
* HeadingAccuracy
* Speed,
* HorAcc
* VerAcc
* PavementType
* PavementCondition

<img class="img-fluid" src="/assets/images/blog/2021-03-12/dmampo-data-bike-trail-quality-2019.png" alt="DMAMPO Data Bike report 2019 Data Bike report 2019 Clive Greenbelt" title="DMAMPO Data Bike report 2019 Data Bike report 2019 Clive Greenbelt" />

The time, GPS and pavement fields make it very useful in visualising the data.

As you can see in DMAMPO 2019 report extract above, the 1-5 grading system (PavementCondition) has been overlaid directly on the trail, highlighting the parts in worst condition.

The addition of the GoPro camera pointing at the trail surface the captures GPS tagged photos means that the areas of the trail in worst condition cannot only be quickly identified, but there is also high-quality images of what Very Rough actually means (is the paving meant to end, or is the paving broken>)

## Data Bikes Around the World

We're designing a universal data bike that can be used by local communities  around the world.

The bike will be cost effective, and have similar functions to the Iowa data bike offering the ability to capture 360 photos and record trail quality.

If you think a data bike could be a valuable addition to your local area, [please contact us for an early look at what we're planning](/contact).

In the meantime, avid cyclists should [see how Map the Paths can help improve accessibility](/blog/2021/how-map-the-paths-used-improve-accessibility), [take part in our safer.bike initiative](https://www.safer.bike/), or [grab some inspiration to build your own data bike](/blog/2019/diy-street-view-bike-tours).