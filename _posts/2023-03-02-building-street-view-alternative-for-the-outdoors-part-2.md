---
date: 2023-03-02
title: "Building a Street View Alternative for Exploration... with no money (part 2)"
description: "In this post I will walk you through my early design decisions and the workflow of the proposed app."
categories: developers
tags: [YouTube, Meta, Mapillary, Facebook, GoPro, OpenSFM]
author_staff_member: dgreenwood
image: /assets/images/blog/2023-03-02/mapillary-image-open.png
featured_image: /assets/images/blog/2023-03-02/mapillary-image-open.png
layout: post
published: true
redirect_from:
  - 
---

**In this post I will walk you through my early design decisions and the workflow of the proposed app.**

Following on from my last post (which steered me away from some aspects of the app), my web app will do the following

1. allow people to sign up / sign in / log out
  * I'll use an 3rd party to handle this (probably Auth0 as I'm familiar with this)
2. allow authenticated users to import 1 or more of their panoramic (360) sequences from Mapillary.
  * app will import all sequence and image metadata into the database
3. allow authenticated users to publish imported sequences to the map. A user can assign a sequence;
  * name (optional, else sequence ID will be used)
  * description (optional, else blank)
  * transport type (required, dictionary of transport methods)
  * tags (optional list of alphanumeric tags)
4. allow authenticated user to modify published sequences by
  * modify values for published sequences
  * delete imported sequences
5. allow unauthenticated/authenticated users to browse sequences using
  * capture date (to and from)
  * northern hemisphere season (winter, spring, summer, autumn)
  * username (Trek View username)
  * altitude meters (min / max)
  * elevation change meters (min / max)
  * length meter (min / max)
  * name/description (wildcard search)
  * transport type (multi-select)
  * tags (multiselect)
  * camera make+model (multiselect)
6. allow authenticated users to mark image as favourite (true/false)
7. allow authenticated users to mark sequence as favourite (true/false)

For this post I'll ignore some of the more trivial aspects of the app, like authentication.

The main aim of this post is to describe the import flow and what data the Trek View database will hold.

### Authentication to Mapillary

We don't need a user to authenticate to Mapillary, as all sequence/images are visible to all once published. Thus if I wanted, we could simply use a single OAuth token to grab sequences from Mapillary.

However, I do want to limit users from importing images for Mapillary accounts they own.

As such we will ask all users to authenticate to Mapillary on sign up to Trek View to generate an OAuth token specific to their account (with read only privileges to their Mapillary account);

https://www.mapillary.com/developer/api-documentation#authentication

In this flow, we will capture the Mapillary username of the authenticated user.

There will be a one-to-one relationship between Mapillary user and Trek View user as we will store the OAuth token generated against each Trek View account. Note, the Mapillary username must be unique (that is, two Trek View users cannot share the same Mapillary linked account).

The OAuth token will be automatically refreshed, unless user revokes access to Trek View to read data from their account (done via the Mapillary web UI).

### Retrieval of user sequence metadata

First it's important to define how sequences will be imported.

Before I set out on designing any UI elements I wanted to see what was possible via the Mapillary API.

