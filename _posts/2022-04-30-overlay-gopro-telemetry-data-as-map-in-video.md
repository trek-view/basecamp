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

For this example I will use two videos

1. `GX010044.MP4`: a HERO video shot on the GoPro HERO 10 with a resolution of 5312x2988.
2. `GS018421.mp4`: an equirectangular video shot on the GoPro MAX and stitched with GoPro Studio with a resolution 4096x2048. 

[I have extracted the `GPS5` telemetry stream using `gopro-telemetry` for both these videos](/blog/2022/gopro-telemetry-exporter-getting-started).

Below is the first GPS point from `GX010044.MP4`:

```json
{"1":
    {"streams":
        {"GPS5":
            {"samples":[
                {"value":[53.3758026,-1.5853544,183.947,0.849,0.62],"cts":39.389,"date":"2022-01-12T15:40:00.765Z","sticky":
                    {"fix":3,"precision":537,"altitude system":"MSLV"}
                },
```

And for `GS018421.mp4`:

```json
{"1":
    {"streams":
        {"GPS5":
            {"samples":[
                {"value":[51.27256,-0.8459806,80.853,0.054,0.07],"cts":174.018,"date":"2021-09-04T07:22:56.299Z","sticky":
                    {"fix":3,"precision":139,"altitude system":"MSLV"}
                },
```

In the gopro-telemetry `.json` there are two time values;

* `cts`: this is the miliseconds since the first frame of the video
* `date`: this is the datetime reported by the GPS sensor


`GX010044.MP4` GPS telemetry runs from `2022-01-12T15:40:00.765Z` to `2022-01-12T15:40:14.013Z` with 217 positions.

`GS018421.mp4` GPS telemetry runs from `2021-09-04T07:22:56.299Z` to `2021-09-04T07:23:17.355Z` with 368 positions.

## 1. Considerations

The telemetry contains GPS information (timestamp, latitude, longitude). For each time,lat,lon point I will generate a static image showing that point on a map.

The map images can then be wrapped into a video overlaid onto the video at the correct time, creating the effect of a real-time map in the video showing the current position in the world that the video was filmed.

## 2. Generating a GeoJSON for the overlays using gopro-telemetry

[The MapBox Static Images API has a free tier which allows for 50,000 request per month at no cost](https://www.mapbox.com/pricing/#glstatic). Ignoring some trial and error, I only need 2,496 calls for each GPS position.

Given our videos are outdoors and adventure based, I will use the [MapBox Outdoor map style](https://www.mapbox.com/maps/outdoors), retrieved using the endpoint `https://api.mapbox.com/styles/v1/mapbox/outdoors-v11/static/`.

I will use a map with a:

* `LineString`: showing the entire route
* `Point`: showing the current video position

It's therefore easier to first create a [GeoJSON file](https://geojson.org/) to pass to the MapBox Static Images API.

The first GeoJSON (`000000.geojson` -- named in sequential order of points, starting with 0) will look like this for `GX010044.MP4` (note, I have only inserted the first 3 GPS points for this example):

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
                    -1.5853544,
                    53.3758026
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
                        -1.5853544,
                        53.3758026
                    ],
                    [
                        -1.585357,
                        53.3758009
                    ],
                    [
                        -1.585358,
                        53.3758015
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
                    -1.585357,
                    53.3758009
                ]
            }
        },
