---
date: 2019-08-09
title: "DIY Google Street View (5/5): Publish 360-Degree Photos to Street View"
description: "Use Tourer to upload 360-degree photo tours to Google Street View from your computer."
categories: guides
tags: [Tourer, Trek Pack 1]
author_staff_member: dgreenwood
image: /assets/images/blog/2019-08-09/UKRT049-MULTISHOT_8120_000036-meta.jpg
featured_image: /assets/images/blog/2019-08-09/tourer-command-line-tools-example.jpg
layout: post
published: true
---

**Use Tourer to upload 360-degree photo tours to Google Street View from your computer.**

## Existing Street View Upload options

Taking one or two 360-degree photos on your phone and uploading to Google Street View is simple. Google have built Street View apps for both [Android](https://play.google.com/store/apps/details?id=com.google.android.street) and [iOS](https://apps.apple.com/gb/app/google-street-view/id904418768) devices.

Other cameras I considered before selecting the GoPro Fusion, such as the [Ricoh Theta V](https://theta360.com/en/about/theta/v.html), upload to Street View automatically when connected to your phone (with the Street View app installed).

Though when it comes to uploading a larger number of photos or streaming video from powerful 360-degree cameras, even the Theta V can struggle (usually the limitation is your phone in processing the data).

The other alternative has been to get technical, with a good knowledge of programming required to interact with the [Google Street View publish API](https://developers.google.com/streetview/publish/).

## Introducing Tourer

<img class="img-fluid" src="/assets/images/blog/2019-08-09/tourer-command-line-tools-example.jpg" alt="Trek View  Tourer CLI Example" title="Trek View Tourer CLI Example" />

To solve this problem, we have built a small piece of software to make it fairly simple (albeit for now with some technical knowledge) to upload a large number of 360-degree photos to Google Street View.

[Today we're releasing it as open-source piece to the community](https://github.com/trek-view/tourer).

Download and run it on your computer (Windows, Mac, and Linux) to publish 360-degree photos to Street View using your Google account.

To help you get up up-and-running quickly with Tourer we've [created a detailed guide describing how to use the software to publish your photos to Street View](https://github.com/trek-view/tourer).

As noted, it does require some level of technical knowledge. The software is currently a set of command line tools.

This release of Tourer can be classed as an alpha version. Simply put, there will probably be bugs in the software. Please let us know if you encounter any errors by [contacting us via email](/contact) or [raising an issue on GitLab](https://github.com/trek-view/tourer/issues).

## Tourer Roadmap

I'm working hard to make Tourer easier to use for non-technical users. The next release will provide a friendlier installation process and a visual interface to manage tours.

Do you want to be the first to know when the next version of Tourer is released?

[Register for our newsletter and we'll keep you posted](https://www.mapthepaths.com).

## Help us Improve Tourer

If you're technical and have a few ideas up your sleeve; why not help improve Tourer for everyone?

Tourer software is provided as open-source under an AGPL v3 license. The [source code for Tourer can be accessed here](https://github.com/trek-view/tourer).

## Share Your Tours with Us

You now know how to shoot, process, and publish 360-degree photo tours on Google Street View.

What are you waiting for?

Tag us on [Twitter @trekview](https://twitter.com/trekview), or [Instagram @trekviewed](https://www.instagram.com/trekviewed/) with details of your tours.

We'll happily promote them to the Trek View community.

## Missed any parts of my DIY Street View series?

1. [How I (Trek View) Started Capturing 360-Degree Tours](/blog/2019/diy-google-street-view-part-1-how-trek-view-started)
2. [My Basic Kit for Creating Outdoor Street View Tours](/blog/2019/diy-google-street-view-part-2-my-street-view-kit)
3. [Preparing to Shoot 360-Degree Tours for Google Street View](/blog/2019/diy-google-street-view-part-3-preparing-to-shoot)
4. [Stitching 360-Degree Photos Using GoPro Fusion Studio](/blog/2019/diy-google-street-view-part-4-processing-photos/)

## Bonus: Part 6

Read Part 6 now: [Increasing the Battery Life of Your GoPro Fusion](/blog/2019/diy-google-street-view-part-6-increasing-gopro-fusion-battery-life)

_Update December 2019: [You can now access the Trek Pack Getting Started Guide online with all the latest information you need to create, process and publish your own Street View Tours](/trek-pack/version-one)._

_Update June 2020: [A newer version of the Trek Pack (v2) exists, that superseeds the pack (v1) described in this post](/blog/2020/announcing-trek-pack-v2)._

_Update October 2020: Tourer has been replaced with the Map the Paths Desktop Uploader. [More information and download links are here](/blog/2020/map-the-paths-desktop-uploader)._