I was hopeful when I saw the [Mapillary Sequence ID endpoint](https://www.mapillary.com/developer/api-documentation#sequence), however, the requires you to pass explicit `sequence_id`s with no options to search.

The only real way to retrieve sequences IDs for a user is via the [Image search endpoints](https://www.mapillary.com/developer/api-documentation#image).

Which raises another issue, there is no way to paginate through any of the Mapillary endpoints. The maximum results that can be returned (using the `limit` parameter) is 2000. 2000 image might return just 5 unique sequences (the most recently uploaded by the user). To put this into context, the trekviewhq Mapillary account has over 10 million images!

Immediately I wondered if exposing a way for a user to filter Mapillary images in the Trek View UI by;

* date/time range (using `start_captured_at` and `end_captured_at` parameters on the Image Search endpoint)
* bounding box by allowing user to draw it on a map (using `bbox` parameter on the Image Search endpoint)

However, it's feasible that even by first applying filters in the Trek View UI to limit the number of sequences returned from Mapillary could be problematic. Why? Even by applying a time range of a few hours could return more than 2000 images in the payload.

So I thought about how to do this using the trekviewhq data, which 

We often shoot video with frames that are extracted at 2 frames per second = 120 frames min = 7200 frames per hour (or 1800 frames per 15 mins)

Assuming users don't upload sequences with more than 2 frames per second, we could paginate through the Mapillary API using the `creator_username` parameter as well as the `start_captured_at` and `end_captured_at` at 15 minute increments for a certain time period.

At this point I also made the decision that Trek View would only contain 360 images, hence the use of `is_pano=true` parameter too.

e.g.

```shell
GET "https://graph.mapillary.com/images?creator_username=trekviewhq&start_captured_at=2020-01-01T00:00:00.000Z&end_captured_at=2020-01-01T00:15:00.000&is_pano=true&fields=sequence"
```

The certain time period could be defined by the user in the Trek View UI up to a maximum allowable range (e.g. 1 year, that's 8760 hours or 35040 fifteen minute increments).

[Requests to graph.mapillary.com are limited to 50,000 per minute per app](https://www.mapillary.com/developer/api-documentation#rate-limits). So spreading these requests for a year of data over a minute would still be well within limits. Of course, request to the Mapillary API would have to be queued (as many users might be importing sequences from Mapillary in parallel).

The app could then grab all unique entries returned via the image search endpoint for the `data.sequence` property.

Originally my plan was to pass the unique IDs one-by-one to the [Sequence ID endpoint](https://www.mapillary.com/developer/api-documentation#sequence) to get a list of image IDs that belong to the sequence...

```shell
GET "https://graph.mapillary.com/image_ids?sequence_id=vgeD6wUXBZWp1f5rVPE3zi"
```

```shell
{
    "data": [
        {
            "id": "6340819595977317"
        },
        {
            "id": "609628197766091"
        },
        {
            "id": "654815293145144"
        }
    ]
{
```

But that's super inefficient... as I remember we were already given this information in the previous request to the Image Search endpoint where all the image IDs were already posted.

This was all starting to prove frustrating, so I decided to simplify it both for the user and myself as follows;

When a user links their Mapillary account to Trek View at sign up, we simply iterate through all their images in 15 minute intervals, as describe above, from the year 2018 to now. 2018 is an arbitrary date, but one that seemed fairly sensible in terms of when 360 became mainstream.

For each user account, we check every 24 hours for new sequences (24 * 4 = 96 requests, per user, per day) and add them.

All sequences from Mapillary for a user will enter a draft sequence state, requiring a user to publish one or more of them (more on that later).

Now I needed to decide what data returned by the Image search endpoint needed to be stored in Trek View and also how it should be stored.

### Database design

We have a concept of images that are linked in a graph under the umbrella of a sequence.

e.g. Image 1 is joined to image 2 is joined to image 3.

Part 1 uncovered how to get this data from Mapillary, here's a reminder of the API request used;

```shell
GET 'https://graph.mapillary.com/images?creator_username=trekviewhq&is_pano=true&make=GoPro&model=GoPro%20Max&start_captured_at=2021-08-28T10:20:36.000Z&end_captured_at=2021-08-28T10:06:42.000Z&fields=id,altitude,atomic_scale,camera_parameters,camera_type,captured_at,compass_angle,computed_altitude,computed_compass_angle,computed_geometry,computed_rotation,creator,exif_orientation,geometry,is_pano,make,model,height,width,sequence,thumb_original_url,thumb_256_url,thumb_1024_url,thumb_2048_url'
```

As noted earlier in this post a Sequence has the following values properties by the user;

* `name` (optional, else sequence ID will be used)
* `description` (optional, else blank)
* `transport_type` (required, dictionary of transport methods)
* `tags` (optional list of alphanumeric tags)

And some that are auto assigned;

* `uuid`: Trek View Sequence ID
* `sequence.is_published`: boolean, if user has published
* `user.uuid`: Trek View user ID of Sequence owner
* `mapillary.id`
  * data.sequence: string, ID of the sequence, which is a group of images captured in succession.
* `mapillary.make`
  * data.make: string, the manufacturer name of the camera device.
* `mapillary.model`
  * data.model: string, the model or product series name of the camera device.
* `mapillary.height`
  * data.height: int, height of the original image uploaded.
* `mapillary.width`
  * data.height: int, width of the original image uploaded.
* `mapillary.is_pano` (should always be true)
  * data.is_pano: boolean, a true or false indicator for whether an image is 360 degree panorama.
* `calculated.distance_meters`: (sum of distance between all ordered points in sequence, e.g. image 1 -> 2 -> 3)
* `calculated.max_altitude_meters`: (image with highest mapillary_altitude)
* `calculated.min_altitude_meters`: (image with lowest mapillary_altitude)
* `calculated.elevation_change_meters`: (= calculated_max_altitude_meters - calculated_min_altitude_meters)
* `calculated.average_speed_meters_second`: (speed = distance/time)
* `calculated.sequence_bounding_box`: (discussed in part 1)
* `calculated.nortern_hemisphere_season`: (spring, summer, autumn, winter)
* `image.first_datetime`: timestamp of first image in sequence
* `image.first_coordinates`: co-ordinated of first image
* `image.last_datetime`: timestamp of last image in sequence
* `image.last_coordinates`: co-ordinated of last image
* `weather.temperature_celsius`
* `weather.wind_speed_kmh`
* `weather.wind_direction_degrees`
* `weather.weather_descriptions`
* `weather.precipitation_mm`
* `weather.humidity_pc`
* `weather.visibility_km`
* `weather.pressure_millibar`
* `weather.cloudcover_pc`
* `weather.heatindex_celsius`
* `weather.dewpoint_celsius`
* `weather.windchill_celsius`
* `weather.windgust_kmh`
* `weather.feelslike_celsius`
* `weather.uv_index_celsius`
* `air_quality.aqi`
* `air_quality.co`
* `air_quality.no`
* `air_quality.no2`
* `air_quality.o3`
* `air_quality.so2`
* `air_quality.pm2_5`
* `air_quality.pm10`
* `air_quality.nh3`
* `favourited_user_ids`: (a list of user IDs who have marked the sequence as a favourite)

Note, the assumption here is that the photo values (make, model, height and width) are the same for all images in the sequence, which is true in the way we import images as sequences.

All `weather.` data is pulled from hourly weather information using `image.first_datetime` and `image.first_coordinates` of the first photo in sequence. Data is pulled from WeatherStack ([as described here](/blog/historic-weather-data-lookup)).

All `air_quality.` data is pulled from the OpenWeather Air Pollution API using `image.first_datetime` and `image.first_coordinates` of the first photo in sequence. Also described in ([this post](/blog/historic-weather-data-lookup)).

For each sequence one or more image. For each image we hold the following data that is all auto-assigned

* `uuid`: Trek View Image ID
* `user.uuid`: Trek View user ID of Imgae owner
* `sequence.uuid`: The sequence ID the image belongs too
* `mapillary.id`
  * data.id: string, ID of the image
* `mapillary.altitude`
  * data.altitude: float, original altitude from camera Exif calculated from sea level.
* `mapillary.captured_at`
  * data.captured_at: timestamp, capture time.
* `mapillary.compass_angle`
  * data.compass_angle: float, original compass angle of the image.
* `mapillary.geometry_coordinates`
  * data.geometry.coordinates: GeoJSON Point geometry.
* `mapillary.computed_altitude`
  * data.computed_altitude: float, altitude after running image processing, from sea level.
* `mapillary.computed_compass_angle`
  * data.computed_compass_angle: float, compass angle after running image processing.
* `mapillary.computed_coordinates`
  * data.computed_geometry.coordinates: GeoJSON Point, location after running image processing.
* `mapillary.computed_rotation`
  * data.computed_rotation: enum, corrected orientation of the image.
* `mapillary.thumb_original_url` (seems to be full size image, not thumbnail -- the name is confusing)
  * data.thumb_original_url: string, URL to the original wide thumbnail.
* `mapillary.thumb_256_url`
  * data.thumb_256_url: string, URL to the 256px wide thumbnail.
* `mapillary.thumb_1024_url`
  * data.thumb_1024_url: string, URL to the 1024px wide thumbnail.
* `mapillary.thumb_2048_url`
  * data.thumb_2048_url: string, URL to the 2048px wide thumbnail.
* `favourited_user_ids` (a list of user IDs who have marked the image viewpoint)

It would _probably_ more efficient to retrieve this type of data in a graph database/ However, I have no experience building these to be spatially aware.

As such, Postgres + PostGIS seems to be the safest choice for an MVP. I do have some initial concerns about performance exposing this in an interactive map view (e.g. how to render the world map with all sequences/images in the DB) but these concerns can be accounted for in the design of the UX.

Also, as you'll see in the next section (_Rendering images on map and the panoramic Viewer_), we don't need to worry about queries to find the next image in a sequence,

Finally, we have the concept of users. Excluding authentication details, which will be managed by a third party (probably Auth0), I wanted to include statistics about the user.

Both Mapillary and Google Street View do this...

<img class="img-fluid" src="/assets/images/blog/2023-03-02/Mapillary-stats.png" alt="Mapillary User Statistics" title="Mapillary User Statistics" />

<img class="img-fluid" src="/assets/images/blog/2023-03-02/Street-View-Studio-stats.png" alt="Street View User Statistics" title="Street View User Statistics" />

I'd like to include 

* A count of sequences
* Total length of sequences (km)
* Number of sequence marked as favourite
* A count of images
* Number of images marked as favourite

As it stands, I don't know if it's better to create a summary of this data on an automated basis, or query it each time from the database.


### Rendering images on map and the panoramic Viewer

I'm going to confess right now, my designs are heavily inspired by Mapillary. I really believe they nailed the experience of navigating street-level imagery.

<img class="img-fluid" src="/assets/images/blog/2023-03-02/mapillary-map-open.png" alt="Mapillary UI Map Open" title="Mapillary UI Map Open" />

<img class="img-fluid" src="/assets/images/blog/2023-03-02/mapillary-image-open.png" alt="Mapillary UI Image Open" title="Mapillary UI Image Open" />

What I am most inspired by:

* the ability to toggle between the map and image view, with a mini-viewer in the bottom left (which can also be minimised)
* the colour distinction between sequence your viewing on the map, making the separation between sequences easily visible
* the point showing the image you're currently viewing and an interactive heading marker showing the direction your panning in the current image

[Most of the heavy lifting for the map layer can be done through Mapbox](https://www.mapbox.com/maps).

One of the biggest problems I foresee in this approach is rendering sequences/images at a macro->micro level.

For example, when you visit the entry point of the Mapillary app it shows a worldwide map with green dots showing sequences, as you zoom in, the lines are broken out into image.

<video controls width="600" height="400" muted>
  <source src="/assets/images/blog/2023-03-02/mapillary-zoom.webm" type="video/webm" />
</video>

As you move between the Zoom levels you can see:

1. grouped sequences (00:00:00 - 00:00:06)
2. full sequences (00:00:06 - 00:00:15)
3. full sequences with image points (00:00:15 - 00:00:18)

At the lower zoom levels showing full sequences with image points, it's fairly easy. Ultimately at these Zoom levels the number of images / sequence returned by the API is fairly small.

But assuming there are 10,000's of sequences (for context, I have more than 10k of content for sequences) how do render all of these at the highest zoom level (this could be potentially millions of API queries)?.

I believe Mapillary use some sort of cached sequence table for higher zoom levels, perhaps showing the first point in a sequence on a map at these zoom level retrieved from a single table.

Ulitmlatley this will require some trial and error to provide a seamless user experience when browsing the map.

For the panorama viewer, the Mapillary web app uses [MapillaryJS](https://mapillary.github.io/mapillary-js/) which they've open-sourced under an MIT license. As such, it makes it a no-brainier for me to use for the viewer.

The even better news is it works natively with Mapillary images which brings us navigation between images for free (I don't need to store information about the connected photos locally).

[Try pasting the code below into the live editor](https://mapillary.github.io/mapillary-js/docs/main/init)...

```js
function render(props) {
  let viewer;
  let coverViewer;
  function dispose() {
    if (viewer) {
      viewer.remove();
    }
  }
  function disposeCover() {
    if (coverViewer) {
      coverViewer.remove();
    }
  }

  const style = {height: '1200px', width: '50%', display: 'inline-block'};
  const imageId = '1447075489494186';

  function init(opts) {
    const {accessToken, container} = opts;
    const options = {accessToken, container};
    viewer = new Viewer(options);
    viewer.moveTo(imageId).catch(mapillaryErrorHandler);
  }

  function initCover(opts) {
    const {accessToken, container} = opts;
    const options = {
      accessToken,
      component: {cover: true},
      container,
      imageId,
    };
    coverViewer = new Viewer(options);
  }

  return (
    <div>
      <ViewerComponent init={init} dispose={dispose} style={style} />
    </div>
  );
}
```

You'll see the ID provides the directional arrows on the ground as well as playbook options at the top.

By watching the requests to Mapillary, you can see the current photo ID as the user moves between images (allowing the current highlighted map to stay updated).

One downside of this approach is that that viewer will show arrows to nearby sequences from other users, potentially not imported to Trek View but present on Mapillary.

In my view that's totally acceptable given the time saved with this approach. The user can see they've left the active sequence (or imported sequence) as the map view will not show an underlying connected sequence (nor will a user be able to mark the image/sequence in Trek View as a favourite because it won't exist).

## In summary...

I've ignore many of the generic elements of the web app, including authentication (probably Auth0), app framework (probably Django), etc.

Though that wasn't the aim of these posts. I wanted to see if I could build a Street View or Mapillary alternative focused on exploration for no money.

No money was a little ambitious, although a small VPS would probably be more than adequate for the implementation described above, but actually building this thing seems totally possible.

Here are some early mockups...

<iframe width="768" height="432" src="https://miro.com/app/live-embed/uXjVNu3rhjM=/?moveToViewport=-8653,-637,15233,7305&embedId=786181742316" frameborder="0" scrolling="no" allow="fullscreen; clipboard-read; clipboard-write" allowfullscreen></iframe>

More soon!