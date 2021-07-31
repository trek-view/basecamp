---
date: 2021-04-23
title: "Trek View Trail Quality Index"
description: "We continue to build out our Data Bike and are now trying to establish a global standard to measure cycle trail quality."
categories: guides
tags: [Data Bike, DMAMPO, Minnesota]
author_staff_member: dgreenwood
image: /assets/images/blog/2021-04-23/trail-roughness-index-meta.jpg
featured_image: /assets/images/blog/2021-04-23/trail-roughness-index-sm.jpg
layout: post
published: true
---

**We continue to build out our Data Bike and are now trying to establish a global standard to measure cycle trail quality.**

[In the previous post I considered some apps that can be used to record raw data from your phones IMU](/blog/2021/measuring-condition-cycle-paths-phone-update).

<img class="img-fluid" src="/assets/images/blog/2021-04-23/ResearchBikeInfographic-sm.jpeg" alt="Minnesota Research Bike" title="Minnesota Research Bike" />

[The Parks & Trails Council of Minnesota operate a Research Bike that documents the state of their cycling trails](https://www.parksandtrails.org/mn-state-trails/). In addition to their interactive maps, [you can view their previous State of the Trails reports here](https://www.parksandtrails.org/advocacy/research/ptc/state-of-the-trails-report/).

These reports contain a Trail Roughness Index (TRI), an aggregated score created by the Parks & Trails Council of Minnesota:

> Trail Roughness Index is measured by riding a trail with a device called an accelerometer mounted on the bike’s handle bars. When the bicyclist hits a crack or bump in the trail, the accelerometer measures the force of the jolt felt by the bicyclist. The TRI is a statistical summary of the accelerometer data that indicates the roughness of the ride. Low TRI scores indicate trails in excellent condition (TRI < 30) and high TRI scores indicate trails in very poor condition (TRI > 75).

This posts details my attempt at creating a Trail Quality Index using a similar approach.

## Orientation

[I strongly recommend reading about Accelerometers in this post if you're new to their functionality](/blog/2020/360-camera-sensors-imu-accelerometer-gyroscope-magnetometer/).

<img class="img-fluid" src="/assets/images/blog/2021-04-23/accelerometer-axes.png" alt="Accelerometer Phone Orientation" title="Accelerometer Phone Orientation" />

An accelerometer measures change in velocity across 3 planes; x, y, and z. The diagram shows how these planes are orientated in relation to your phone or tablet. Orientation is uniform across devices, so all apps can read the data in an expected standard.

The orientation of the phone has an impact on the measurements recorded. The main data point we're looking to identify is the vertical (up and down) motion caused by uneven surface trail (assuming the phone is laid flat).

If you were to lay the phone on its side, we would be measuring change in velocity along the x axis to measure change in vertical acceleration whilst bumping up and down. If the phone was standing up-right this measurement would be taken from the y axis.

A more complex calculation would consider change across all axis against the orientation of the phone (captured by the gyroscope). However, because our capture conditions are somewhat controlled on fairly level trails and such a calculation involves a certain level of mathematical complexity, I'm keeping it simple for now.

To ensure accuracy with this approach requires the phone to be mounted in a secure and snug mount as flat as possible to the ground because I'll be measuring change in velocity exclusively along the z axis.

## Choosing what data to measure

To capture data I used [the Physics Toolbox Sensor Suite Pro app on my phone](/blog/2021/measuring-condition-cycle-paths-phone-update). Any app that can measure raw accelerometer data will work using my approach.

The linear accelerometer measures acceleration in a straight line in three different dimensions. Linear acceleration changes whenever the mobile device speeds up, slows down, or changes direction. When the mobile device is at rest with respect to the surface of the earth, it reads acceleration values of 0, 0, 0.

The linear accelerometer measures acceleration (m/s^2) and g-force (G) along the three planes; x, y, z.

1. `ax`
2. `ay`
3. `az`

The concept of G’s, or “G-forces,” refers to multiples of the acceleration due to gravity and the concept applies to acceleration in any direction, not just toward the Earth. 1G is the acceleration we feel due to the force of gravity.

For example, let's say you accelerate from 0-100km/h in 2.3 seconds. 100kph is 28m/s, 28 / 2.3 = 12m/s^2, 12 / 9.8 = 1.2G (y).

G-force is often used express the forces on the human body during acceleration, and is a perfect measure of change in force on the bike and its rider across the z axis as they travel along the trail.

## Capturing the data

Controlling for speed is important to ensure TRI scores are comparable across data samples.

Imagine traveling fast on a bike, you tend to fly over the smaller bumps in the road. Following a gravel path more slowly and it's likely you'll feel the small undulations in the rocky surface in much greater detail.

The inverse is also true. Hit a large object quickly, like a curb, and you'll feel it much more than hopping up it slowly.

Similarly, it is important weight, riding style and bike remain controlled between each capture to ensure consistency.

I setup the app to record data at 100Hz (100 measurements every second), which is a nice trade-off between measurement interval and battery life for a short ride (as more measurements result in shorter battery life due to the extra powered required).

[Here's a sample I recorded riding a short section of gravel path](https://docs.google.com/spreadsheets/d/1vMaM0sIYfjo_hakI0149BpjLZKzTjQGaETZNed02T-8/edit?usp=sharing).

## Interpreting the data

Below are the aggregated results for a 20 second stretch of the gravel path. [You can view the imagery on Map the Paths here](https://www.mapthepaths.com/sequence/97e30969-119c-4350-807d-f8469328de75/detail?image_key=4UFwdlSC9MynUdUQ8xXhnA&view_mode=original&show_gpx=false) (_note, I did not have a camera during this ride and the linked imagery is from a seperate capture on foot_).

<table>
<thead><tr><th>time</th>
<th>gFz (moving ave)*100</th>
<th>Latitude (end of segment)</th>
<th>Longitude (end of segment)</th>
<th>Speed (m/s) (moving ave)</th>
</tr></thead>
<tbody><tr>
<td>09:47:06:023</td>
<td>69.36168421</td>
<td>51.31537657</td>
<td>-0.79423086</td>
<td>1.084736871</td>
</tr>
<tr>
<td>09:47:07:011</td>
<td>65.15789474</td>
<td>51.31539302</td>
<td>-0.79422745</td>
<td>0.9967368506</td>
</tr>
<tr>
<td>09:47:08:001</td>
<td>65.72189474</td>
<td>51.31538571</td>
<td>-0.79421406</td>
<td>1.324210468</td>
</tr>
<tr>
<td>09:47:09:006</td>
<td>66.63884211</td>
<td>51.3154014</td>
<td>-0.79424119</td>
<td>1.763789463</td>
</tr>
<tr>
<td>09:47:10:004</td>
<td>70.07926316</td>
<td>51.3154014</td>
<td>-0.79424119</td>
<td>2.116210417</td>
</tr>
<tr>
<td>09:47:10:988</td>
<td>67.41242105</td>
<td>51.31541991</td>
<td>-0.79426345</td>
<td>2.470526319</td>
</tr>
<tr>
<td>09:47:12:019</td>
<td>70.49505263</td>
<td>51.31547389</td>
<td>-0.79424044</td>
<td>2.552842052</td>
</tr>
<tr>
<td>09:47:13:000</td>
<td>64.35273684</td>
<td>51.31550911</td>
<td>-0.79422871</td>
<td>2.399789572</td>
</tr>
<tr>
<td>09:47:14:007</td>
<td>68.28021053</td>
<td>51.31550911</td>
<td>-0.79422871</td>
<td>2.70000005</td>
</tr>
<tr>
<td>09:47:15:015</td>
<td>65.372</td>
<td>51.31556383</td>
<td>-0.79420798</td>
<td>2.91863165</td>
</tr>
<tr>
<td>09:47:16:012</td>
<td>66.15305263</td>
<td>51.31558425</td>
<td>-0.79417606</td>
<td>2.6576843</td>
</tr>
<tr>
<td>09:47:18:003</td>
<td>64.894</td>
<td>51.31562078</td>
<td>-0.7941161</td>
<td>2.696736893</td>
</tr>
<tr>
<td>09:47:19:000</td>
<td>66.80010526</td>
<td>51.31563464</td>
<td>-0.79408076</td>
<td>2.406000095</td>
</tr>
<tr>
<td>09:47:20:005</td>
<td>66.52894737</td>
<td>51.31563464</td>
<td>-0.79408076</td>
<td>2.76999998</td>
</tr>
<tr>
<td>09:47:21:020</td>
<td>66.67326316</td>
<td>51.31565847</td>
<td>-0.79399486</td>
<td>2.911473779</td>
</tr>
<tr>
<td>09:47:22:000</td>
<td>67.89063158</td>
<td>51.31567242</td>
<td>-0.79394735</td>
<td>3.233157914</td>
</tr>
<tr>
<td>09:47:23:024</td>
<td>67.19957895</td>
<td>51.31568593</td>
<td>-0.7938951</td>
<td>3.543473651</td>
</tr>
<tr>
<td>09:47:24:013</td>
<td>68.28747368</td>
<td>51.31570096</td>
<td>-0.79384037</td>
<td>3.858526215</td>
</tr>
<tr>
<td>09:47:25:003</td>
<td>67.18757895</td>
<td>51.31571787</td>
<td>-0.79378323</td>
<td>4.119684108</td>
</tr>
<tr>
<td>09:47:26:008</td>
<td>69.03978947</td>
<td>51.31573583</td>
<td>-0.79372659</td>
<td>4.110315917</td>
</tr>
<tr>
<td>09:47:27:026</td>
<td>69.66178947</td>
<td>51.31574883</td>
<td>-0.79366774</td>
<td>4.141263027</td>
</tr>
<tr>
<td>09:47:28:006</td>
<td>76.89389474</td>
<td>51.31576046</td>
<td>-0.79361817</td>
<td>4.149684047</td>
</tr>
<tr>
<td>09:47:29:021</td>
<td>74.40768421</td>
<td>51.3157672</td>
<td>-0.79358403</td>
<td>3.134526339</td>
</tr>
</tbody></table>

The aggregated stats include a calculated moving average by taking a mean of the last 10 measurements (equal to 0.1 second) for gFz and speed (m/s). The co-ordinates shown above show the final location of the 10 measurement average.

For G-Force (z) I multiplied by 100 for scale, so I could use a comparative scale to The Parks & Trails Council of Minnesota:

* (gFz * 100) < 30 = Excellent
* (gFz * 100) 30 - 45 = Good
* (gFz * 100) 45 - 60 = Fair
* (gFz * 100) 60 - 75 = Poor
* (gFz * 100) > 75 = Very Poor

Finally, I took the value closest to every whole second for a more manageable dataset (1 measurement every second vs. 100 raw measurements). This is what you see above.

All measurements from this capture fall into the Poor category which is expected given the measurements above were taken from a woodland gravel path.

When measuring on smooth roads I was getting readings between 15 - 25 ave gFz * 100. Subsequence rides have generally produced results in line with expectations, even where cycling speed varies by +/- 10km/h.

## Limitations

The TRI only measures the smoothness of the path taken by the bicycle, and as such likely underestimates the overall condition of trails with easily avoidable bumps and cracks (i.e. those forming along pavement edges or longitudinally down the center).

Similarly, there are an almost infinite number of paths a cyclists could take. These measurements only consider one unique path. Ideally a trail would be measured multiple times to account for different lines taken by the bicycle, errors associated with speed adjustments, and random noise associated with vibrations in the bicycle frame and rider movements.

TRI is a summary statistic for a given segment of trail. Over the course of a kilometer, a trail may be in excellent condition for one stretch and in poor condition for another.

In this case I choose sections of about 2 meters over a timeline of 1 second (which is very granular). For a large trail network, presenting this data will take more processing to prove valuable. Riders are going to want details of the best and worst parts of the trail but are not going to want to sift through data at 2 meter intervals.

For a cheap and fairly reliable way to measure trail quality this methodology is surprisingly accurate. However, rolling this out on a global scale is a different story.

## A global standard

Making a solution affordable for anyone to capture measurements is critical, though a standard level of accuracy is just as important.

It's clear the variables of using a phones' accelerometer to capture measurements -- the phone, its holder, the bicycle, its rider, their riding style -- make it very difficult to normalise measurements.

Therefore, I can't see any way a phone is a viable in pursuit of a global TRI. But a camera, already fitted to the Data Bike, might offer a solution.

A quick search of the internet returns lots of research, for example the [IEEE Global Road Damage Detection Challenge 2020](https://rdd2020.sekilab.global/).

If it's possible to use the imagery captured by the Data Bike to measure cycle path quality, the cameras might prove even more valuable (and lower the amount of kit needed for the Data Bike).

If you have any experience in this area, [I'd love to hear from you](/contact/).

## Update 2021-05-21

[Trek View Trail Quality Index: An Alternative Method Using Computer Vision](/blog/2021/trek-view-ride-quality-index-computer-vision-part-1).