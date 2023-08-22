---
date: 2021-12-10
title: "Underwater GPS Experiments in Salt Water"
description: "A DIY science experiment to examine GPS signal loss underwater using a GoPro MAX."
categories: guides
tags: [360Bubble, GPS, Max, scuba, dive]
author_staff_member: dgreenwood
image: /assets/images/blog/2021-12-10/gps-5cm-below-GSAC8564.JPG
featured_image: /assets/images/blog/2021-12-10/gps-5cm-below-GSAC8564-sm.JPG
layout: post
published: true
redirect_from:
  - /blog/2021/underwater-gps-seawater
---

**A DIY science experiment to examine GPS signal loss underwater using a GoPro MAX.**

[Previously I've talked about GPS underwater, or lack of it](/blog/underwater-google-street-view), and setups for capturing GPS when scuba-diving.

I was recently snorkeling with the camera no more than a few centimeters below the ocean surface. Using a swim buoy with a GPS was cumbersome and fairly inaccurate because the buoy has to be moved away from the camera to ensure it didn't enter the shot.

I wanted to see how deep the camera could be submerged before losing a stable GPS lock whilst snorkeling... and potentially free-diving.

## The fundamentals

When electromagnetic waves impinge upon a conductive material, currents are induced on and inside of the material that work against the incident electromagnetic wave.

This causes an attenuation of the wave as it travels through the material. There is also a power loss going into the material due to reflection. Going from one medium to another of a different conductivity, permittivity, and/or permeability causes some of the wave to be reflected back.

The skin depth, which is the distance that the wave must travel to be reduced by e^-1 in amplitude, is dependent upon frequency and conductivity.

So a very low frequency signal can penetrate the earth several hundred metres while the high frequency GPS cannot penetrate a few feet. This is why submarines use extremely low frequency radio frequencies (tens to 100's of khz) for communications.

[According to this post](https://forums.anandtech.com/threads/can-gps-work-underwater.24850/post-23242212):

> Specifically, [sea water has a conductivity of 5 S/m](https://en.wikipedia.org/wiki/Conductivity_(electrolytic)). [GPS has a frequency of around 1.3 GHZ](https://www.nist.gov/pml/time-and-frequency-division/popular-links/time-frequency-z/time-and-frequency-z-g). So a GPS signal has a skin depth of 6 mm. That means that the signal loses 36.7% of it's amplitude after only 6 mm. The signal is reduced to 1% of its amplitude after only 2.87 cm.

Let's put the science to the test...

## Equipment used

At the time of the test, [I didn't have access to the 360Bubble that I usually use for underwater recordings](/trek-pack/). This would have improved the results closer to the surface by providing a larger volume of air between the camera and surface.

So I decided to take my GoPro MAX with a smaller water-proof cover for the camera ([here's the one I bought via Amazon](https://www.amazon.co.uk/VGSION-Accessory-Underwater-Housing-Waterproof/dp/B083HQ7NWW)). The MAX is waterproof, [but as noted in this post](/blog/underwater-google-street-view), you should be aware water changes the effect of light. This cover doesn't fully solve that issue, but it does help by providing a small air-gap between the camera an lens.

## Test conditions

Some things to note in these results:

* They are far from scientific. All measurements are broad estimates
* I took more than ten photos at each depth to get a wider sample, only selected images are shown below
* The conditions were perfect on the day (clear skies)
* I don't know where the GPS receiver is in the camera (which might alter measurements by up to 1cm, but this is negligible -- see first point on accuracy)
* I don't know how many (if any) GPS positions are calculated in each test by the cameras [IMU (Inertial Measurement Unit)](/blog/360-camera-sensors-imu-accelerometer-gyroscope-magnetometer)

## A note on altitude values

[In a previous post I've talked about factors that can impact the accuracy of reported GPS positions](/blog/gps-101) -- that post explains why the altitude measurements in my test are widely erroneous (more-so than latitude/longitude). 

_[If needed, I could use a Digital Elevation Model to fix them](/blog/what-is-a-digital-elevation-model)._

## Test results

### Surface (Seawater test)

<iframe width="600" height="400" allowfullscreen style="border-style:none;" src="https://www.trekview.org/trekviewer.htm#panorama=https://www.trekview.org/assets/images/blog/2021-12-10/gps-surface-GSAB8563.JPG&amp;autoLoad=true"></iframe>

```
GPS Altitude                    : 44.4 m Above Sea Level
GPS Date/Time                   : 2021:12:04 16:07:32Z
GPS Latitude                    : 28 deg 42' 42.47" N
GPS Longitude                   : 14 deg 0' 40.97" W
```

**Summary:**

GPS positions reported were all stable across all photos at this depth.

### Roughly 5 cm below surface (Seawater test)

<iframe width="600" height="400" allowfullscreen style="border-style:none;" src="https://www.trekview.org/trekviewer.htm#panorama=https://www.trekview.org/assets/images/blog/2021-12-10/gps-5cm-below-GSAC8564.JPG&amp;autoLoad=true"></iframe>

```
GPS Altitude                    : 43 m Above Sea Level
GPS Date/Time                   : 2021:12:04 16:07:55Z
GPS Latitude                    : 28 deg 42' 42.61" N
GPS Longitude                   : 14 deg 0' 40.78" W

```

**Summary:**

GPS positions reported were stable, although 25% of photos at this depth had no GPS position reported.

### Roughly 10 cm below surface (Seawater test)

<iframe width="600" height="400" allowfullscreen style="border-style:none;" src="https://www.trekview.org/trekviewer.htm#panorama=https://www.trekview.org/assets/images/blog/2021-12-10/gps-10cm-GSAE8574.JPG&amp;autoLoad=true"></iframe>

```
GPS Altitude                    : 40.5 m Above Sea Level
GPS Date/Time                   : 2021:12:04 16:08:51Z
GPS Latitude                    : 28 deg 42' 42.53" N
GPS Longitude                   : 14 deg 0' 41.55" W
```

**Summary:**

GPS positions reported were stable, although 70% of photos at this depth had no GPS position reported.

### Roughly 30 cm below surface (Seawater test)

<iframe width="600" height="400" allowfullscreen style="border-style:none;" src="https://www.trekview.org/trekviewer.htm#panorama=https://www.trekview.org/assets/images/blog/2021-12-10/gps-30cm-GSAF8579.JPG&amp;autoLoad=true"></iframe>

**Summary:**

No GPS reported in any photos at this depth.

## Test summary

Depths of 5-10cm below the surface of the ocean causes the cameras GPS receiver to start failing significantly. Any deeper and it's unusable.

In summary, your MAX is great for snorkeling where you can keep your camera on, or slightly below the surface. However, you're going to need another way of tracking GPS if you intend to go on deeper ([see our post Underwater Street View for some ideas](/blog/underwater-google-street-view)).

## A final note on freshwater

Perfectly pure water has a very low conductivity, practically zero. However, almost all water has various impurities and ions that raise the conductivity.

So if we assume that fresh water has a conductivity of 0.005 S/m, then the skin depth of GPS is about 20 cm. So the amplitude is reduced to 1% after 90 cm.

It was previously noted, GPS signal is reduced to 1% of its amplitude after only 2.87 cm in saltwater. So a rough calculation would assume depths of 31 times (90 cm / 2.87 cm) that of seawater are possible in freshwater. Doing the maths, 31 x 5cm = a depth of 1.55 m.

Now I just need to find a _warm_ freshwater body of water to conduct a test...