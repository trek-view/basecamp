---
date: 2020-06-05
title: "What is a Global Shutter?"
description: "Why does it matter? And do you need one for 360 tour photography?"
categories: guides
tags: [camera]
author_staff_member: dgreenwood
image: /assets/images/blog/2020-06-05/rolling-shutter-global-shutter-photo-comparison-meta.jpg
featured_image: /assets/images/blog/2020-06-05/rolling-shutter-global-shutter-photo-comparisons-sm.jpg
layout: post
published: false
---

**Click, click, click.**

Back in the days of film cameras, the sound of camera shutter as the press captured photos of a famous person seemed deafening (_from watching old clips on television_).

Modern digital cameras (including your phone) have no physical shutter, which is why many hav the option for a 'shutter click' noise that you can turn on and off.

Whilst some DSLR's still make use of mechanical shutters ([they do still offer some advantages to photographers](https://www.npr.org/sections/alltechconsidered/2009/05/do_digital_cameras_need_shutte.html)), every-single 360 camera I know of users some form of electronic shutter.

An electronic shutter powers-on a digital sensor for a selected amount of time (_it's the equivalent to physical shutter opening and closing, but there is no physical action -- it's all electronic_).

## Electronic Shutters 101

<img class="img-fluid" src="/assets/images/blog/2020-06-05/rolling-shutter-global-shutter-visualised.gif" alt="Rolling shutter versus global shutter comparison visualised" title="Rolling shutter versus global shutter comparison visualised" />

Most digital cameras, including 360 cameras, typically use of CMOS (Complementary Metal Oxide Sensors). These sensors use a rolling shutter, where image rows are read out and reset sequentially (the sensor activates one row of pixels at a time).

High-end cameras use CCD (Charged Coupled Device) sensors that use a global shutter (sometimes referred to as a total shutter). A global shutter takes a snapshot representing a single instant in time -- all pixels collect light during the same time interval.

## Comparing Rolling and Global Shutters

One of the clear advantages of rolling shutters is that they require less circuitry compared to the a global shutter used by CCD sensors. This makes CMOS sensors less expensive to manufacture. It is for this reason, CMOS sensors are frequently used in camera phones, digital cameras, and consumer to prosumer camcorders, including 360 cameras.

The downside; rolling shutters can can often cause motion blur and image skew:

<img class="img-fluid" src="/assets/images/blog/2020-06-05/rolling-shutter-global-shutter-photo-comparison.jpg" alt="Rolling shutter versus global shutter comparison photo" title="Rolling shutter versus global shutter comparison" />

<img class="img-fluid" src="/assets/images/blog/2020-06-05/rolling-shutter-global-shutter-photo-comparison-fan.jpg" alt="Rolling shutter versus global shutter comparison photo fan" title="Rolling shutter versus global shutter comparison fan" />

Motion blur occurs from rolling shutters because the rows of photodiodes (pixels in the sensor) do not collect light at the same time (unlike a global shutter where the entire image is capture at once).

Try to visualise the photo of the fan being taken with a rolling shutter. The top row of pixels are the first row to start collecting light, once complete, the second row fires, and so on until the final row has fired.

We're talking about a very small amount of time between the first and the last row collecting light. However, in 'action' shots, like a fan spinning, a fast moving object might have moved significantly between the first and last row of the sensor firing, causing motion blur.

Generally speaking, as the sensor gets larger and higher in resolution, the greater potential there is for rolling shutter artifacts; because the larger the sensor area, the longer the readout of that sensor will take (time from first to last row).

A global shutter captures all rows at the same time, so the objects in the image are always being captured at the same point in time, significantly reducing the chance of motion blur (but not eliminating it entirely).

And whilst you might not [be downhill mountain biking when capturing 360 tours](/blog/2020/diy-street-view-bike-v2), if you have a [camera mounted to a backpack](/trek-pack) there is a certain amount of 'action' involved.

If you're looking at cameras with CCD sensors (global shutters) you might also notice that they offer lower image resolutions than comparative cameras using CMOS sensors (rolling shutters).

This is down to the data transmission limitation imposed by the sensor and other camera hardware (bit rate).

In order to transmit the data for the entire image at the same time (versus in chunks like a rolling shutter), the size of each pixel in a CCD sensor (global shutter) is normally bigger than in a CMOS sensor (rolling shutter). Larger pixels lower the image resolution (the sensor cannot hold as many) and consequently, the amount of data being transferred is lower.

## Shutter considerations in 360 photography

In 360 photography you're dealing with 2 or more camera sensors. This makes life a little more difficult (for the manufacturer).

Camera manufacturers build in precise timing / synchronisation systems and use fast rolling shutter CMOS sensors (offering higher frame rates) to help reduce the effects of motion blur and image skew.

Similarly they also write logic into their stitching algorithms to reduce the problems that can arise from the use of rolling shutters.

You'll see many 360 cameras with CMOS sensors marketed with some sort of 'stabilisation' features (or similar). Generally speaking, this all handled by the camera or stitching software.

<img class="img-fluid" src="/assets/images/blog/2020-06-05/360-camera-control-point.jpg" alt="360 camera control points" title="360 camera control points" />

If the photos captured by each sensor are widely different due to image blur / skew, it can be very difficult for the stitching software to find control points (regions of two camera photos that refer to the same point in space used to join images).

The benefit of modern camera technology is a lot of issues can be fixed with software; camera firmware updates, stitching software updates.

If you we're building your own camera or stitching software these are all challenges you need to think about. For buyers, these are they type of issues identified in the reviews in the reviews!

And developers are delivering better software as the market continues to grow and the range of telemetry captured by cameras increases and becomes more accurate.

For example, gyroscopes measure camera rotation. These measurements can be used in conjunction with compensatory algorithms to achieve rolling shutter correction in images.

## Do you need a Global Electronic Shutter?

Probably not.

With camera manufacturers competing on both price and image quality, there are a very limited number of 360 cameras with global shutters on the market, due to the higher cost of the sensors and the lower image resolutions the sensors offer.

Now, if you’re shooting VR content that has a lot of fast-moving motion, a 360 camera with CMOS sensors (global shutter) might be worth the cost to buy (most more than $10,000 USD+) or rent.

For outdoor tours viewed on PC's, it's overkill.