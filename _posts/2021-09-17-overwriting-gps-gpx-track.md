---
date: 2021-09-10
title: ""
description: ""
categories: guides
tags: [KML, Keyhole Markup Language, Google, Google Earth]
author_staff_member: dgreenwood
image: /assets/images/blog/2021-09-03/
featured_image: /assets/images/blog/2021-09-03/
layout: post
published: false
---


As we get ready to release the next version of Map the Paths Uploader, I've been going through some existing functionality.

One of the really useful features that a lot of people use is the ability to geotag a sequence with a GPX track.

It's paticularly useful for when you're using a secondary GPS device, like a phone, in addition to your camera -- [which might not be all thr accurate](/blog/2020/gps-101).

I've talked about geotagging frames using exiftool previously ([see 4. Geotag the frames](/blog/2020/turn-360-video-into-timelapse-images-part-2).


The Map the Paths Uploader uses exiftool to geotag images, but I wanted to take this weeks to describe in a little more detail how this works.
)



## 4. Geotag the frames

Now that the frames have `datetimeoriginal` values you can geotag the photos, [again using exiftool](https://exiftool.org/geotag.html), using the track file extracted during step one.

```
exiftool -ext jpg -geotag VIDEO_7152.gpx FRAMES/
```

exiftool loads the GPS track log file, and matches the GPS position time with the time of the image to determine and tag its location.






I wanted to share some of the detail here


The Map the Paths Uploader has allowed users to manually add an update GPX tr

This 