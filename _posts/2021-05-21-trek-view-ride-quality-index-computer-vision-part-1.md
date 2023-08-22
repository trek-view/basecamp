---
date: 2021-05-21
title: "Trek View Trail Quality Index: An Alternative Method Using Computer Vision"
description: "Using the imagery captured by the Data Bike to measure cycle path surface quality."
categories: guides
tags: [rRuf, data bike, DMAMPO, bike, Global Road Damage Detection Challenge 2020, IEEE]
author_staff_member: dgreenwood
image: /assets/images/blog/2021-05-21/road-surface-classification-meta.jpg
featured_image: /assets/images/blog/2021-05-21/road-surface-classification-sm.jpg
layout: post
published: true
---

**Using the imagery captured by the Data Bike to measure cycle path surface quality.**

Last month I shared a link to the [IEEE Global Road Damage Detection Challenge 2020](https://rdd2020.sekilab.global/), [after realising measuring the surface quality of a bike path from sensors in a phone was not particularly accurate at scale](/blog/trek-view-ride-quality-index).

## Damage detection

<img class="img-fluid" src="/assets/images/blog/2021-05-21/sample2.jpeg" alt="IEEE Global Road Damage Detection Challenge 2020" title="IEEE Global Road Damage Detection Challenge 2020" />

[You can see the results of this years Global Road Damage Detection Challenge in this paper](https://www.researchgate.net/publication/345989816_Global_Road_Damage_Detection_State-of-the-art_Solutions).

What I really like about this challenge is that [all entries are required to be open-sourced](https://rdd2020.sekilab.global/submissions/).

There were 12 submissions to the 2020 challenge, [as detailed in the report](https://www.researchgate.net/publication/345989816_Global_Road_Damage_Detection_State-of-the-art_Solutions):

<table class="tableizer-table">
<thead><tr><th>GRDDC – Rank</th>
<th>Name of the Team</th>
<th>Test1-Score</th>
<th>Test2-Score</th>
<th>Link for the Source Code</th>
</tr></thead>
<tbody><tr>
<td>1</td>
<td>IMSC</td>
<td>0.6748</td>
<td>0.6662</td>
<td>https://github.com/USC-InfoLab/rddc2020</td>
</tr>
<tr>
<td>2</td>
<td>SIS Lab</td>
<td>0.6275</td>
<td>0.6358</td>
<td>https://github.com/kevaldoshi17/IEEE-Big-Data-2020</td>
</tr>
<tr>
<td>3</td>
<td>DD-VISION</td>
<td>0.629</td>
<td>0.6219</td>
<td>https://pan.baidu.com/s/1VjLuNBVJGS34mMMpDkDRGQ</td>
</tr>
<tr>
<td>4</td>
<td>titan_mu</td>
<td>0.5814</td>
<td>0.5751</td>
<td>https://github.com/titanmu/RoadCrackDetection</td>
</tr>
<tr>
<td>5</td>
<td>Dongjuns</td>
<td>0.5683</td>
<td>0.571</td>
<td>https://github.com/dongjuns/RoadDamageDetector</td>
</tr>
<tr>
<td>6</td>
<td>SUTPC</td>
<td>0.5636</td>
<td>0.5707</td>
<td>https://github.com/ZhangXG001/RoadDamgeDetection</td>
</tr>
<tr>
<td>7</td>
<td>RICS</td>
<td>0.565</td>
<td>0.547</td>
<td>https://github.com/mahdi65/roadDamageDetection2020</td>
</tr>
<tr>
<td>8</td>
<td>AIRS-CSR</td>
<td>0.554</td>
<td>0.541</td>
<td>https://github.com/ZhangXG001/RoadDamgeDetection</td>
</tr>
<tr>
<td>9</td>
<td>CS17</td>
<td>0.5413</td>
<td>0.543</td>
<td>https://github.com/TristHas/road</td>
</tr>
<tr>
<td>10</td>
<td>BDASL</td>
<td>0.5368</td>
<td>0.5426</td>
<td>https://github.com/vishwakarmarhl/rdd2020</td>
</tr>
<tr>
<td>11</td>
<td>IDVL</td>
<td>0.51</td>
<td>0.514</td>
<td>https://github.com/iDataVisualizationLab/roaddamagedetector</td>
</tr>
<tr>
<td>12</td>
<td>E-LAB</td>
<td>0.472</td>
<td>0.4656</td>
<td>https://github.com/MagischeMiesmuschel/E-LAB_IEEE_BDC_GRDD_2020_submission</td>
</tr>
</tbody></table>

The aim of the competition was to build models that could identify areas of a road where damage is present and the severity.

Though I realised this wasn't completely suited to our aims for two main reasons.

Firstly, many cycle paths cover a range of terrain in addition to asphalt roads (which is what these models were built around).

Secondly, although single areas of damage are important, a large pothole can be very dangerous to a cyclist, ride quality, in my mind, is more about the condition of an entire area of a path. Yes, a large pothole lowers ride quality and should be fixed, but if the path is wide, smooth and the pothole can be easily avoided, then I'd say the overall quality is pretty good.

## Quality detection

I then stumbled across another research paper titled; [Road Surface Classification with Images Captured From Low-cost Camera](https://www.researchgate.net/publication/337682194_Road_Surface_Classification_with_Images_Captured_From_Low-cost_Camera_-_Road_Traversing_Knowledge_RTK_Dataset).

[There's a nice supplementary blog post here on the research too](https://towardsdatascience.com/road-surface-classification-150f9874faef).

[The codebase from the research can be obtained here](https://github.com/thiagortk/Road-Surface-Classification).

<iframe width="560" height="315" src="https://www.youtube.com/embed/3UM97O0MQ3w" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

As you can see from the above video, the software detects the class of road (either asphalt, paved, or unpaved) and also determines a quality score (either good, regular or bad). The numbers shown in the video indicate probability of correct detection.

Over the next few weeks I'm going to dig further into these models and code, see how they perform with images from various data bikes, and see if they're suited for use at scale.