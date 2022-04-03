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

For this example I will use the video `GS030141.mp4` (a equirectangular video shot on the GoPro MAX and stitched with GoPro Studio). 

[You can download it here, should you want to follow along](https://drive.google.com/file/d/19jcPzpa4I1vEIwhqPdVsJCJ6gVcFu5cf/view?usp=sharing).

I have extracted the `GPS5` telemetry stream from the video to produce `GS030141.json`, [which can be downloaded here](https://gist.github.com/himynamesdave/4db5e613f026c3828c765282b414e643).

Below is the first GPS point in the JSON:

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

The video runs for 2 mins 24 seconds and the telemetry file contains 2496 GPS positions.

## 1. Considerations

This one requires the help of a third party to provide map tiles.

The telemetry contains GPS information (timestamp, latitude, longitude). For each time,lat,lon point I will generate a static image showing that point on a map.

Each map image will then be overlaid onto the video at the correct time, creating the effect of a real-time map in the video showing the current position in the world that the video was filmed.

[The MapBox Static Images API has a free tier which allows for 50,000 request per month at no cost](https://www.mapbox.com/pricing/#glstatic). Ignoring some trial and error, I only need 2,496 calls for each GPS position.

Given our videos are outdoors and adventure based, I will use the [MapBox Outdoor map style](https://www.mapbox.com/maps/outdoors), retrieved using the endpoint `https://api.mapbox.com/styles/v1/mapbox/outdoors-v11/static/`.

## 2. Generating a GeoJSON for the overlays using gopro-telemetry

I will use a map with a:

* `LineString`: showing the entire route
* `Point`: showing the current video position

It's therefore easier to first create a [GeoJSON file](https://geojson.org/) to pass to the MapBox Static Images API.

The first GeoJSON (`0.geojson`) (named in sequential order of points, starting with 0) will look like this (note, I have only inserted the first 3 GPS points for this example:

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

In the second GeoJSON (`1.geojson`), the `LineString` object will remain the same, however the `Point` will be updated to the second point in the telemetry, 

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

For steps, 2 and 3, I have built a script that:

1. takes the gopro-telemetry JSON file output with GPS points
2. creates a set of GeoJSON files
3. passes them to the MapBox API (using an API key set in the code)
4. saves the processed images from to your local machine, ready for step 4

[Download it here]().

## 4. Overlay the images using ffmpeg

Now that we have the images we can overlay them onto ffmpeg (in a similar way I showed for overlaying a nadir or watermark).

The tricky bit here is aliging the map images to the correct point in the video.

In the gopro-telemetry `.json` there were two time values

* `cts`: this is the miliseconds since the first frame of the video
* `date`: this is the datetime reported by the GPS sensor






https://ottverse.com/ffmpeg-drawtext-filter-dynamic-overlays-timecode-scrolling-text-credits/


ffmpeg -i inputClip.mp4 -vf "drawtext=text='timestamp: %{pts \: hms}': x=500: y=500: fontsize=32:fontcolor=yellow@0.9: box=1: boxcolor=black@0.6" -c:a copy output.mp4