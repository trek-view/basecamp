---
date: 2020-07-17
title: "What is an IMU?"
description: "360 cameras are packed with sensors. Inertial Measurement Units or IMU's are becoming more widely used, espeically when positioning is required."
categories: guides
tags: []
author_staff_member: dgreenwood
image: /assets/images/blog/2020-07-17/
featured_image: /assets/images/blog/2020-07-17/
layout: post
published: false
---

IMU

Cameras are full of sensors.

What was once a device that simply exposed light to film, is now a device that [measures light to entering sensor](/blogwhat-is-global-shutter-rolling-shutter-360-cameras) and a whole host of other things; location, direction of travel, temperature...

In the world of 360 tour photography, these sensors can be paticularly important. For example, recording the pitch and roll of the camera at the time of capture can help improve stitching quality or allow for horizon levelling functionality.




https://www.w3.org/TR/magnetometer/


## Inertial Measurement Unit (IMU)

An IMU is a specific type of sensor that measures angular rate, force and sometimes magnetic field. IMUs are composed of a 3-axis accelerometer and a 3-axis gyroscope, which would be considered a 6-axis IMU. They can also include an additional 3-axis magnetometer, which would be considered a 9-axis IMU. Technically, the term “IMU” refers to just the sensor, but IMUs are often paired with sensor fusion software which combines data from multiple sensors to provide measures of orientation and heading. In common usage, the term “IMU” may be used to refer to the combination of the sensor and sensor fusion software; this combination is also referred to as an AHRS (Attitude Heading Reference System).

IMUs contain sensors such as accelerometers, gyroscopes, and magnetometers.

IMUs can measure a variety of factors, including speed, direction, acceleration, specific force, angular rate, and (in the presence of a magnetometer), magnetic fields surrounding the device.

Each sensor in an IMU is used to capture different data types:

How does an IMU work?
An IMU provides 2 to 6 DOF (Degrees of Freedom), which refers to the number of different ways that an object is able to move throughout 3D space. The maximum possible is 6 DOF, which would include 3 degrees of translation (flat) movement across a straight plane/along each axis (front/back, right/left, up/down) and 3 degrees of rotational movement across the x, y and z axes/about each axis.

### Accelerometer

<img class="img-fluid" src="/assets/images/blog/2020-07-17/" alt="" title="" />

Measures velocity and acceleration.

the accelerometer measures linear acceleration based on vibration

### Gyroscope

<img class="img-fluid" src="/assets/images/blog/2020-07-17/" alt="" title="" />

measures rotation and rotational rate

Using the key principles of angular momentum, the gyroscope helps indicate orientation.

It's easy to confuse accelerometers and gyroscopes. The main difference between the two devices is simple: one can sense rotation, whereas the other cannot.

### Magnetometer

establishes cardinal direction (directional heading)


Accelerometer: The most commonly used type of motion sensor is the accelerometer. It measures acceleration (change of velocity) across a single axis, like when you step on the gas in your car or drop your phone. Accelerometers measure linear acceleration in a particular direction. An accelerometer can also be used to measure gravity as a downward force. Integrating acceleration once reveals an estimate for velocity, and integrating again gives you an estimate for position. Due to the double integration and the state of today’s technology, an accelerometer is not a recommended method of distance estimation.
Gyroscope: While accelerometers can measure linear acceleration, they can’t measure twisting or rotational movement. Gyroscopes, however, measure angular velocity about three axes: pitch (x axis), roll (y axis) and yaw (z axis). When integrated with sensor fusion software, a gyro can be used to determine an object’s orientation within 3D space. While a gyroscope has no initial frame of reference (like gravity), you can combine its data with data from an accelerometer to measure angular position. For an in-depth look at the different types of gyroscopes, look to our 2nd blog titled, Exploring the Application of Gyroscopes.
Magnetometer: A magnetometer, as the name suggests, measures magnetic fields. It can detect fluctuations in Earth’s magnetic field, by measuring the air’s magnetic flux density at the sensor’s point in space. Through those fluctuations, it finds the vector towards Earth’s magnetic North. This can be fused in conjunction with accelerometer and gyroscope data to determine absolute heading. As you’ve seen, IMUs are used to measure acceleration, angular velocity and magnetic fields, and, when combined with sensor fusion software, they can be used to determine motion, orientation and heading. They’re found in many applications across consumer electronics and the industrial sector. In our next blog post, we’ll dive deeper into gyroscopes and what they’re used for.
As you’ve seen, IMUs are used to measure acceleration, angular velocity and magnetic fields, and, when combined with sensor fusion software, they can be used to determine motion, orientation and heading. They’re found in many applications across consumer electronics and the industrial sector. In our next blog post, we’ll dive deeper into gyroscopes and what they’re used for.

## Six degrees of freedom

## How is data reported