---
date: 2022-07-29
title: "Enrich your Photos with Historic Weather Data"
description: "In this post I will show you how to find the weather conditions at the time and location  a photo was taken."
categories: developers
tags: [weather, OpenWeather, WeatherStack, WeatherBit, Meteostat]
author_staff_member: dgreenwood
image: /assets/images/blog/2022-07-29/weatherstack-api-response-meta.jpg
featured_image: /assets/images/blog/2022-07-29/weatherstack-api-response-sm.jpg
layout: post
published: true
redirect_from:
  - /blog/2022/historic-weather-data-lookup
---

**In this post I will show you how to find the weather conditions at the time and location  a photo was taken.**

One of the things I wanted to do with Explorer was allow for filtering of images using the weather metrics.

For example, searching for sequence containing images with a wide visibility. Or searching for images in snowy conditions.

In order to do this I needed a source of historic reference data to cross-reference against photos.

There are a tons of services that provide access to such historical data to varying levels.

Here are just a few I considered:

* [OpenWeather History API](https://openweathermap.org/history): ourly historical weather data for any location on the globe via History API.
	* Price: Currently £7 GBP per location
* [WeatherStack Historical Weather API](https://weatherstack.com/documentation): look up historical weather data all the way back to 2008
	* Price: [Currently standard plan $9.99 USD per month](https://weatherstack.com/product)
* [WeatherBit Historical Weather API](https://www.weatherbit.io/api/weather-history-hourly): historical weather data from our network of over 120,000 stations reporting hourly weather data. 
	* Price: [Currently pro plan £150 GPB per month](https://www.weatherbit.io/pricing)
* [Meteostat Hourly Data API](https://dev.meteostat.net/api/point/hourly.html#endpoint): historical hourly observations for any geographic location.
	* Price: Free ([but you should donate, if you can](https://dev.meteostat.net/donate))

I narrowed my choices to WeatherStack and Meteostat, simply due to price.

To test them, I used a photo taken in a fairly remote location (Helvellyn, Lake District, UK) because I wanted to test how measurements were reported when far from a weather station.

<img class="img-fluid" src="/assets/images/blog/2022-07-29/GSAL1592-sm.JPG" alt="GSAL1592 Helvellyn" title="GSAL1592 Helvellyn" />

Here is the metadata in the photo needed to make the requests to the APIs.

```shell
exiftool -GPSLatitude -GPSLongitude -GPSDateTime -n GSAL1592.JPG 
```

[Exiftool by default prints data as Degrees, Minutes, and Seconds (DMS)](/blog/reading-decimal-gps-coordinates-like-a-computer/). Using the `-n` flag turns DMS into Decimal Degrees (DD), required for both the APIs.

```
GPS Latitude                    : 54.5255907
GPS Longitude                   : -3.003587
GPS Date/Time                   : 2022:07:13 12:13:07Z
```

### WeatherStack Historical Weather API

My request to OpenWeather Historic Air Pollution API takes the following structure:

```shell
https://api.weatherstack.com/historical?access_key={apikey}&query={lat},{lon}&historical_date={date}&hourly=1&units=m&interval=1
```

For the test photo that gives;

```shell
https://api.weatherstack.com/historical?access_key=REDACTED&query=54.5255907,-3.003587&historical_date=2022-07-13&hourly=1&units=m&interval=1
```

The response contains a few sections that are well suited to be used with Explorer.

1. The location of the weather station

```json
  "location": {
    "name": "Glenridding",
    "country": "United Kingdom",
    "region": "Cumbria",
    "lat": "54.549",
    "lon": "-2.952",
    "timezone_id": "Europe/London",
    "localtime": "2022-08-07 17:49",
    "localtime_epoch": 1659894540,
    "utc_offset": "1.0"
  },
```

2. The historical data for the day

```json
  "historical": {
    "2022-07-13": {
      "date": "2022-07-13",
      "date_epoch": 1657670400,
      "astro": {
        "sunrise": "04:53 AM",
        "sunset": "09:42 PM",
        "moonrise": "10:21 PM",
        "moonset": "03:36 AM",
        "moon_phase": "Waxing Gibbous",
        "moon_illumination": 97
      },
      "mintemp": 8,
      "maxtemp": 15,
      "avgtemp": 13,
      "totalsnow": 0,
      "sunhour": 15.8,
      "uv_index": 3,
```

3. The hourly data

Note, the hourly data section contains blobs of data representing hours during the date specified (`&historical_date=2022-07-13&hourly=1&interval=1`). The time property (e.g. `"time": "1200",` below), defines the time of the blob, in this case 12h00m (twelve o'clock in the afternoon). In total there are 24 hourly blobs for each day (`0`, `100`, `200` ... `2300`);

```json
      "hourly": [
        {
          "time": "1200",
          "temperature": 15,
          "wind_speed": 25,
          "wind_degree": 258,
          "wind_dir": "WSW",
          "weather_code": 116,
          "weather_icons": [
            "https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0002_sunny_intervals.png"
          ],
          "weather_descriptions": [
            "Partly cloudy"
          ],
          "precip": 0,
          "humidity": 71,
          "visibility": 10,
          "pressure": 1024,
          "cloudcover": 37,
          "heatindex": 15,
          "dewpoint": 9,
          "windchill": 13,
          "windgust": 28,
          "feelslike": 13,
          "chanceofrain": 0,
          "chanceofremdry": 0,
          "chanceofwindy": 0,
          "chanceofovercast": 0,
          "chanceofsunshine": 0,
          "chanceoffrost": 0,
          "chanceofhightemp": 0,
          "chanceoffog": 0,
          "chanceofsnow": 0,
          "chanceofthunder": 0,
          "uv_index": 4
        },
```

All the fields are described in the [Weather Stack documentation here](https://weatherstack.com/documentation).

For Explorer, I cannot think of another weather measurement I would choose to add -- the data is very comprehensive!

### meteostat API

The request to get historic data from the meteostat API takes two parts. Firstly you must find the nearest weather station using the Nearby Station endpoint by passing the `lat` and `lon` of the photo;

```shell
curl --request GET \
	--url 'https://meteostat.p.rapidapi.com/stations/nearby?lat=54.5255907&lon=-3.003587&limit=5' \
	--header 'x-rapidapi-host: meteostat.p.rapidapi.com' \
	--header 'x-rapidapi-key: REDACTED'
```

Which returns a series of weather stations like so sorted by `distance` nearest first, 

```json
    "data": [
        {
            "id": "03779",
            "name": {
                "en": "Carlisle"
            },
            "distance": 45397
        },
        {
            "id": "3222",
            "name": {
                "en": "Carlisle"
            },
            "distance": 45465.6
        },
```

The distance value is reported in meters. In this case, the closest station `id` is 03779 (45397 meters / 45.397 kms from the photo).

Using this, I can then request the historic data

```shell
curl --request GET \
	--url 'https://meteostat.p.rapidapi.com/stations/hourly?station=03779&start=2022-08-07&end=2022-08-07' \
	--header 'x-rapidapi-host: meteostat.p.rapidapi.com' \
	--header 'x-rapidapi-key: REDACTED'
````

Which returns 24 objects for each hour of that day;

```json
    {
      "time": "2022-08-07 13:00:00",
      "temp": 24.9,
      "dwpt": 7.1,
      "rhum": 32,
      "prcp": null,
      "snow": null,
      "wdir": 307,
      "wspd": 11.1,
      "wpgt": 22.2,
      "pres": 1025.5,
      "tsun": null,
      "coco": 2
    },
```

All the fields are described in the [meteostat documentation here](https://dev.meteostat.net/api/stations/hourly.html#response).

Compared to Weather Stack it is more limited, that said, the key metrics I wanted to see; temperature, wind speed, and precipitation are all there.

## My verdict

I chose the WeatherStack API for Explorer.

This was for two reasons. Firstly, I am lazy. Being able to make a single request for the data is much more preferable.

Secondly, the WeatherStack API has lots more data. OK, it might be overkill for now, but its likely 

At $9.99 / month with generous request limits (50,000 Calls / mo), I think it is good value.

## Explorer logic for weather lookup

WeatherStack's standard plan allows for 50,000 request per month.

Keep in mind, Explorer Sequences can often contain 1000 or more photos. If Explorer was to lookup air quality against each image, the calls could quickly add up.

I thought looking up weather for each photo was overkill. Given sequences are usually no more than twenty minutes long and photos in them usually no more than 5 seconds apart I decided to assign weather at sequence level.

Explorer does this by taking the metadata from the first image in the sequence and making a request to the WeatherStack API. As noted earlier, the WeatherStack API returns a list of hourly measurements for the day specified. Explorer selects the hourly `time` value closest to that of the photo time.

It is not perfect, but having a margin of error +/- 1 hour was deemed acceptable for how weather is used in Explorer.