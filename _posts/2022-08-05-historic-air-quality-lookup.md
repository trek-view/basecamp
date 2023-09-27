---
date: 2022-08-05
title: "Enrich your Photos with Historic Air Quality Data"
description: "In this post I will show you how to find the air quality at the time and location  a photo was taken."
categories: developers
tags: [Atmotube Pro, air quality, Particulate Matter, Air Quality Score, aqi, PM, openweather, WeatherBit]
author_staff_member: dgreenwood
image: /assets/images/blog/2022-08-05/openweather-aqi-api-meta.jpg
featured_image: /assets/images/blog/2022-08-05/openweather-aqi-api-sm.jpg
layout: post
published: true
redirect_from:
  - /blog/2022/historic-air-quality-lookup
---

**In this post I will show you how to find the air quality at the time and location  a photo was taken.**

Did you read my post in 2020; [Measuring the Air Quality of Your Trek](/blog/measuring-air-quality-portable-part-1), in which I used a Atmotube PRO to measure air quality.

The Atmotube PRO detected PM1, PM2.5, and PM10 pollutants, like dust, pollen, soot, and mold, plus a wide range of Volatile Organic Compounds (VOCs)

Based on the feedback from readers who are far more knowledgeable in the field, it became clear the AtmoTube Pro works best when still and placed indoors. For measuring air quality on the move in an accurate way would be impossible. Even more so, it would also be unrealistic for everyone to purchase an Atmotube PRO in addition to an already expensive 360 camera.

So I went back to the drawing board.

It turns out there are a few data service that offer historical air quality data.

Here are the two most promising options I found during my research;

