---
date: 2021-01-21
title: "How to Create a 360 Video from a Timelapse of 360 Images (using Adobe Premiere Pro)"
description: "A less technical way to create timelapse videos with spherical metadata. No command line in sight (but you will need a Premiere subscription)."
categories: guides
tags: [GoPro, MAX, Adobe, timelapse]
author_staff_member: dgreenwood
image: /assets/images/blog/2021-01-21/adobe-premier-video.png
featured_image: /assets/images/blog/2021-01-21/adobe-premier-video-sm.png
layout: post
published: false
---

**A less technical way to create timelapse videos with spherical metadata. No command line in sight (but you will need a Premiere subscription).**

[Last summer I wrote about how you can use ffmpeg and Google's Spatial Media Metadata Injector to take a series of timelapse photos to create a single timelapse movie](/blog/2021/turn-360-photos-into-360-video) -- perfect for sharing on YouTube.

Though many of you emailed in asking if there was an easier way, without having to jump into an unfamiliar command line.

As you have probably already guessed from the title of this post the answer is yes. Here's how...

(If you want to follow along with the files I user, get them here.)

## Import images

Open Premiere Pro and go to File > Import.

In the File Browser, navigate to the folder with your image sequence.

Click on the first image file. Do not select all files. You only want to click on the first image in the sequence.

<img class="img-fluid" src="/assets/images/blog/2021-01-21/adobe-premiere-import-files.png" alt="Import 360 photos" title="Import 360 photos" />

In the import browser under your files, click on the checkbox for "image sequence". On a Mac, you will need to click "Options" to make this checkbox visible.

Open the file.

Your image sequence has now been imported as a single video file.

<img class="img-fluid" src="/assets/images/blog/2021-01-21/adobe-premier-video.png" alt="Imported timelapse video" title="Imported timelapse video" />

You can now drag this file from the project files onto the sequence timeline.

## Create the timelapse

You will likely want to modify the frame rate settings of your timelapse.

This will depend on many factors; time between source images, speed you want the timelapse to replay, and length of the timelapse.

My photos were shot at 1 frame every 2 seconds. There are 72 in total.

At a frame rate of 24 FPS (which is fairly standard in film-making) my video will be 48 time faster than it was shot (original rate was 24 frames every 48 seconds), and be 3 minutes long (72/24).

Increasing the frame rate speeds things up, lowering the framerate slows things down.

<img class="img-fluid" src="/assets/images/blog/2021-01-21/adobe-premiere-change-framerate.png" alt="Change framerate" title="Change framerate" />

To change the framerate, click the video file on the timeline, then select Sequence > Sequence Settings. The popup has a setting allowing you to modify the framerate.

## Export the timelapse

Select File > Export > Media

You can play around with the settings depending on how you intend to use the video. The settings described below are simple, and the ones I use to share content to video sharing platforms.

<img class="img-fluid" src="/assets/images/blog/2021-01-21/adobe-premiere-export-vr-timelapse.png" alt="Export settings" title="Export settings" />

* Format: H.264
* Preset: VR Monoscopic Match Source Stereo

It's worth playing around with the bitrate on export to suit the quality you want. [Higher bitrates offer better quality, but result in larger files](/blog/2020/fps-bitrate-compression-360-virtual-tours).


I just export using H265 and making sure the VR setting is enabled in the export screen. I max out bit rate and depth settings on the export screen.

If the files imported contained correct spherical information in the metadata (GPano tags), then the "Video is VR" should be auto selected. This is vital to ensure the correct 360 metadata is included in the video.




Clicking Export will start the creation of the .mp4 timelapse.

**A note on GPS and telemetry**

This process does not create a GPS track in the video, so GPS data from original photos will be lost.

Full telemetry needs to be written into the metadata in a standard structure (e.g [CAMM](https://developers.google.com/streetview/publish/camm-spec) or [GPMD](https://github.com/gopro/gpmf-parser)).

## The final timelapse

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/B2wP6Jfdg1A" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

And voila, the final timelapse on YouTube with full 360 video controls.

A big thank you to Brian Redmond who showed me this functionality in Premiere, and was patient with my question whilst figuring it our -- thanks Brian!