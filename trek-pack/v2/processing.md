---
title: Trek Pack v2 Processing
heading: Trek Pack v2 Processing
description: How to process your MAX content...
image: /assets/images/pages/trek-pack/v2/trek-pack-v2-emptied.jpg
layout: page
---

<div class="text-container">

<h4>Processing</h4>

<h5>Backup files from the SD Card</h5>

<p>Make sure to keep make a copy of the videos / images on the microSD card before you start processing/modifying them. You might need them again later.</p>

<h5>Timelapse Mode</h5>

<h6>Processing Your Photos</h6>

<p>After shooting, copy the files for each segment of the tour onto your computer using the MicroSD USB card reader.</p>

<p>Have a look at the photos captured.</p>

<p>In my case, often the first and last 20 photos will be me setting up the camera or stopping. Occasionally I am also disturbed mid-tour (usually by animals).</p>

<p>The photos are stitched on the camera, so you only have to remove any unwanted photos before publishing elsewhere.</p>

<p><strong>1.0.1 A note on filename format</strong></p>

<p>The photo filename is split into 3 identifying parts (I'll use <code>GSAC0857.jpg</code> as an example):</p>

<ul>
<li><code>GS</code>: always the same. Can be used to identify a photo taken on the MAX.</li>
<li><code>AC</code>: each time you start and stop the timelapse the latter will increase by one (<code>AA</code>, <code>AB</code>, <code>AC</code>, <code>AD</code>...)</li>
<li>0857: increases by one with each photo in the timelapse</li>
</ul>

<p>This can be useful information to know when organising tours. For example, you might shoot sequences over multiple shoots. In such cases, knowing the filename behaviour might help you organise them.</p>

<h5>Video Mode</h5>

<h6>Processing Your Videos</h6>

<p><strong>1. Download GoPro Player</strong></p>

<p>To process videos, you’ll need to download a piece of software called GoPro Player.</p>

<p><a href="https://community.gopro.com/t5/Cameras/No-GPS-Data-on-Gopro-MAX-360-mp4-s-GoPro-MAX-Exporter-Windows/m-p/655876#/M154733">At the time of writing, only the GoPro Player for Mac will allow you to create <code>.mp4</code> videos with GPS telemetry</a>. If you use a Windows machine, we recommend shooting in timelapse mode.</p>

<p><strong>2. Import and prepare your raw videos</strong></p>

<p>After shooting, copy the video files onto your computer using the MicroSD USB card reader.</p>

<p>You'll see 3 types of files:</p>

<ul>
<li><code>.360</code>:  a GoPro proprietary video format. This holds the raw video and telemetry. It can only be read by GoPro software, and needs to be processed into another video format for use elsewhere (see following steps). <strong>This is the file you'll need for processing.</strong></li>
<li><code>.LRV</code>: stands for Low-Resolution Video. These are what you’re actually seeing through the GoPro app when you play back the video.</li>
<li><code>.THM</code>: stands for Thumbnail. It’s a small image file that’s 160 by 120 pixels. It’s what you see in the GoPro app as the thumbnails to visually represent each video file.</li>
</ul>

<p><strong>2.0.1 A note on filename format</strong></p>

<p>The video filename is split into 3 identifying parts (I'll use <code>GS010135.360</code> as an example):</p>

<ul>
<li><code>GS</code>: always the same. Can be used to identify a video taken on the MAX.</li>
<li><code>01</code>: (first 2 digits) the camera breaks videos longer than 8 min 2 seconds into separate files. Increases by one with each 8 min 2 seconds recorded. For example, a 19 minute video would be split into 3 files (<code>GS010135.360</code>, <code>GS020135.360</code>, <code>GS030135.360)</code>.</li>
<li><code>0135</code> increases by one with each new video shot.</li>
</ul>

<p><strong>3. Add raw files to GoPro Player</strong></p>

<p>Now you have a folder of front and back images on your computer, you can add them to GoPro Player.</p>

<p>Select: File > Batch Exporter</p>

<p><strong>4. Define export settings</strong></p>

<p>Click one of the videos you have added to the batch exporter.</p>

<p>If you've added more than one file to the queue, hold down shift and select all files in the list. Click edit (top right of app).</p>

<p><img class="img-fluid" src="/assets/images/pages/trek-pack/v2/processing-gopro-studio-bulk-exporter-meta.jpeg" alt="GoPro Studio" title="GoPro Studio"></p>

<p>Select:</p>

<ul>
<li>Resolution = 5.6k</li>
<li>Codec = HEVC</li>
<li>World lock = FALSE</li>
<li>Horizon level = TRUE</li>
<li>Mount optimization = TRUE</li>
<li>360 Audio = FALSE</li>
<li>Retain GPMF data = TRUE</li>
</ul>

<p>Now all the videos in the queue will have the correct export settings.</p>

<p>You can now press the play button to start the export.</p>

<p>When complete, you'll have an <code>.mp4</code> file in the output directory specified (shown and configurable in bottom menu of app).</p>

<h4>End</h4>

<p>This completes the guide to the Trek Pack v2.</p>

</div>