* [OpenWeather Air Pollution API](https://openweathermap.org/api/air-pollution): Air Pollution API provides current, forecast and historical air pollution data for any coordinates on the globe
	* Price: [Currently covered under the free plan (limits 60 calls/minute and 1,000,000 calls/month)](https://openweathermap.org/price)
* [WeatherBit Historical Air Quality API](https://www.weatherbit.io/api/airquality-history): This Air Quality API returns hourly historical air quality conditions for any location in the world. 
	* Price: [Currently covered in Business Plan starting from £395 GBP /mo](https://www.weatherbit.io/pricing)

I then wanted to put them to a test.

To do this, I used a photo taken in a fairly remote location (Helvellyn, Lake District, UK) because I wanted to test how measurements were reported when far from a weather station.

<img class="img-fluid" src="/assets/images/blog/2022-08-05/GSAL1592-sm.JPG" alt="GSAL1592 Helvellyn" title="GSAL1592 Helvellyn" />

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

### OpenWeather Air Pollution API

The request to OpenWeather Historic Air Pollution API takes the following structure:

```shell
http://api.openweathermap.org/data/2.5/air_pollution/history?lat={lat}&lon={lon}&start={start}&end={end}&appid=ba9eef2e11e65a09842f26b115567593
```

The `{start}` and `{end}` times need to be reported as epoch time. There are lots of epoch convertors online, for example [epochconverter.com](https://www.epochconverter.com/).

The epoch time for this photo is: `1657714387` However, the OpenWeather Historic Air Pollution API reports data hourly and only returns measurements between `{start}` and `{end}` defined in the request.

Therefore, to build the request I snap the time to the nearest hour either side of the photo time (`2022:07:13 12:13:07`)

* start = 2022:07:13 12:00:01Z = 1657713601
* end = 2022:07:13 13:00:00Z = 1657717200

So for this photo the request is as follows;

```shell
http://api.openweathermap.org/data/2.5/air_pollution/history?lat=54.5255907&lon=-3.003587&start=1657713601&end=1657717200&appid=REDACTED
```

Which returns one result (at time 2022:07:13 13:00:00 / `"dt": 1657717200`):

```json
{
  "coord": {
    "lon": -3.0036,
    "lat": 54.5256
  },
  "list": [
    {
      "main": {
        "aqi": 1
      },
      "components": {
        "co": 153.54,
        "no": 0.09,
        "no2": 0.4,
        "o3": 52.21,
        "so2": 0.54,
        "pm2_5": 1.91,
        "pm10": 3.56,
        "nh3": 0.8
      },
      "dt": 1657717200
    }
  ]
}
```

All the fields are described in the [OpenWeather documentation here](https://openweathermap.org/api/air-pollution).

The Air Quality Index (`list.main.aqi`) reported by the OpenWeather API maps to the [Common Air Quality Index (CAQI)](https://en.wikipedia.org/wiki/Air_quality_index#CAQI) values as follows;

* `1` (Good) = 0–25 (Very low)
* `2` (Fair) = 25–50 (Low)
* `3` (Moderate) = 50–75 (Medium)
* `4` (Poor) = 75–100 (High)
* `5` (Very Poor) = >100 (Very high)

Besides the aggregated Air Quality Index, the API returns data about the following polluting gases;

1. Carbon monoxide (CO) (`list.components.co`),
2. Nitrogen monoxide (NO) (`list.components.no`),
3. Nitrogen dioxide (NO2) (`list.components.no2`),
4. Ozone (O3) (`list.components.o3`),
5. Sulphur dioxide (SO2) (`list.components.so2`),
6. Ammonia (NH3) (`list.components.nh3`),
7. Particulates PM2.5 (`list.components.pm2_5`),
8. Particulates PM10 (`list.components.pm10`)

The biggest limitations I identified with this API were;

* Historical data is accessible from 27th November 2020.
* The `coord` value returned is the photo location. There is no information about the weather station that recorded the measurements (which could be very far away).

### WeatherBit Historical Air Quality API

The request to WeatherBit Historical Air Quality API takes the following structure;

```shell
http://api.weatherbit.io/v2.0/history/airquality?lat={lat}&lon={lon}&start_date={start}&end_date={end}&tz=local&key={api_key}
```

The data is reported hourly, and the `{start}` and `{end}` dates must be different. In my example I use; `2022-07-13` and `2022-07-14`. Therefore, the returned data will always cover 24 points for each hour of the day.

For the example photo I would make the request;

```shell
http://api.weatherbit.io/v2.0/history/airquality?lat=54.5255907&lon=-3.003587&start_date=2022-07-13&end_date=2022-07-14&key=REDACTED
```

As noted, this returns hourly measurements for the day (2022-07-13). Below I have modified the response to only include the response for the same time period shown in the OpenWeather API response (`1657717200` = Wednesday, 13 July 2022 13:00:00Z);

```json
{
  "lat":54.5255907,
    "data":[
      {
        "aqi": 26,
        "pm10": 3.28,
        "pm25": 1.57,
        "o3": 56.78,
        "timestamp_local": "2022-07-13T14:00:00",
        "so2": 0.45,
        "no2": 0.33,
        "timestamp_utc": "2022-07-13T13:00:00",
        "datetime": "2022-07-13:13",
        "co": 155.11,
        "ts": 1657717200
      }
    ],
  "timezone":"Europe\/London",
  "country_code":"GB",
  "lon":-3.003587,
  "city_name":"Ambleside",
  "state_code":"ENG"
}
```

All the fields are described in the [Weatherbit documentation here](https://www.weatherbit.io/api/airquality-history).

The response includes the Air Quality Index (`data.aqi`) using the CAQI values (so the data does not need to be normalised like in the case of the OpenWeather API).

Besides the aggregated Air Quality Index, the API returns data about the following polluting gases;

2. o3 (`data.o3`)
3. so2 (`data.so2`)
4. no2 (`data.no2`)
5. co (`data.co`)
6. pm25 (`data.pm25`)
7. pm10 (`data.pm10`) 

The biggest limitations I identified with this API were;

* Data is only available going back to January 13th, 2022 at this time. Much less than the OpenWeather API.
* The response does not include Ammonia (NH3) and Nitrogen monoxide (NO) reported by OpenWeather API (although for most cases, I am not sure how valuable these reading will be).
* The `lat` and `lon` values returned is the photo location. There is no information about the weather station that recorded the measurements (which could be very far away).