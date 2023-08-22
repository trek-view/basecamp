---
date: 2020-01-03
title: "Decoding a Google Street View URL"
description: "Analysing the structure of Street View URL's to better understand exposed functionality."
categories: guides
tags: [Google, Street View]
author_staff_member: dgreenwood
image: /assets/images/blog/2020-01-03/google-street-view-url-meta.jpg
featured_image: /assets/images/blog/2020-01-03/google-street-view-url-sm.png
layout: post
published: true
---

**Analysing the structure of Street View URL's to better understand exposed functionality.**

_Word of warning: this post is accurate at the time of publication (2020-01-03) but may not be on the day your are reading this due to possible changes made by Google. If you do spot an error, [please email us to make us aware](/contact)._

Have you ever taken a closer look at a Street View URL?

Beware, they're very messy... _at first glance..._

Let's look at a simplified example using a Google image:

<iframe src="https://www.google.com/maps/embed?pb=!4v1589298805767!6m8!1m7!1sjJXYsBpPPqWuvSR5RUaIEQ!2m2!1d51.50836628841653!2d-0.1114930860638594!3f260.88663435168127!4f-11.683344096125651!5f0.7820865974627469" width="600" height="450" frameborder="0" style="border:0;" allowfullscreen="" aria-hidden="false" tabindex="0"></iframe>

`https://www.google.com/maps/@51.5083663,-0.1114931,2a,75y,260.89h,78.32t/data=!3m7!1e1!3m5!1sjJXYsBpPPqWuvSR5RUaIEQ!2e0!6s%2F%2Fgeo2.ggpht.com%2Fcbk%3Fpanoid%3DjJXYsBpPPqWuvSR5RUaIEQ%26output%3Dthumbnail%26cb_client%3Dmaps_sv.tactile.gps%26thumb%3D2%26w%3D203%26h%3D100%26yaw%3D339.28687%26pitch%3D0%26thumbfov%3D100!7i13312!8i6656`

See what I mean about it being messy?

Though like learning a language, once you understand the structure, the rest tends to fall into place. So let's learn the _language_ of the Google Street View URL.

The first part (`@51.5083663,-0.1114931`) is the `latitude` and `longitude` of the photo. This is fixed for the photo.

The following three values differ depending on the zoom and orientation selected by the user. As you move around inside the image, watch how these values change in the URL with each movement.

The field of view (`75y`) defines the zoom level between 1 (max) and 90 (min). 75 is the default value Google uses.

The heading (`260.89h`) can be seen next. Measured between >=0 and <360. 

The final part (`78.32t`) is the pitch of the view (measured between 1 and 179).

Following the orientation and position information, the actual image data (`data=`) is defined.

Google seems to employ a number of bangs (!) in the `data` section of the URL. Each segment of the attribute is preceded by "!", a number from 1 - 9, and a letter (m, e, etc).

In this example there are 8 bangs...

```
data=
!3m7
!1e1
!3m5
!1sjJXYsBpPPqWuvSR5RUaIEQ
!2e0
!6s//geo2.ggpht.com/cbk?panoid=jJXYsBpPPqWuvSR5RUaIEQ&output=thumbnail&cb_client=maps_sv.tactile.gps&thumb=2&w=203&h=100&yaw=339.28687&pitch=0&thumbfov=100
!7i13312
!8i6656
```

...only one that is _human readable_.

