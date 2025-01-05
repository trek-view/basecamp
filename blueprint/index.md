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

<p>Since the inception of Trek View I've wanted to build a map platform similar to Street View, but designed for adventurers.</p>

<p>I have over 100 terabytes of footage on the map, it's just incredibly hard to search and share.</p>

<p>I want people to discover my trails so that they can be explored in 360, filtering by how the images were captured (ski, hike, etc.), the elevation (or elevation changes), the terrain, etc.</p>

<p>Over the last 4 years I've been doing a lot of research about how to implement the idea, much of which can be found on the blog. That research has made it clear that the underlying infrastructure to build something like this is complex, but not impossible.</p>

<p>Now I am building it.</p>

<h3>What's wrong with Street View or Mapillary?</h3>

<p>Nothing.</p>

<p>The problem with these platforms is they were designed for street level images of roadways. They do a great job at that.</p>

<p>Yes, they both work with trail imagery, users can upload photos and videos shot (mostly) anywhere. However, the user experience for those browsing the uploads is far from perfect for this use-case.</p>

<p>For me search is the biggest issue.</p>

<p>Neither platform offers the ability to search on a specific criteria (e.g. elevation, type of trail, etc.).</p>

<p>The assumption is you know where you want to drop into the imagery. For looking up what a store front looks like from an address, or if parking is easy, Mapillary and Street View are perfect. For trails, finding viewpoints or way-markers is more important which you can't easily get an address or fixed point to search on.</p>

<h3>What are the challenges with building a street level image map?</h3>

<p>What seems like a fairly simple tool, a map with images you can drop into, unravels to be very complex (and expensive) once you get under the hood...</p>

<h4>Data types/size</h4>

<p>My backup of GoPro imagery and video is more than 100 Tbs, and growing quickly. That is just imagery I've shot!</p>

<p>To give a basic storage estimate using <a target="_blank" href="https://aws.amazon.com/s3/pricing/">Amazon S3 storage</a> (I know there are cheaper options), it costs $0.023 per GB for storage. So $0.023 * 100000 = $2300/mo!</p>

<p>These services also charge for bandwidth usage. For example, you pay for requests made against your S3 buckets and objects. Assuming a user views 30 or 40 images per session, the costs get huge!</p>

<p>Another issue with this is simply having a scalable solution for uploading this volume of imagery in a browser (or desktop app). Although this is a fairly trivial problem to solve.</p>

<p>Finally, if you've ever used ffmpeg to process videos on your PC you've probably heard your fan start screaming. Processing videos is fairly intensive. To put videos on the map, you need to convert them to images which required ffmpeg. Therefore, costs to run an ffmpeg processing server also quickly adds up.</p>

<p>For someone with a budget of less than $100/mo to run this, following the approach of hosting all the data myself is impossible.</p>

<h4>Database storage</h4>

<p>This is where the complexity can come in. In Street View you have interconnected blue lines. You can jump between images seamlessly in the interface.</p>

<p>In the backend, I am assuming Street View and Mapillary use a graph database to join points with relationships. This is fairly easy at a sequence level, that is for images in a timelapse or a single video uploaded by a user. Though how do you define how sequences close to each other are connected? This is defined in the queries.</p>

<p>Similarly, before images are exposed on the map the metadata for them is processed to ensure accuracy. In the case of Street View, you might notice your images are snapped to existing features that appear on the map (like pathways)... although this is not always correct.</p>

