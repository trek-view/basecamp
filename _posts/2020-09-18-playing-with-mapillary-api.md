---
date: 2020-09-18
title: "Playing with the Mapillary API"
description: "A quick look at some of the API queries we've used against the Mapillary API."
categories: developers
tags: [Mapillary, object detection]
author_staff_member: dgreenwood
image: /assets/images/blog/2020-09-18/mapillary-object-detections-meta.jpg
featured_image: /assets/images/blog/2020-09-18/mapillary-api-object-detections.jpg
layout: post
published: true
redirect_from:
  - /blog/2020/playing-with-mapillary-api
---

**A quick look at some of the API queries we've used against the Mapillary API.**

[Mapillary's Chris Beddow wrote a brilliant blog post about getting started with the Mapillary API](https://blog.mapillary.com/update/2020/08/28/map-data-mapillary-api.html).

I wanted to add some of our favourite API requests for uncovering interesting data.

[We recently ran a mapping party in the New Forest, UK](/blog/pano-party-new-forest-uk-may-23-2020).

The photos are great to explore interactively to get a feel for the visual beauty of the area.

A location can be requested via the Mapillary API using a bounding box (`bbox`).

There are lots of tools to calculate coordinates for a bounding box programmatically.

A useful web tool for doing this is [boundingbox.klokantech.com](https://boundingbox.klokantech.com/).

<img class="img-fluid" src="/assets/images/blog/2020-09-18/bounding-box-draw-web.jpg" alt="Draw a bounding box" title="Draw a bounding box" />

A bounding box is a rectangular box that can be determined by the x and y axis coordinates in the upper-left corner and the x and y  axis coordinates in the lower-right corner of the rectangle.

In mapping terms we can use latitude and longitude for position. 

```
bounding_box=[min_longitude,min_latitude,max_longitude,max_latitude.]
```

My bounding box for the New Forest is: 

```
bounding_box=-1.774513671,50.7038878539,-1.2966083975,50.9385637585
```

You'll notice I drew a polygon on the map, that was converted to a rectangle. This is because bounding boxes are always rectangular. Bounding polygons do exists, but the Mapillary API search endpoints not accept them.

Important note: I would not typically use a bounding box this large against the Mapillary API, especially when a large volume of images are likely (e.g. in cities) because such a query will be slow and prone to errors.

I'd recommend:

1. resize your bounding box (and make smaller systematic requests across an area) or,
2. in the case of our mapping party where we know some variables, you can use other parameters instead of bbox to filter images, like `image_keys`, `organization_keys`, `userkeys`, `usernames`, `start_time` or `end_time` where these values are known, then filtering images locally on your machine after getting a response.

Now we know where we want to analyse, we can run some queries against the Mapillary API.

[I will assume you've already read Chris' post which will show you the basics of forming a request to the Mapillary API](https://blog.mapillary.com/update/2020/08/28/map-data-mapillary-api.html).

One thing to note, you'll see I use the `per_page=500` in my requests. This is saying, only show 500 records in the response and then paginate. In many cases, more than 500 total records will be returned. In which case you can increase to the maximum records allowed `per_page=1000` (it will be slower, and potentially still to small) or use some logic to iterate through each page.

## Object detections vs. features

First it's important to distinguish between object detections and features in Mapillary.

<img class="img-fluid" src="/assets/images/blog/2020-09-18/mapillary-object-detection.png" alt="Mapillary Object Detections" title="Mapillary Object Detections" />

[Object detections](https://help.mapillary.com/hc/en-us/articles/115000967191-Object-detections) are areas (x,y,x,y,x,y... co-ordinates) of an image that have been detected as a certain object. For example, you can see each pixel in the above image corresponds to an object detection, like a car or road surface.

Whereas features can be thought of as single points on a map. For example, a car has been detected (by Mapillary object detections) in an image and has been assigned a real world latitude and longitude value.

<img class="img-fluid" src="/assets/images/blog/2020-09-18/mapillary-features.png" alt="Mapillary Features" title="Mapillary Features" />

[Mapillary features](https://help.mapillary.com/hc/en-us/articles/115002332165) use multiple photos to determine an objects position using triangulation.

For example, 3 images contain a photo of a car. Using the position of each of those photos (latitude and longitude reported in metadata), Mapillary can estimate the actual position of the car and then assign it to that feature. As such, features will usually have different co-ordinates from the images used to detect it.

In the last image above, I've tried to demonstrate an object (traffic light) being identified in 6 images from which a features position has been determined.

### Wildlife (object detections)

Let's start with the [`object_detections`](https://www.mapillary.com/developer/api-documentation/#object-detections) endpoint so we can identify photos that contain wildlife of some sort.

Wild ponies can be found all over the New Forest and are a draw for visitors. Being so close to the coast, it's also a great place for bird watching. Let's take an _automated_ look, for them (`animal--bird&animal--ground-animal`):

```
curl "https://a.mapillary.com/v3/object_detections/segmentations?client_id=<YOUR_CLIENT_ID>" \
  &values=animal--bird,animal--ground-animal \
  &bbox=1.774513671,50.7038878539,-1.2966083975,50.9385637585 \
  &per_page=500
```

I'll get a response containing all the images (Mapillary image keys) with the wildlife defined in my query (`animal--bird`, `animal--ground-animal`) I can then take a look at.

If I wanted to filter only images belonging to participants of our mapping party I could also use the parameter `usernames=`. Or should they all belong to the Mapillary Trek View organisation (they do), I could use the parameter `organization_keys=`.


### Seasonal vegetation (object detections)

It's a truly beautiful place in the late-summer to visit, with the leaves still in full bloom.

One of the things we want to do is run another mapping party in the winter to show the visual seasonal differences.

This will also make it possible to provide a rough estimate of canopy cover in summer compared to winter (using the sum area of vegetation reported by the Object Detection endpoints for a position -- keep reading for more info).

Problem is, it's not possible to pass date parameters to the `object_detections` endpoint. Therefore to compare summer and winter, we need to run two queries.

First we need to find all images in the bounding box that were `captured_at` in the summer months. [For this we can use the `images` endpoint](https://www.mapillary.com/developer/api-documentation/#images):

```

curl "https://a.mapillary.com/v3/images?client_id=<YOUR_CLIENT_ID>"
 \
  &start_time=2020-04-01 \
  &end_time=2020-09-30 \
  &bbox=1.774513671,50.7038878539,-1.2966083975,50.9385637585 \
  &per_page=500
```

Here I'm defining summer as the 6 months between the start of April (`2020-04-01`) and the last day of September (`2020-09-30`).

And here's what the response might look like:

```
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "ca": 0,
        "camera_make": "",
        "camera_model": "",
        "captured_at": "1970-01-01T00:00:03.000Z",
        "key": "QKCxMqlOmNrHUoRTSrKBlg",
        "pano": true,
        "sequence_key": "KrZrFFEzBszRJTaBvK3aqw",
        "user_key": "T8XscpSs_3_W673i7WFQug",
        "username": "underhill",
        "organization_key": "GWPwbGxhu82M5HiAeeuduH",
        "private": false
      },
      "geometry": {
        "type": "Point",
        "coordinates": [
          -135.6759679,
          63.8655195
        ]
      }
    }
}
```

This will return a lot of images each with a `features.properties.key` value. This is the unique Mapillary image key of photos taken that match the specified criteria.

We can now use these images keys against the `object_detections` endpoint.

```
https://a.mapillary.com/v3/object_detections/instances?client_id=YOUR CLIENT ID \
  &image_keys=KEY_1,KEY_2,...
  &values=nature--vegetation
  &per_page=500
```

A snippet of a response:

```
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "area": 0.0010786056518554688,
        "captured_at": "2020-02-03T10:22:50.000Z",
        "image_ca": 280.39,
        "image_key": "---wuOuOEBSdTC1FT_cOwA",
        "image_pano": false,
        "key": "kex97g0i6zc8t48rdd0lbu",
        "score": 0.6509804129600525,
        "shape": {
          "type": "Polygon",
          "coordinates": [
            [
              [
                0.7685546875,
                0.6494140625
              ],
              [
                0.7939453125,
                0.6494140625
              ],
              [
                0.7939453125,
                0.69189453125
              ],
              [
                0.7685546875,
                0.69189453125
              ],
              [
                0.7685546875,
                0.6494140625
              ]
            ]
          ]
        },
        "value": "nature--vegetation"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [
          13.010694722222222,
          55.59290138888889
        ]
      }
    },
    ...
  ]
}
```

The `features.shape.coordinates` shows a polygon of the outline of the `nature--vegetation` object.

By calculating the area of all polygons with this object we can get an idea of how much foliage blooms on deciduous vegetation in these areas over the summer months (and subsequently how much is shed during winter).

IMPORTANT: as noted the `object_detections` endpoint returns detections in each photo (not by individual object). In almost all cases a tree will be covered in more than one photo. Therefore the sum of areas for every image will include the same object counted potentially many times.

Our plan is to capture images of the same paths, however, this still makes a like-for-like comparison almost impossible -- unless you can capture images in the winter in exactly the same place.

My _crude_ fix, take the count of photos returned in summer and winter and weight by number of images in the sample. For example, if 1000 photos are captured in summer and 500 in winter I will times the sum of area for summer by 0.5 (to account for the 50% reduction in image count in winter). Unless you can suggest an improved methodology (please!)?

### Benches (map features)

Let's now take a look at the map [`features_endpoint`](https://www.mapillary.com/developer/api-documentation/#map-features) that returns locations of objects as point features on the map. As noted before, this is the actual real-world position of the object (based on photo co-ordinates).

As walking takes up a lot of energy, let's search for the exact position of a bench (`object--bench`) to sit on...

```
curl "https://a.mapillary.com/v3/map_features?client_id=<YOUR_CLIENT_ID>" \
	&layers=point
	&values=object--bench \
  &bbox=1.774513671,50.7038878539,-1.2966083975,50.9385637585 \
	&per_page=500
```

Here's what the response might look like:

```
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "accuracy": 4.3415914,
        "altitude": 2.1636841,
        "detections": [
          {
            "detection_key": "o8kc5kth6o7m4f5eosebin7od5",
            "image_key": "tsWJOYler98YAmg97kUzLQ",
            "user_key": "KXcBzSdwPIGrXgEP8qdcEQ"
          },
          {
            "detection_key": "gq9da6nqktj5rklq5vrc4q8sul",
            "image_key": "39JmaDL9LxsaijLV7n2Ccg",
            "user_key": "KXcBzSdwPIGrXgEP8qdcEQ"
          }
        ],
        "direction": 335.4141,
        "first_seen_at": "2020-07-25T20:01:43.850Z",
        "key": "8yfe7htuqtcd2vrjsxucidqkpl",
        "last_seen_at": "2020-08-08T10:49:33.648Z",
        "layer": "lines",
        "value": "object--bench"
      },
      "geometry": {
        "coordinates": [
          1.774513671,
          50.7038878539
        ],
        "type": "Point"
      }
    },
    ...
  ]
}
```

In it we see two `feature.detections` (`detection_key=o8kc5kth6o7m4f5eosebin7od5` and `detection_key=gq9da6nqktj5rklq5vrc4q8sul`) of an `object--bench` in two respective images (`"image_key": "tsWJOYler98YAmg97kUzLQ"` and `"image_key": "39JmaDL9LxsaijLV7n2Ccg"`).

This entry is showing a single physical bench located at `latitude=1.774513671` and `longitude=50.7038878539` and present in the two images listed (that were used to work out its position).

More detections are returned, but for brevity I have omitted from the response printed in this post (`...`).

**A note on feature types**

[Mapillary has three types of features it can detect](https://help.mapillary.com/hc/en-us/articles/115002332165):

* point features: 42 types of objects as point features (i.e. map features that are represented by points on the map, like fire hydrants or street lights).
  * _In the example I used earlier, I've shown the feature `object--bench` which has a type `"type": "Point"` (point feature)._
* traffic signs:  1,500 different traffic sign classes (also extracted as point features).
* line features: 19 object classes are extracted as line features (map features represented by lines, such as guardrails or lanes).

## Your Use-cases...

Hopefully this gives you a few more ideas to build on Chris' post. I also want to say a big thank you to Chris for proof-reading this post, and providing very valuable feedback.

Please do share the use-cases you're using the Mapillary API for -- I can’t wait to see what other projects are being built on top of it.