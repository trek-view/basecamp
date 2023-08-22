---
date: 2019-11-08
title: "Trails Don't have Addresses"
description: "Using location codes to map even the most remote hiking trails."
categories: developers
tags: [Google, Plus Code, What3Words, Google, GPS]
author_staff_member: dgreenwood
image: /assets/images/blog/2019-11-08/open-location-code-plus-code-glenmore-scotland-meta.jpg
featured_image: /assets/images/blog/2019-11-08/open-location-code-plus-code-glenmore-scotland-sm.png
layout: post
published: true
---

**Using location codes to map even the most remote hiking trails.**

[That's where I was this morning](https://what3words.com/tiger.alive.single).

Tonight I'll be heading to [pigs.taking.dads](https://what3words.com/pigs.taking.dads) to meet friend.

In the Western World we're more familiar with street addresses for referencing places.

When sending a letter or parcel, you mark the address on the package and attach the stamp or postage label.

When placing an online order, you include a delivery and billing address.

When organising a meeting, you include the address of where it will be held so other attendees can find it.

Though in some areas, new streets spring up by the day. For example, in emergency situations where camps are erected quickly.

In these situations; where do you direct much needed medical supplies?

_Turn left at the tap, go past the phone shop, turn right by the washing line, but only if you're coming on Tuesday, because the owner only does their washing on Tuesdays._

[Only the best postal workers will be able to use a hand drawn map](https://www.facebook.com/HookLighthouse/posts/1058520717580115:0)!

Similarly, many hiking trails are unmapped. Or evolve over time as the landscape changes (erosion, landslides, etc.). In these cases; how do you point people in the right direction?

Co-ordinates are one solution, but can be complex to share in person or over the phone.

In 2013 I discovered [What3Words](https://what3words.com/). They have coded every 3m square in the world a unique 3 word address that will never change.

3 word addresses are easy to say and share, and are as accurate as GPS coordinates.

`51.520847`, `-0.19552100` = [`filled.count.soap`](https://what3words.com/filled.count.soap)

<img class="img-fluid" src="/assets/images/blog/2019-11-08/open-location-code-plus-code-glenmore-scotland-sm.png" alt="Glenmore Scotland Plus Code" title="Glenmore Scotland Plus Code" />

Google have launched a similar, open-source initiative, [Plus Codes](https://plus.codes/).

Like What3Words, Plus codes give addresses to everyone, everywhere.

A Plus Code looks like this: [`5894+3W`](https://plus.codes/9C9R5894+3W). 

Not quite as intuitive as What3Words codes, but they are used in and by Google Maps, which makes them more accessible.

Enter a location and the online Plus Code tool will generate a code[Plus Codes](https://plus.codes/).

Enter a Plus Code and Google Maps will return the exact location -- perfect for the millions of people with the Google Maps app installed on their phones.

I currently take advantage of [the open-source Python Open Location Code library available on Github that converts co-ordinates into Plus Codes](https://github.com/google/open-location-code).

_**Update January 2020**: [Call for Trekkers to "map the unmapped"](/blog/mapping-the-unmapped-using-360-degree-photos)_.