```

...and so on for all of the remaining GeoJSON files. Note, [the geojson is in `lon,lat` format](/blog/2022/latitude-longitude-standard).

## 3. Calculate images size and overlay position

My inspiration for the overlay comes from Mapillary, a-picture-in-picture map in the bottom left corner of the video, so I need to resize the map images accordingly.

### 3A. HERO videos

<img class="img-fluid" src="/assets/images/blog/2022-04-21/map-in-video-overlay-hero.jpg" alt="Map in video design" title="Map in video design" />

For HERO video, I have found the following dimensions look best;

I generate an map image with the same proportions as the video by calculating 20% of video width and height (rounded to the closest integer) and assigning to map width and height. For the margins, I calculate 2% of video width.

So for the example `GX010044.MP4` (5312x2988) gives;

* width = 20% video width = `5312*0.2` = 1062.4 = 1062
* height = 20% video height = `2988*0.2` = 597.6 = 598
* left / bottom margin = 2% video width = `5312*0.02` = 106.24 = 106

### 3B. 360 (equirectangular) videos

You can identify equirectangular videos using the metdata tag `<XMP-GSpherical:ProjectionType>equirectangular</XMP-GSpherical:ProjectionType>`).

<img class="img-fluid" src="/assets/images/blog/2022-04-21/map-in-video-overlay-equi.jpg" alt="Map in video 360 map" title="Map in video 360 map" />

[I explained the need to do convert a normal projected file into the equirectangular space in my post on generating a nadir using imagemagick last year](/blog/2021/adding-a-custom-nadir-to-360-video-photo/).

Now, you could convert the map to an equirectangular projection too. However, as I noted in that post:

> If you've every looked at a equirectangular projected 360 photo you will have clearly seen how distorted it is at the top and bottom of the image, but less around the center.

The center, where I plan to overlay the map as shown suffers little distortion from a normal projection, meaning you can get away with not converting it (as long as it doesn't stray too near the top and bottom of the video -- you'll need to experiment).

If you did need to convert the map to an equirectangular projection you would first need to create it using the API and then

1. create a png file matching the video resolution (with a transparent background)
2. place the map image into it in the desired space (where you want it to appear in the viewer)
3. convert the whole image to equirectangular ready to be overlaid onto the video

I won't convert my map to equirectangular in this post (judge the output for yourself), and will simply resize in the same way I showed for non-equirectangular videos.

My calculations for map image dimensions are a little different here because I want my map to be immediately visible in the 360 viewer when the video plays, and the way equirectangular videos appear in the viewer is different.

As the viewer does not contain the entire video in frame, I reduce the width and height of the map to just 10% of video width and height respectively. The margins are also much larger, to ensure the map shows in the initial view (before the user starts to look around).

So for the example `GS018421.mp4` (4096x2048) gives:

* width = 10% video width = `4096*0.1` = 409.6 = 410
* height = 10% video height = `2048*0.1` = 204.8 = 205
* left margin = 35% video width = `4096*0.35` = 1433.6 = 1435
* bottom margin = 35% video height = `2048*0.35` = 716.8 = 717

## 4. Generating the map images using MapBox

You can pass then pass the newly created GeoJSON files to [MapBox's GeoJSON endpoint](https://docs.mapbox.com/api/maps/static-images/#geojson).

MapBox accepts the GeoJSON object encoded as a URI component passed in the URL.

Therefore the only thing that is left to do is minify and then encode each GeoJSON file so it can be passed like so;

```shell
$ curl -g "https://api.mapbox.com/styles/v1/mapbox/outdoors-v11/static/geojson({GEOJSON})/{LON},{LAT},{ZOOM}/{WIDTH}x{HEIGHT}?access_token={APIKEY}" --output {FILENAME}.png
```

These are the required parameters, [but there are more documented here should you want to play around](https://docs.mapbox.com/api/maps/static-images/#retrieve-a-static-map-from-a-style).

`{LON},{LAT}` are the map center ([MapBox expects `lon,lat` format](/blog/2022/latitude-longitude-standard)), `{ZOOM}` is the [MapBox zoom level](https://docs.mapbox.com/help/glossary/zoom-level/), and {WIDTH}x{HEIGHT} were calculated at step 3.

Using the GeoJSON code snippet shared above (minified), the full command would be;

```shell
$ curl -g "https://api.mapbox.com/styles/v1/mapbox/outdoors-v11/static/geojson(%7B%22type%22%3A%22FeatureCollection%22%2C%22name%22%3A%22Sample%22%2C%22features%22%3A%5B%7B%22type%22%3A%22Feature%22%2C%22geometry%22%3A%7B%22type%22%3A%22Point%22%2C%22coordinates%22%3A%5B-1.5853544%2C53.3758026%5D%7D%7D%2C%7B%22type%22%3A%22Feature%22%2C%22geometry%22%3A%7B%22type%22%3A%22LineString%22%2C%22coordinates%22%3A%5B%5B-1.5853544%2C53.3758026%5D%2C%5B-1.585357%2C53.3758009%5D%2C%5B-1.585358%2C53.3758015%5D%5D%7D%7D%5D%7D)/-1.5853544,53.3758026,10/500x300?access_token=hidden" --output 0.png
```

You might run into issues here depending on how many points are in your telemetry file. MapBox has a [8192 character limit on URL lengths](https://docs.mapbox.com/api/overview/#url-length-limits). `.geojson` files for videos longer than a few seconds can start to break this threshold.

There are three options in this case;

* filter the number of points generated in the telemetry by using the options in GoPro telemetry (read more here)
* uploading a new style using the `.geojson` file in the MapBox Studio UI
* [creating a new style using the `.geojson` file via the MapBox API](https://docs.mapbox.com/api/maps/styles/#example-request-create-a-style) (recommended)

## 5. Create a video file of the images using ffmpeg

Now that we have the map images we can overlay them onto the video.

The tricky bit here is aligning the correct map image at the correct point in the video.

For this we need to know a little bit about the video (I'll use `GX010044.MP4` in the example).

The framerate of the input video is (`11.878533`);

```shell
ffprobe -v error -select_streams v:0 -show_entries stream=duration -of default=noprint_wrappers=1:nokey=1 GX010044.MP4
11.878533
```

And for framerate (`30000/1001` or 29.97002997):

```shell
ffprobe -v error -select_streams v -of default=noprint_wrappers=1:nokey=1 -show_entries stream=r_frame_rate GX010044.MP4
30000/1001
```

This is also reported as a rounded FPS value at the end of the `GX010044.MP4` telemetry json;

```json
"frames/second":30
```

Keep in mind, videos on GoPro cameras can be shot a varying frames rates. In our example the framerate is 30 FPS, but other GoPro cameras support slower and faster framerates (up to 240 FPS @ 2.7K on the HERO 10).

You can also get total frames (`356`);

```shell
ffprobe -v error -select_streams v:0 -count_packets -show_entries stream=nb_read_packets -of csv=p=0 GX010044.MP4
356
```

This actually counts packets instead of frames but it is much faster. Result should be the same. If you want to verify by counting frames change `-count_packets` to `-count_frames` and `nb_read_packets` to `nb_read_frames`.

**A quick note on GoPro GPS**

The GoPro GPS sensors capture at 18Hz, so that's a maximum of 18 GPS points per second. 

It is also possible that fewer than 18 points might be reported per second in the telemetry (for example, where there is a lot of obstruction).

<img class="img-fluid" src="/assets/images/blog/2022-04-21/map-in-video-gps-spacing.jpg" alt="Video map overlay image selection" title="Video map overlay image selection" />

This also means you're very unlikely to have have an even distribution of GPS points for every seconds of the video (e.g. 1 second might have 18 GPS points, and the next might only have 5).

**End note**

As you can see, whilst we have 356 frames over 11.878533 seconds (@30FPS) in the input video `GX010044.MP4`, we only have 217 GPS points over the same period. Roughly the video has 18.268 GPS points per second (`217 / 11.878533`).

As I do not want to lower the framerate of the video, I need to dynamically adjust when the map images are shown. As such, some map frames will be shown in the overlay longer than others.

To do this we can;

1. overlay the first map image over the start of the video at time 00:00
2. load the second map image, and its `cts` time
3. we continue to overlay the first image until video time >= `cts` time of image 2
4. when this happens we overlay the second map image on the video
5. now load the second map image, and its `cts` time
6. ...and so on until the final frame

TODO