---
date: 2021-05-21
title: "Trek View Trail Quality Index (An Alternative Method)"
description: "Mobile apps "
categories: guides
tags: [rRuf, Data Bike, DMAMPO, Minnesota]
author_staff_member: dgreenwood
image: /assets/images/blog/2021-05-21/
featured_image: /assets/images/blog/2021-05-21/
layout: post
published: false
---

**Using images to determine trail quality.**

Last week I shared link to the [IEEE Global Road Damage Detection Challenge 2020](https://rdd2020.sekilab.global/).

[You can see the results of this years competition in this paper](https://www.researchgate.net/publication/345989816_Global_Road_Damage_Detection_State-of-the-art_Solutions).

What I really like about this competition is that [all entries are required to be open-sourced](https://rdd2020.sekilab.global/submissions/):

> Source code will also be required to be submitted, either through a publicly available repository on a Git-based version control hosting service such as GitHub or BitBucket for the final evaluation. All source codes are expected to be released as open-source software, utilizing some generally accepted licensing such as Apache License 2.0, GNU General Public License, MIT license, or others of similar acceptance by the Open Source Initiative.

Which means we can dig into the code, and hopefully try and build upon it.

Below are the 12 submissions to the 2020 competition, [as detailed in the report](https://www.researchgate.net/publication/345989816_Global_Road_Damage_Detection_State-of-the-art_Solutions):

<table>
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

For this post I'll be examining the solution that scored highest on both of the GRDDC tests submitted by the IMSC team.

To test the code, I'm going to be using images captured by the DMAMPO Data Bike's rear facing GoPro HERO 5 camera (shown mounted to the back of the bike below).

<img class="img-fluid" src="/assets/images/blog/2021-05-21/dmampo-data-bike-rider.jpg" alt="DMAMPO Data Bike" title="DMAMPO Data Bike" />

The HERO 5 captured images a resolution 12.1 megapixels (4000x3000).









