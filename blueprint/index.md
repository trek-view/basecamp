---
title: Blueprint
heading: Blueprint
description: The grand plan for Trek View.
image: /assets/images/global/trek-view-360-degree-tour.jpg
layout: page
redirect_from:
  - 
---

<div class="text-container">

<h2>Overview</h2>

<p>Since the inception of Trek View I've wanted to build a map platform similar to Street View, but designed for adventurers.</p>

<p>I have over 100 terabytes of footage on the map, it's just incredibly hard to search and share.</p>

<p>I want people to discover my trails so that they can be explored in 360, filtering by how the images were captured (ski, hike, etc.), the elevation (or elevation changes), the terrain, etc.</p>

<p>Over the last 4 years I've been doing a lot of research about how to implement the idea, much of which can be found on the blog. That research has made it clear that the underlying infrastructure to build something like this is complex, but not impossible.</p>

<p>Now I am building it.</p>

<h2>What's wrong with Street View or Mapillary?</h2>

<p>Nothing.</p>

<p>The problem with these platforms is they were designed for street level images of roadways. They do a great job at that.</p>

<p>Yes, they both work with trail imagery, users can upload photos and videos shot (mostly) anywhere. However, the user experience for those browsing the uploads is far from perfect for this use-case.</p>

<p>For me search is the biggest issue.</p>

<p>Neither platform offers the ability to search on a specific criteria (e.g. elevation, type of trail, etc.).</p>

<p>The assumption is you know where you want to drop into the imagery. For looking up what a store front looks like from an address, or if parking is easy, Mapillary and Street View are perfect. For trails, finding viewpoints or way-markers is more important which you can't easily get an address or fixed point to search on.</p>

<h2>What are the challenges with building a street level image map?</h2>

<p>What seems like a fairly simple tool, a map with images you can drop into, unravels to be very complex (and expensive) once you get under the hood...</p>

<h3>Data types/size</h3>

<p>My backup of GoPro imagery and video is more than 100 Tbs, and growing quickly. That is just imagery I've shot!</p>

<p>To give a basic storage estimate using [Amazon S3 storage](https://aws.amazon.com/s3/pricing/) (I know there are cheaper options), it costs $0.023 per GB for storage. So $0.023 * 30000 = $690/mo!</p>

<p>These services also charge for bandwidth usage. For example, you pay for requests made against your S3 buckets and objects. Assuming a user views 30 or 40 images per session, the costs get huge!</p>

<p>Another issue with this is simply having a scalable solution for uploading this volume of imagery in a browser (or desktop app). Although this is a fairly trivial problem to solve.</p>

<p>Finally, if you've ever used ffmpeg to process videos on your PC you've probably heard your fan start screaming. Processing videos is fairly intensive. To put videos on the map, you need to convert them to images which required ffmpeg. Therefore, costs to run an ffmpeg processing server also quickly adds up.</p>

<p>For someone with a budget of less than $100/mo to run this, following the approach of hosting all the data myself is impossible.</p>

<h3>Database storage</h3>

<p>This is where the complexity can come in. In Street View you have interconnected blue lines. You can jump between images seamlessly in the interface.</p>

<p>In the backend, I am assuming Street View and Mapillary use a graph database to join points with relationships. This is fairly easy at a sequence level, that is for images in a timelapse or a single video uploaded by a user. Though how do you define how sequences close to each other are connected? This is defined in the queries.</p>

<p>Similarly, before images are exposed on the map the metadata for them is processed to ensure accuracy. In the case of Street View, you might notice your images are snapped to existing features that appear on the map (like pathways)... although this is not always correct.</p>

<p>With time, these queries and processing logic can be tuned, but working spacial data is tough (at least for someone that doesn't work full-time in this area).</p>

<h3>User interface</h3>

<p>Viewing a single 360 in a panoramic viewer like [Panelleum is easy](https://pannellum.org/).</p>

<p>Introducing navigation arrows to allow user to move between photos with seamless (and not jerky) transitions is much more difficult.</p>

<p>Jumping between images on Street View and Mapillary often looks smooth, with a blur effect employed as the frame moves. This seemingly simple feature is actually a little more complex than it might first appear.</p>

<p>Finally, privacy. Street View and Mapillary employ blurring of personally identifiable information. Whilst there are a few open tools that can be used to do this, they're likely not as accurate and also require a fair bit of additional processing power, at cost, to run.</p>

<p>In short, trying to build this from scratch to a level that would be acceptable for a user would not be easy.</p>

<h2>My hacky plan...</h2>

<p>I'm used to working with limitations like this, and quite enjoy it.</p>

<p>Mapillary is a <em>fairly</em> open tool in many regards;</p>

<ul>
  <li>You can upload images and videos with common metadata formats (CAMM and GPMD) using existing open-source tooling <a target="_blank" href="https://github.com/mapillary/mapillary_tools/">Mapillary Tools</a></li>
  <li>It processes both images and video uploads and exposes the computed data server side for each sequence via their API</li>
  <li>There is no charge for accessing images via their API (unlike Street View which is eye-wateringly expensive)</li>
  <li>They offer an open-source panoramic browser <a target="_blank" href="https://github.com/mapillary/mapillary-js">MapillaryJS</a> -- as used in Mapillary web</li>
</ul>

<p>With this in mind, I am using Mapillary as a backend as follows...</p>

<ol>
  <li>allow user to upload photos or videos via a Trek View web application to Mapillary</li>
  <li>the Mapillary processed metadata for each sequence uploaded is stored in Trek View web application</li>
  <li>a user views images in Trek View web application (the images themselves are loaded from Mapillary servers)</li>
</ol>

<p>From here I can do neat things like:</p>

<ul>
  <li>Allow users to group sequences into larger ones (e.g. to create an entire trail)</li>
  <li>Expose a search and filter on the map</li>
  <li>Show weather, air quality, etc for each image (and also expose via search)</li>
  <li>Use "adventure" specific views, including elevation, length of sequence, descriptive info, etc.</li>
</ul>

<p>Here are some mockups I've created to try and illustrate what I have in my mind;</p>

<iframe width="768" height="432" src="https://miro.com/app/live-embed/uXjVNu3rhjM=/?moveToViewport=-8653,-637,15233,7305&embedId=786181742316" frameborder="0" scrolling="no" allow="fullscreen; clipboard-read; clipboard-write" allowfullscreen></iframe>

<h2>The massive risk of this plan</h2>

<p>The obvious risk with this plan, and I hate it, is that Facebook (aka Mapillary) can kill this product at anytime.</p>

<p>If Facebook shut-down Mapillary entierly or simply stop allowing users to upload or retrieve images for free my product is dead in the water.</p>

<p>As this is a hobby project which I'm quite happy to use as a learning experience I am reluctantly happy to overlook this issue. However, I do expect to wake up one day for my map to be broken. To be clear, if this was a commercial project, I would not proceed any further with this approach (I'm putting this warning here for the many I have spoken to considering some form of competing commercial product to Street View or Mapillary. You have been warned!).</p>

</div>