<p>With time, these queries and processing logic can be tuned, but working spacial data is tough (at least for someone that doesn't work full-time in this area).</p>

<h4>User interface</h4>

<p>Viewing a single 360 in a panoramic viewer like <a target="_blank" href="https://pannellum.org/">Panelleum is easy</a>.</p>

<p>Introducing navigation arrows to allow user to move between photos with seamless (and not jerky) transitions is much more difficult.</p>

<p>Jumping between images on Street View and Mapillary often looks smooth, with a blur effect employed as the frame moves. This seemingly simple feature is actually a little more complex than it might first appear.</p>

<p>Finally, privacy. Street View and Mapillary employ blurring of personally identifiable information. Whilst there are a few open tools that can be used to do this, they're likely not as accurate and also require a fair bit of additional processing power, at cost, to run.</p>

<p>In short, trying to build this from scratch to a level that would be acceptable for a user would not be easy.</p>

<h3>My hacky plan</h3>

<p>I'm used to working with limitations like this, and quite enjoy it.</p>

<p>Mapillary is a <em>fairly</em> open tool in many regards;</p>

<ul>
  <li>You can upload images and videos with common metadata formats (CAMM and GPMD) using existing open-source tooling <a target="_blank" href="https://github.com/mapillary/mapillary_tools/">Mapillary Tools</a></li>
  <li>It processes both images and video uploads and exposes the computed data server side for each sequence via their API</li>
  <li>There is no charge for accessing images via their API (unlike Street View which is eye-wateringly expensive)</li>
  <li>They offer an open-source panoramic browser <a target="_blank" href="https://github.com/mapillary/mapillary-js">MapillaryJS</a> -- as used in Mapillary web</li>
</ul>

<p>With this in mind, I decided to use Mapillary as a backend as follows...</p>

<ol>
  <li>allow user to upload photos or videos via a Trek View web application direct to Mapillary</li>
  <li>the Mapillary processed metadata for each sequence uploaded is stored in Trek View web application, but the actual images live on the Mapillary server</li>
  <li>a user requests images using the metadata stored in the Trek View web application database, but the images themselves are loaded from Mapillary servers (the URL of which lives in the metadata inside the Trek View database)</li>
</ol>

<h3>The massive risk of this plan</h3>

<p>The obvious risk with this plan, and I hate it, is that Facebook (aka Mapillary) can kill this product at anytime.</p>

<p>If Facebook shut-down Mapillary entirely or simply stop allowing users to upload or retrieve images for free my product is dead in the water.</p>

<p>As this is a hobby project which I'm quite happy to use as a learning experience I am reluctantly happy to overlook this issue. However, I do expect to wake up one day for my map to be broken. To be clear, if this was a commercial project, I would not proceed any further with this approach (I'm putting this warning here for the many I have spoken to considering some form of competing commercial product to Street View or Mapillary. You have been warned!).</p>

<h3>The proposed app</h3>

<p>Once I have this data in a database I can build neat features on-top of it including:</p>

<h4>Adventure specific search</h4>

<p><img class="img-fluid" src="/assets/images/blueprint/trek-view-map-search.jpg" alt="Trek View Map Search" title="Trek View Map Search" /></p>

<p>Search and filter sequences you want to see. Filter by the activity. Filter by the time of year they were captured. Filter by the weather...</p>

<h4>Enrich sequences</h4>

<p>Add additional metadata to each sequence, including weather and air quality, sowing this to the user when viewing a sequence, and also exposing it via search.</p>

<h4>More intuitive navigation of imagery</h4>

<p><img class="img-fluid" src="/assets/images/blueprint/trek-view-map.jpg" alt="Trek View Map" title="Trek View Map" /></p>

<p>Using trail specific views, including navigating the images in a sequence by elevation.</p>

<h4>Grouping of sequences</h4>

<p><img class="img-fluid" src="/assets/images/blueprint/trek-view-map-trail.jpg" alt="Trek View Map Trail" title="Trek View Map Trail" /></p>

<p><em>Image taken from Ride with GPS</em></p>

<p>Allow users to group sequences into larger ones (e.g. to create an entire trail) and add descriptive information to aid users considering visiting the trail themselves.</p>

<h3>Stay up-to-date with my progress</h3>

<p>I'll be posting regular updates to all Trek View forum members. If you'd like to hear about the latest developments with the project, make sure to sign up.</p>

<div class="cta button"><a href="https://campfire.trekview.org/t/welcome-to-trek-view-forum/5" target="_blank">Sign up here...</a></div>

</div>