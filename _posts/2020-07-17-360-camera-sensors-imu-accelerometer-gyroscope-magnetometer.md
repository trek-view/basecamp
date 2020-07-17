---
date: 2020-07-17
title: "What is an IMU?"
description: "Cameras are full of sensors (and not just image sensors)."
categories: developers
tags: [imu, accelerometer, gyroscope, maggnetometer]
author_staff_member: dgreenwood
image: /assets/images/blog/2020-07-17/3dof-6dof-meta.jpg
featured_image: /assets/images/blog/2020-07-17/3dof-6dof-sm.jpg
layout: post
published: true
---

**IM Who?**

What was once a device that simply exposed light to film, is now a device that [measures light hitting a sensor](/blogwhat-is-global-shutter-rolling-shutter-360-cameras) and a whole host of other things; location, direction of travel, temperature...

In the world of 360 tour photography, these sensors can be particularly important. For example, recording the pitch and roll of the camera at the time of capture can help improve stitching quality (e.g by making automatic horizon leveling possible).

Last year a I explained more about [Yaw, Pitch and Roll](/blog/2020/yaw-pitch-roll-360-degree-photography).

In this post I'll talk a bit more about how they're measured by cameras.

## Six degrees of freedom

Degrees of freedom (DoF) refer to the number of basic ways a rigid object can move through 3D space. There are six total degrees of freedom.

Three correspond to rotational movement around the x, y, and z axes, commonly termed pitch, yaw, and roll (3-DOF for orientation).

<img class="img-fluid" src="/assets/images/blog/2020-07-17/cartesian_coordinate_axes_3d.png" alt="Six degrees of freedom" title="Six degrees of freedom" />

The other three correspond to translational movement along those axes, which can be thought of as moving forward or backward, moving left or right, and moving up or down (3-DOF for position).

Sometimes you can estimate this information using reported GPS information. For example, [calculating pitch, heading and speed between two photos](/blog/2020/what-direction-are-you-facing).

As sensors become cheaper many cameras are also including sensors that can more accurately measure this telemetry. In order for a camera to be [Street View Ready, it requires six degrees of freedom (6-DOF) to be reported](https://developers.google.com/streetview/ready/specs-svready).

This information is usually reported by an Inertial Measurement Unit.

## Inertial Measurement Unit (IMU)

IMUs, or Inertial Measurement Units, can measure a variety of factors, including speed, direction, acceleration, specific force, angular rate, and when using a magnetometer, magnetic fields surrounding the device.

Technically, the term “IMU” refers to just the collection of sensors inside the component, but IMUs often include sensor fusion software which combines and processes data from multiple sensors to provide measures of orientation and heading. This combination of component and software is also referred to as an AHRS (Attitude Heading Reference System).

An IMU can measure between a minimum of 2 DOF to a maximum of 6 DOF. This is dependent on the number and types of sensors used.

Most modern IMUs are composed of a 3-axis accelerometer and a 3-axis gyroscope (often called a 6-axis IMU).

Some also include an additional 3-axis magnetometer (considered a 9-axis IMU).

### Accelerometer

<img class="img-fluid" src="/assets/images/blog/2020-07-17/accelerometer-illustration.png" alt="Accelerometer illustration" title="Accelerometer illustration" />

Measures velocity and acceleration.

The most commonly used type of motion sensor is the accelerometer. It measures acceleration (change of velocity) across a single axis, like when you accelerate in your car or drop your phone.

Accelerometers measure linear acceleration in a particular direction. An accelerometer can also be used to measure gravity as a downward force.

### Gyroscope

<img class="img-fluid" src="/assets/images/blog/2020-07-17/gyroscope-illustration.png" alt="Gyroscope illustration" title="Gyroscope illustration" />

Measures rotation and rotational rate.

It's easy to confuse accelerometers and gyroscopes. The main difference between the two devices is simple: one can sense rotation, whereas the other cannot.

While accelerometers can measure linear acceleration, they can’t measure twisting or rotational movement. Gyroscopes, however, measure angular velocity about three axes: pitch (x axis), roll (y axis) and yaw (z axis).

When integrated with sensor fusion software, a gyro can be used to determine an object’s orientation within 3D space. While a gyroscope has no initial frame of reference (like gravity), you can combine its data with data from an accelerometer to measure angular position.

### Magnetometer

<img class="img-fluid" src="/assets/images/blog/2020-07-17/magnetometer-illustration.gif" alt="Magnetometer illustration" title="Magnetometer illustration" />

Establishes cardinal direction (directional heading)

A magnetometer, as the name suggests, measures magnetic fields. It can detect fluctuations in Earth’s magnetic field, by measuring the air’s magnetic flux density at the sensor’s point in space. Through those fluctuations, it finds the vector towards Earth’s magnetic North.

This can be fused in conjunction with accelerometer and gyroscope data to determine absolute heading.

## How data is reported

As mentioned, the data is fused together to report telemetry.

Once fused these values can be embedded into the metadata of an image or video.

In the case of image files this is reported in either the EXIF or XMP fields for example; [XMP] `PoseHeadingDegrees`, [XMP] `PosePitchDegrees`...

[For videos this is written into the telemetry track](/blog/2020/metadata-exif-xmp-360-video-files). Typically telemetry formats for 360 cameras are reported in two standards, either [gpmf](https://github.com/trek-view/360-camera-metadata/blob/master/0-standards/gpmf.md) (GoPro) or [camm](https://github.com/trek-view/360-camera-metadata/blob/master/0-standards/camm.md) (most other cameras).

You can see real examples of what this data looks like for both image and video files for a variety of 360 cameras in our [360 Camera Metadata repository on GitHub](https://github.com/trek-view/360-camera-metadata).

## Help us Build Great Software

Unfortunately we don't have the budget to buy every single 360 camera to test their IMU's and the data they produce with our software.

Whilst having standards like CAMM, EXIF and XMP is very helpful, many manufacturers do things slightly differently (especially given the flexibility of fields in XMP data).

In order to make sure our [free, open-source software works for everyone](https://github.com/trek-view/), we need to test it using 360 image and video files produced by a range of cameras and manufacturers.

And that's why we need your help.

If you have a 360 camera and want to support our work, [please share more information about your camera with us using this form](https://docs.google.com/forms/d/e/1FAIpQLScgOk1W5jpyrQuDF5FuKqUpKK0EIpSlokckZd3OB-r_ZOjZmQ/viewform). Thank you!