---
date: 2022-04-21
title: "Overlaying GoPro Telemetry Dynamically onto Videos"
description: ""
categories: treks
tags: []
author_staff_member: dgreenwood
image: /assets/images/blog/2022-04-21/
featured_image: /assets/images/blog/2022-04-21/
layout: post
published: false
---

We're going on an adventure.

[A few weeks back I showed how to use gopro-telemetry to extract gpmf metadata from GoPro videos](/blog/2022/gopro-telemetry-exporter-getting-started).

Given the types of videos created when making virtual tours, one of the uses for the resulting `.json` telemetry file is for a video overlay.

That is, showing information reported by the cameras sensors inside the `.json` at

This is possible as both the video stream and telemetry stream (.json file) as they both contain time information that can be used to overlay the correct telemetry at the right video time.

<img class="img-fluid" src="/assets/images/blog/2022-04-21/mapillary-map-overlay.png" alt="Mapillary Map Example" title="Mapillary Map Example" />

I wanted to create a video with a Mapillary style map overlay showing bioth the current position of the video and the entire route covered.

Here is how I used gopro-telemetry, MapBox, ffmpeg, and a few other tools to bring this idea to life...

## Sample JSON telemtety

For this example I will use the video `GS030141.mp4` (an equirectangular video shot on the GoPro MAX and stitched with GoPro Studio with a resolution 4096x2048). 