The `data` values are [encoded](https://www.w3schools.com/tags/ref_urlencode.ASP).

For example, `%3D` decoded is `=`.

So; `panoid%3DjJXYsBpPPqWuvSR5RUaIEQ` when decoded is `panoid=jJXYsBpPPqWuvSR5RUaIEQ`

[Fully decoded](https://www.urldecoder.org/) the Street View URL above becomes:

`https://www.google.com/maps/@51.5083663,-0.1114931,2a,75y,260.89h,78.32t/data=!3m7!1e1!3m5!1sjJXYsBpPPqWuvSR5RUaIEQ!2e0!6s//geo2.ggpht.com/cbk?panoid=jJXYsBpPPqWuvSR5RUaIEQ&output=thumbnail&cb_client=maps_sv.tactile.gps&thumb=2&w=203&h=100&yaw=339.28687&pitch=0&thumbfov=100!7i13312!8i6656`

_Decoded URL, hence will not load correctly._

Looking at the human-readable bang specifically (broken into new lines to make it easier to read):

```
!6s//geo2.ggpht.com/cbk?panoid=jJXYsBpPPqWuvSR5RUaIEQ
&output=thumbnail
&cb_client=maps_sv.tactile.gps
&thumb=2
&w=203
&h=100
&yaw=339.28687
&pitch=0
&thumbfov=100
```

You can see a host (`geo2.ggpht.com/cbk`) with a `panoid=` value. This is the unique reference to the panoramic image.

After that we see `&output=thumbnail` followed by information that seems to be related to said output (a thumbnail image). I assume this because; `&w=203&h=100` looks to refer to width (203px) and height (100px) as well as values like `yaw=` and `pitch=` that remain static and likely set the view of the thumbnail, unlike the first part of the URL which changes when the user moves the view.

Though I have no idea what the `&output=thumbnail` actually refers too -- it can be entirely removed from the URL and the image will still load correctly in the browser;

`https://www.google.co.uk/maps/@51.5083663,-0.1114931,2a,75y,260.89h,78.32t/data=!3m7!1e1!3m5!1sBUnezD_ki4oX_PDm2A1lWw!2e0!6s%2F%2Fgeo0.ggpht.com%2Fcbk%3Fpanoid%3DjJXYsBpPPqWuvSR5RUaIEQ!7i13312!8i6656`

Let's compare another decoded URL on the same stretch of footpath, also captured by Google to see if it offers any clues to the missing information.

<iframe src="https://www.google.com/maps/embed?pb=!4v1589301242144!6m8!1m7!1s7YsnZ32rM6gi8Ivi2k3viA!2m2!1d51.50821644339441!2d-0.1125885311008972!3f101.34177970356329!4f-1.4015445714555739!5f0.7820865974627469" width="600" height="450" frameborder="0" style="border:0;" allowfullscreen="" aria-hidden="false" tabindex="0"></iframe>

`https://www.google.com/maps/@51.5082164,-0.1125885,2a,75y,101.34h,88.6t/data=!3m7!1e1!3m5!1s7YsnZ32rM6gi8Ivi2k3viA!2e0!6s//geo0.ggpht.com/cbk?panoid=7YsnZ32rM6gi8Ivi2k3viA&output=thumbnail&cb_client=maps_sv.tactile.gps&thumb=2&w=203&h=100&yaw=340.40964&pitch=0&thumbfov=100!7i13312!8i6656`

_Decoded URL, hence will not load correctly._

The 8 bangs for this URL:

```
data=
!3m7
!1e1
!3m5
!1s7YsnZ32rM6gi8Ivi2k3viA
!2e0
!6s//geo0.ggpht.com/cbk?panoid=7YsnZ32rM6gi8Ivi2k3viA&output=thumbnail&cb_client=maps_sv.tactile.gps&thumb=2&w=203&h=100&yaw=340.40964&pitch=0&thumbfov=100
!7i13312
!8i6656
```

Almost all the bang values are identical to the first image, except inside the 6th bang where the `panoId` and the `yaw` differ, and perhaps most interestingly the value in the 4th bang (1st URL = `!1sjJXYsBpPPqWuvSR5RUaIEQ` / 2nd URL = `!1s7YsnZ32rM6gi8Ivi2k3viA`)

<img class="img-fluid" src="/assets/images/blog/2020-01-03/google-street-view-place-name.png" alt="Google Street View Place name" title="Google Street View Place name" />

Initially I thought the 4th bang might be referring to the [Google Place ID of the image](/blog/place-id-google-street-view), however both images show "The Queen's Walk" as the place, [and a lookup](https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder) of the `place ID` for the "The Queen's Walk" returns `EixUaGUgUXVlZW4ncyBXYWxrLCBTb3V0aCBCYW5rLCBMb25kb24gU0UxLCBVSyIuKiwKFAoSCekLrB7HBHZIEQ5z1qt4guCgEhQKEgk_J5VMtgR2SBFYYta2uf8XCQ`. 

Digging deeper, lets take another Street View image taken by Google and it's decoded URL:

<iframe src="https://www.google.com/maps/embed?pb=!4v1589301813647!6m8!1m7!1sk92ptfUShdo9lKo5PYMGew!2m2!1d45.8326327182556!2d6.863465702885691!3f68.65211851159144!4f1.774614517468052!5f0.7820865974627469" width="600" height="450" frameborder="0" style="border:0;" allowfullscreen="" aria-hidden="false" tabindex="0"></iframe>

`https://www.google.co.uk/maps/@45.8326327,6.8634657,2a,75y,68.65h,91.77t/data=!3m7!1e1!3m5!1sk92ptfUShdo9lKo5PYMGew!2e0!6s//geo1.ggpht.com/cbk?panoid=k92ptfUShdo9lKo5PYMGew&output=thumbnail&cb_client=maps_sv.tactile.gps&thumb=2&w=203&h=100&yaw=10.15913&pitch=0&thumbfov=100!7i13312!8i6656`

_Decoded URL, hence will not load correctly._

The 8 bangs for this URL:

```
data=
!3m7
!1e1
!3m5
!1sk92ptfUShdo9lKo5PYMGew
!2e0
!6s//geo1.ggpht.com/cbk?panoid=k92ptfUShdo9lKo5PYMGew&output=thumbnail&cb_client=maps_sv.tactile.gps&thumb=2&w=203&h=100&yaw=10.15913&pitch=0&thumbfov=100
!7i13312
!8i6656

```

Again, only the the 6th bang (`panoId` and `yaw`) and the 4th bang change (1st URL = `!1sjJXYsBpPPqWuvSR5RUaIEQ` / 2nd URL = `!1s7YsnZ32rM6gi8Ivi2k3viA` / 3rd URL = `!1sk92ptfUShdo9lKo5PYMGew`).

I'm still non-the wiser.

This time, let's take a look at user uploaded content -- one of our panoramas (versus Google content):

<iframe src="https://www.google.com/maps/embed?pb=!4v1589302826707!6m8!1m7!1sCAoSLEFGMVFpcFA4VW1ydnlqNmp6N0hRRkNKMUlHeFVGbzR0U2ZaZGNpTkh5QnFY!2m2!1d51.2895639!2d-0.8214138999999999!3f1.74!4f0!5f0.7820865974627469" width="600" height="450" frameborder="0" style="border:0;" allowfullscreen="" aria-hidden="false" tabindex="0"></iframe>

`https://www.google.co.uk/maps/@51.2895639,-0.8214139,3a,75y,1.74h,90t/data=!3m8!1e1!3m6!1sAF1QipP8Umrvyj6jz7HQFCJ1IGxUFo4tSfZdciNHyBqX!2e10!3e11!6shttps://lh5.googleusercontent.com/p/AF1QipP8Umrvyj6jz7HQFCJ1IGxUFo4tSfZdciNHyBqX=w203-h100-k-no-pi0-ya23.025953-ro0-fo100!7i5760!8i2880`

_Decoded URL, hence will not load correctly._

The *9 bangs* for this URL:

```
data=
!3m8
!1e1
!3m6
!1sAF1QipP8Umrvyj6jz7HQFCJ1IGxUFo4tSfZdciNHyBqX
!2e10
!3e11
!6shttps://lh5.googleusercontent.com/p/AF1QipP8Umrvyj6jz7HQFCJ1IGxUFo4tSfZdciNHyBqX=w203-h100-k-no-pi0-ya23.025953-ro0-fo100
!7i5760
!8i2880
```

It seems user content is handled differently. Firstly, the URL is made up of 9 bangs.

This time the 1st (`!3m8`), 3rd (`!3m6`), 4th (`!1sAF1QipP8Umrvyj6jz7HQFCJ1IGxUFo4tSfZdciNHyBqX`), 6th NEW (`!3e11`), 7th (pano info), 8th (`!7i5760`), and 9th (`!8i2880`) bangs are all different to the previous image.

The pano info (7th bang, equivalent to the 6th bang for Google uploaded images) is also considerably different:

`!6shttps://lh5.googleusercontent.com/p/AF1QipP8Umrvyj6jz7HQFCJ1IGxUFo4tSfZdciNHyBqX=w203-h100-k-no-pi0-ya23.025953-ro0-fo100`

This time the host is different (`googleusercontent.com` vs `ggpht.com`). The `panoid` is defined after the `/p/` (in this case `AF1QipP8Umrvyj6jz7HQFCJ1IGxUFo4tSfZdciNHyBqX` vs. `panoid=`), and the `output=thumbnail` argument is replaced with what looks to be a reference to a thumbnail but in a different structure containing references to (_I think_) width (`w203`), height (`h100`), pitch (`pi0`), yaw (`ya23.025953`), and field of view (`fo100`).

I think `ro0` refers to the roll value (my assumption is that Google images omit this value because roll is accounted for by Google pre-upload and thus always equal to 0).

I have no idea about what `k-no` defines though.

Now, one final Street View image to use as a comparison, this time another piece of user contributed imagery, this time from Federico Debetto, and the Zanzibar Street View project:

<iframe src="https://www.google.com/maps/embed?pb=!4v1589304662264!6m8!1m7!1sCAoSLEFGMVFpcE5aeGdtQUxSSWpqa2J2VVdCQU9KWUxpNm5pVnMzcENvc1o1dWwz!2m2!1d-6.21590387225673!2d39.21198776535888!3f4.954602944381747!4f3.3421242977672563!5f0.7820865974627469" width="600" height="450" frameborder="0" style="border:0;" allowfullscreen="" aria-hidden="false" tabindex="0"></iframe>

`https://www.google.co.uk/maps/@-6.2159039,39.2119878,3a,75y,4.95h,93.34t/data=!3m8!1e1!3m6!1sAF1QipNZxgmALRIjjkbvUWBAOJYLi6niVs3pCosZ5ul3!2e10!3e11!6shttps://lh5.googleusercontent.com/p/AF1QipNZxgmALRIjjkbvUWBAOJYLi6niVs3pCosZ5ul3=w203-h100-k-no-pi-18.636326-ya45.429626-ro-1.5321815-fo100!7i7680!8i3840`

_Decoded URL, hence will not load correctly._

```
data=
!3m8
!1e1
!3m6
!1sAF1QipNZxgmALRIjjkbvUWBAOJYLi6niVs3pCosZ5ul3
!2e10
!3e11
!6shttps://lh5.googleusercontent.com/p/AF1QipNZxgmALRIjjkbvUWBAOJYLi6niVs3pCosZ5ul3=w203-h100-k-no-pi-18.636326-ya45.429626-ro-1.5321815-fo100
!7i7680
!8i3840
```

Compared to the Trek View user uploaded image analysed previously, this time the 4th (`!1sAF1QipNZxgmALRIjjkbvUWBAOJYLi6niVs3pCosZ5ul3`
), 7th (pano info), 8th (`!7i7680`) and 9th (`!8i3840`) bangs differ.

And I give up.

I'm not sure my own trial and error is getting me any closer to becoming _fluent_ in Street View URL bangs!.

My guess is that some of these bangs refer to my Google account and other user specific variables (like browser, device, type of Google Maps app...) in addition to the image location.

Hopefully some enterprising reader might be able to help me complete this puzzle...