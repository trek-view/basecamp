---
date: 2022-08-19
title: "Lessons Learned the Google Street View Publish API"
description: "Uploading videos is relatively straight forward, but here are some of the things we've learned the hard way (and you should be aware of)."
categories: developers
tags: [streetview, google]
author_staff_member: dgreenwood
image: /assets/images/blog/2022-08-19/streetview-api-docs-meta.jpg
featured_image: /assets/images/blog/2022-08-19/streetview-api-docs-sm.jpg
layout: post
published: false
---

**Uploading videos is relatively straight forward, but here are some of the things we've learned the hard way (and you should be aware of).**

Last week I complained about Mapillary. This week, Google Street View is in my cross-hairs.

I've posted before about the Google Street View API;

1. [Google Street View Publish API - Quick Start Guide](https://www.trekview.org/blog/2020/street-view-publish-api-quick-start-guide/](/blog/2020/street-view-publish-api-quick-start-guide/)
2. [Upload a Video to the Street View Publish](/blog/2021/upload-video-street-view-publish-api)
3. [Creating a Video File Ready to be Uploaded to the Google Street View API](/blog/2022/create-google-street-view-video-publish-api)

The second and third post introduces the concept of creating a Google Street View video and then uploading it to the Street View API.

Now we've been working the Street View API for some time to upload videos, I wanted to share some of our findings (and lessons learned the hard way).

## Useful debugging tools

<img class="img-fluid" src="/assets/images/blog/2022-08-19/google-api-explorer.jpeg
" alt="Google Street View API Explorer" title="Google Street View API Explorer" />

The Google API Explorer will help you test your request to the Street View API from your browser. The API Explorer is available for all Street View Publish endpoints [e.g.](https://developers.google.com/streetview/publish/reference/rest/v1/photoSequence/create#PhotoSequence).

<img class="img-fluid" src="/assets/images/blog/2022-08-19/street-view-studio-ui.jpeg
" alt="Google Street View Studio" title="Google Street View Studio" />

Street View Studio will also help you track uploads in the browser (though the information is provides for debugging is somewhat limited, as I will cover in this post).

## Useful debugging tools