[You can download it here, should you want to follow along](https://drive.google.com/file/d/19jcPzpa4I1vEIwhqPdVsJCJ6gVcFu5cf/view?usp=sharing).

I have extracted the `GPS5` telemetry stream from the video to produce `GS030141.json`, [which can be downloaded here](https://gist.github.com/himynamesdave/4db5e613f026c3828c765282b414e643).

Below is the first GPS point in `GS030141.json`:

```json
{
	"cts":0,
	"date":"2020-08-02T11:59:05.905Z",
	"fix":3,
	"precision":107,
	"altitude system":"MSLV",
	"GPS (Lat.) [deg]":28.7015115,
	"GPS (Long.) [deg]":-13.9204121,
	"GPS (Alt.) [m]":243.304,
	"GPS (2D speed) [m/s]":1.067,
	"GPS (3D speed) [m/s]":0.73
},
```

In the gopro-telemetry `.json` there are two time values;

* `cts`: this is the miliseconds since the first frame of the video
* `date`: this is the datetime reported by the GPS sensor

The video runs for 144.133333 seconds (2 mins 24.133333 seconds). The first time is; `2020-08-02T11:59:05.905Z` (cts; `0`) and last time is; `2020-08-02T12:01:30.225Z` (cts; `144894.75`). 

The telemetry file contains 2496 GPS positions, like the one shown in the snippet above.

## 1. Considerations

The telemetry contains GPS information (timestamp, latitude, longitude). For each time,lat,lon point I will generate a static image showing that point on a map.

The map images will then be wrapped into a video overlaid onto the video at the correct time, creating the effect of a real-time map in the video showing the current position in the world that the video was filmed.

## 2. Generating a GeoJSON for the overlays using gopro-telemetry

[The MapBox Static Images API has a free tier which allows for 50,000 request per month at no cost](https://www.mapbox.com/pricing/#glstatic). Ignoring some trial and error, I only need 2,496 calls for each GPS position.

Given our videos are outdoors and adventure based, I will use the [MapBox Outdoor map style](https://www.mapbox.com/maps/outdoors), retrieved using the endpoint `https://api.mapbox.com/styles/v1/mapbox/outdoors-v11/static/`.

I will use a map with a:

* `LineString`: showing the entire route
* `Point`: showing the current video position

It's therefore easier to first create a [GeoJSON file](https://geojson.org/) to pass to the MapBox Static Images API.

The first GeoJSON (`000000.geojson`) (named in sequential order of points, starting with 0) will look like this (note, I have only inserted the first 3 GPS points for this example:

```json
{
    "type": "FeatureCollection",
    "name": "Sample",
    "features":
    [
        {
            "type": "Feature",
            "geometry":
            {
                "type": "Point",
                "coordinates":
                [
                    -13.9204121,
                    28.7015115
                ]
            }
        },
        {
            "type": "Feature",
            "geometry":
            {
                "type": "LineString",
                "coordinates":
                [
                    [
                        -13.9204121,
                        28.7015115
                    ],
                    [
                        -13.9204117,
                        28.7015115
                    ],
                    [
                        -13.9204111,
                        28.7015117
                    ]
                ]
            }
        }
    ]
}
```

In the second GeoJSON (`000001.geojson`), the `LineString` object will remain the same, however the `Point` will be updated to the second point in the telemetry, 

```json
        {
            "type": "Feature",
            "geometry":
            {
                "type": "Point",
                "coordinates":
                [
                    -13.9204117,
                    28.7015115
                ]
            }
        },
```

...and so on for all of the remaining GeoJSON files.

## 3. Generating the map images using MapBox

You can pass then pass the newly created GeoJSON files to [MapBox's GeoJSON endpoint](https://docs.mapbox.com/api/maps/static-images/#geojson).

MapBox accepts the GeoJSON object encoded as a URI component passed in the URL.

Therefore the only thing that is left to do is minify and then encode each GeoJSON file so it can be passed like so 

```shell
$ curl -g "https://api.mapbox.com/styles/v1/mapbox/outdoors-v11/static/geojson({GEOJSON})/{LON},{LAT},{ZOOM}/{WIDTH}x{HEIGHT}?access_token={APIKEY}" --output {FILENAME}.png
```

These are the required parameter, [but there are more documented here should you want to play around](https://docs.mapbox.com/api/maps/static-images/#retrieve-a-static-map-from-a-style).

Using the GeoJSON code snippet shared above, the command would be;

```shell
$ curl -g "https://api.mapbox.com/styles/v1/mapbox/outdoors-v11/static/geojson(%7B%22type%22%3A%22FeatureCollection%22%2C%22name%22%3A%22Sample%22%2C%22features%22%3A%5B%7B%22type%22%3A%22Feature%22%2C%22geometry%22%3A%7B%22type%22%3A%22Point%22%2C%22coordinates%22%3A%5B-13.9204121%2C28.7015115%5D%7D%7D%2C%7B%22type%22%3A%22Feature%22%2C%22geometry%22%3A%7B%22type%22%3A%22LineString%22%2C%22coordinates%22%3A%5B%5B-13.9204121%2C28.7015115%5D%2C%5B-13.9204117%2C28.7015115%5D%2C%5B-13.9204111%2C28.7015117%5D%5D%7D%7D%5D%7D)/-13.9204121,28.7015115,10/500x300?access_token=hidden" --output 0.png
```

You might run into issue here depening on how many points are in your telemetry file. MapBox has a [8192 character limit on URL lengths](https://docs.mapbox.com/api/overview/#url-length-limits). `.geojson` files for videos longer than one minute can start to break this threshold.

There are three options in this case;

* filter the number of points generated in the telemetry by using the options in GoPro telemetry (read more here)
* uploading a new style using the `.geojson` file in the MapBox Studio UI
* [creating a new style using the `.geojson` file via the MapBox API](https://docs.mapbox.com/api/maps/styles/#example-request-create-a-style)

## 4. Adjust images size

My inspiration for the overlay comes from Mapillary, a-picture-in-picture map in the bottom left corner of the video, so I need to resize the map images accordingly.

### 4A. HERO videos

<img class="img-fluid" src="/assets/images/blog/2022-04-21/map-in-video-overlay.jpg" alt="Map in video design" title="Map in video design" />

Adjust the map size to desired proportions.

You can use imagemagick to do this like so:

```shell
magick MAP-INPUT.png -resize DESIRED-WIDTHx MAP-OUTPUT.png
```

For example to resize to a width of 410 (while keeping height relative):

```shell
magick 0.png -resize 410x xc:none PNG32resized-0.png
```

### 4B. 360 (equirectangular) videos

You can identify equirectangular videos using the metdata tag `<XMP-GSpherical:ProjectionType>equirectangular</XMP-GSpherical:ProjectionType>`).

<img class="img-fluid" src="/assets/images/blog/2022-04-21/map-in-video-360.jpg" alt="Map in video 360 map" title="Map in video 360 map" />

[I explained the need to do convert a normal projected file into the equirectangular space in my post on generating a nadir using imagemagick last year](/blog/2021/adding-a-custom-nadir-to-360-video-photo/).

Now, you could convert the map to an equirectangular projection too. However, as I noted in that post:

> If you've every looked at a equirectangular projected 360 photo you will have clearly seen how distorted it is at the top and bottom of the image, but less around the center.

The center, where I plan to overlay the map as shown suffers little distortion from a normal projection, meaning you can get away with not converting it (as long as it doesn't stray too near the top and bottom of the video -- you'll need to experiment).

If you did need to convert the map to an equirectangular projection

1. create a png file matching the video resolution (with a transparent background)
2. place the map image into it in the desired space (where you want it to appear in the viewer)
3. convert the whole image to equirectangular ready to be overlaid onto the video

I won't convert my map to eequirectangular in this post (judge for yourself the output), and will simply resize in the same way I showed for non-equirectangular videos.

## 4. Create a video file of the images using ffmpeg

Now that we have the images we can overlay them onto the video.

The tricky bit here is aliging the correct image to the correct point in the video.

The framerate of the input video is;

```shell
ffprobe -v error -select_streams v:0 -show_entries stream=duration -of default=noprint_wrappers=1:nokey=1 GS030141.mp4
```

Prints time in seconds:

```
144.133333
```

And for framerate:

```shell
ffprobe -v error -select_streams v -of default=noprint_wrappers=1:nokey=1 -show_entries stream=r_frame_rate GS030141.mp4
```

Which prints as a fraction:

```
30000/1001
```

(or 29.97002997)

This is also reported as a rounded FPS value at the end of `GS030141.json`;

```json
"frames/second":30
```

You can also get total frames like so

```shell
ffprobe -v error -select_streams v:0 -count_packets -show_entries stream=nb_read_packets -of csv=p=0 GS030141.mp4
```

Which gives:

```
4321
```

This actually counts packets instead of frames but it is much faster. Result should be the same. If you want to verify by counting frames change -count_packets to -count_frames and nb_read_packets to nb_read_frames.

**A quick note on GoPro GPS**

The GoPro GPS sensors capture at 18Hz, so that's a maximum of 18 GPS points per second. 

It is also possible that fewer than 18 points might be reported per second in the telemetry (for example, where there is a lot of obstruction).

<img class="img-fluid" src="/assets/images/blog/2022-04-21/map-in-video-gps-spacing.jpg" alt="Video map overlay image selection" title="Video map overlay image selection" />

This also means we won't have an even distribution of GPS points for every seconds of the video (e.g. 1 second might have 18 GPS points, and the next might only have 5).

Videos on GoPro cameras can be shot a varying frames rates too. In our example the framerate is 30 FPS, but other GoPro cameras support slower and faster framerates (up to 240 FPS @  2.7K on the HERO 10).

**End note**

As you can see, whilst we have 4321 frames over 144.133333 seconds (30FPS) in the input video, we only have 2496 GPS points over the same period. Roughly the video has 17.3172988375 GPS points per second (`2496 / 144.133333`).

I also do not want to lower the framerate of the video.

To solve the difference in frames we can;

* overlay the first map image over the start of the video
* load the second map image, and its `cts` time
* we continue to overlay the first image until video time >= `cts` time of image 2
* when this happens we overlay the second map image on the video
* now load the second map image, and its `cts` time
* ...and so on until the final framee

TODO