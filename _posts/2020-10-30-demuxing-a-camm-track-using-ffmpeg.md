---
date: 2020-10-30
title: "Extracting CAMM Telemetry"
description: "How to get a raw, human readable Camera Motion Metadata track from a video with a CAMM track."
categories: developers
tags: [CAMM]
author_staff_member: dgreenwood
image: /assets/images/blog/2020-10-30/
featured_image: /assets/images/blog/2020-10-30/
layout: post
published: false
---

**Obtaining detailed video telemetry for analysis**

The Map the Paths Desktop Uploader uses ffmpeg to turn videos into frames, allowing you to modify the photos uploaded to external services like Mapillary.

In a previous post, [we used exiftool as a quick way to extract a GPX track](/blog/2020/extracting-gps-track-from-360-timelapse-video) or to [read metadata from a video](/blog/2020/metadata-exif-xmp-360-video-files/).

The resulting outputs are useful for many services, [but it strips a lot of other IMU sensor data](/blog/2020/camera-sensors-imu-accelerometer-gyroscope-magnetometer).

I wanted to write this post to share with you how we extract raw CAMM (Camera Motion Metadata) for others building applications that require more advanced telemetry (a post on GPMF (GoPro) extraction coming soon...).

## Check the video can be read

Use the following command to see whether FFmpeg can play the video. Note that you already have ffplay if you installed ffmpeg.

```
$ ffplay ~/Downloads/MY_VIDEO.mp4
```

If your video plays, move to the next step. If your video does not play, convert your video to the video formats supported by FFmpeg including H.264 and VP9.

## Transcoding to MJPEG (Motion JPEG)

Now let's transcode MY_VIDEO.mp4 to MY_VIDEO.mjpeg with the same FFmpeg command that the Ingest server is using. This step will detect the problems that cause potential frame extraction failures.

```
$ ffmpeg -nostats -nostdin -hide_banner -filter_threads 1 -filter_complex_threads 1 -max_error_rate 1 -analyzeduration 10000000 -probesize 5000000 -noautorotate -i ~/Downloads/MY_VIDEO.mp4 -map_metadata -1 -vsync 0 -q:v 2 -flags -cgop-mv4-loop-aic -fastfirstpass 0 -an -sn -f image2pipe -max_muxing_queue_size 10000000 -y ~/Downloads/MY_VIDEO.mjpeg
```

To verify the result of transcoding, you need to play the mjpeg file with this command:

```
$ ffplay ~/Downloads/MY_VIDEO.mjpeg
```

If your mjpeg video plays, move to the next step.

## Convert to JPEG

You can now split the mjpeg file into jpeg image files to work with locally (i.e. remove unwanted frames). The quality of extracted frames is preserved. Note that not all of the frames will be published when you upload the video through externals service because of downsampling (Google Street View is estimated to use 1 photo every 5 meters). 

```
$ mkdir ~/Downloads/MY_VIDEO
$ ffmpeg -i ~/Downloads/MY_VIDEO.mjpeg -vcodec copy ~/Downloads/MY_VIDEO/MY_VIDEO_frame%d.jpg
```

## Classify telemetry stream

Usually it's easier to classify the telemetry stream, and if it exists using exiftool:

```
$ exiftool -G -a MY_VIDEO.mp4 > MY_VIDEO_metadata.txt
```

Looking at the resulting text file you will likely see either:

**CAMM format**

```
...
Handler Type                    : Camera Metadata
Handler Description             : CameraMetadataMotionHandler
Other Format                    : camm
...
```

Now you know the telemetry standard, it is possible to extract it.

## Locate the telemetry stream

We can find where the CAMM stream is located in the video by running ffprobe. Note that you already have ffprobe if you installed ffmpeg.

```
$ ffprobe ~/Downloads/MY_VIDEO.mp4
...
 Duration: 00:01:31.92, start: 0.000000, bitrate: 1240613 kb/s
    Stream #0:0(und): Video: mjpeg (mp4v / 0x7634706D), yuvj420p(pc, bt470bg/unknown/unknown), 11000x5500 [SAR 1:1 DAR 2:1], 1257011 kb/s, 6.69 fps, 7 tbr, 100k tbn, 100k tbc (default)
    Metadata:
      creation_time   : 2018-04-05T08:57:33.000000Z
    Stream #0:1(und): Data: none (camm / 0x6D6D6163), 80 kb/s (default)
    Metadata:
      creation_time   : 2018-04-05T08:57:33.000000Z
...
```

In this case, it is a CAMM stream is located in "0:1.".

## Validate the CAMM stream format

You need to run the following ffmpeg command to validate the CAMM stream format.

```
$ ffmpeg  -y -i ~/Downloads/MY_VIDEO.mp4 -map_metadata -1 -an -vn -sn -map 0:d -f nut ~/Downloads/camm_MY_VIDEO.bin
```

If the ffmpeg encounters errors, the output may end with "Conversion failed!" You will need to identify and resolve any problems before moving to the next step.

## Decode the CAMM stream

The CAMM stream is not human readable. We need to use a modified version of ffmpeg to convert to a human readable format.

**Install additional codecs for FFmpeg**

```
$ sudo apt-get install nasm yasm libx264-dev libx265-dev libvpx-dev libfdk-aac-dev libmp3lame-dev libopus-dev
```

**Get the modified version of FFmpeg (camm branch)**

The core version of ffmpeg does not contain the functionality to do this, therefore the following custom branch of ffmpeg is used.

```
$ git clone https://github.com/lbobryan/FFmpeg
$ cd FFmpeg
$ git checkout camm
```

**Configure FFmpeg**

```
$ ./configure --disable-vaapi --disable-vdpau --enable-gpl --enable-libass --enable-libfdk-aac --enable-libfreetype --enable-libmp3lame --enable-libopus --enable-libtheora --enable-libvorbis --enable-libvpx --enable-libx264 --enable-libx265 --enable-nonfree
```

**Install FFmpeg**

```
$ make
$ sudo make install
```

**Build demuxer**

```
$ make examples
```

**Run demuxer**

```
$ cd doc/examples
$ ./camm_demuxing ~/Downloads/MY_VIDEO.mp4 /dev/null ~/Downloads/camm_MY_VIDEO.txt
```

Now, you can check `/Downloads/camm_MY_VIDEO.txt` for the GPS and the IMU tracks. Here is an example:

```
pts:12001 pts_time:0.12001 time_gps_epoch: 1206301997.040372 gps_fix_type: 3 latitude: 37.390863 longitude: -122.083342 altitude: -8.667001 horizontal_accuracy: 0.517000 vertical_accuracy: 0.772000 vertical_east: -1.958000 vertical_north: 0.998000 vertical_up: -0.035000 speed_accuracy: 0.123000
pts:12004 pts_time:0.12004 gyro[0]: -0.034615 gyro[1]: -0.023964 gyro[2]: -0.011716
pts:12004 pts_time:0.12004 acc[0]: 1.016850 acc[1]: 0.492871 acc[2]: 9.752150
```

You'll find:

* GPS track should have lat, long, and altitude.
* GPS track should have accuracy and velocity fields
* IMU track (gyroscope and accelerometer) should be presented.