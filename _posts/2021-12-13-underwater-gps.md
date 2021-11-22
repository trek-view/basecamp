---
date: 2021-12-13
title: "Testing GPS Underwater"
description: "A DIY science experiment to examine GPS signal loss underwater."
categories: guides
tags: []
author_staff_member: dgreenwood
image: /assets/images/blog/2021-12-13/
featured_image: /assets/images/blog/2021-12-13/
layout: post
published: false
---

**A DIY science experiment to examine GPS signal loss underwater.**

[Previously I've talked about GPS underwater, or lack of it](/blog/2020/underwater-google-street-view.md), and setups for capturing GPS when scuba-diving.

I was recently snorkeling, with the camera no more than a few centimeters below the ocean surface.

Using a swim buoy carrying a GPS was cumbersome, and a lot less accurate because the buoy has to be moved away from the camera to ensure it doesn't enter the shot.

I wanted to see how deep the camera could be submerged before losing a stable GPS lock.

## The science

When electromagnetic waves impinge upon a conductive material, currents are induced on and inside (If it has a finite conductivity) of the material that work against the incident electromagnetic wave.

This causes an attenuation of the wave as it travels through the material. There is also a power loss going into the material due to reflection. Going from one medium to another of a different conductivity, permittivity, and/or permeability causes some of the wave to be reflected back.

The skin depth, which is the distance that the wave must travel to be reduced by e^-1 in amplitude, is dependent upon frequency and conductivity.

So a very low frequency signal can penetrate the earth several hundred meters while the high frequency GPS cannot penetrate a few feet. This is why submarines use extremely low frequency radio frequencies (tens to 100's of khz) for communications.

Specifically, [sea water has a conductivity of 5 S/m](https://en.wikipedia.org/wiki/Conductivity_(electrolytic)). [GPS has a frequency of around 1.3 GHZ](https://www.nist.gov/pml/time-and-frequency-division/popular-links/time-frequency-z/time-and-frequency-z-g). So a GPS signal has a skin depth of 6 mm. That means that the signal loses 36.7% of it's amplitude after only 6 mm. The signal is reduced to 1% of its amplitude after only 2.87 cm.

Perfectly pure water has a very low conductivity, practically zero. However, almost all water has various impurities and ions that raise the conductivity. So if we assume that fresh water has a conductivity of 0.005 S/m, then the skin depth of GPS is about 20 cm. So the amplitude is reduced to 1% after 90 cm.

In short, the science is not looking good, but let's put it to the test.

## Seawater test


## Freshwater test
