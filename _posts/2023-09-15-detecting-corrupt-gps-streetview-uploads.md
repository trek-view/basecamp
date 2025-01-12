---
date: 2023-09-15
title: "Automatically detecting and removing panos with corrupt GPS from a timelapse sequence"
description: "Occasionally I get patches of erroneous GPS in my timelapse photos reported by the camera. Here's a script to identify and remove these points before upload."
categories: developers
tags: [Mapillary, Street View, GPS]
author_staff_member: dgreenwood
image: /assets/images/blog/2023-09-15/gsv-studio-errors.jpeg
featured_image: /assets/images/blog/2023-09-15/gsv-studio-errors.jpeg
published: true
redirect_from:
  - 
---

**Occasionally I get patches of erroneous GPS in my timelapse photos reported by the camera. Here's a script to identify and remove these points before upload.**

When images with corrupt GPS are uploaded, it either fails the upload (in the case of Street View) or just ruins the experience (in Mapillary).

I have 100s of millions of photos, which means I can't manually detect these issues each time I come to upload.

To automate the detection of photos with corrupted GPS I use a small script to detect them, and move them to a seperate directory.

The math could be improved with more dynamic analysis of the track. However, for my use-case, the output works well.

In short the script sorts the images by filename (GoPro images always named in order) and then checks for the distance between neighbouring images. If the distance between the images is greater than the user specified threshold, the script will detect corrupted GPS. I can supply an threshold distance between photos because I know how I was capturing the sequence (e.g. walking).

If an erroneous photos is discovered, the calculation is run again but this time to the next image in sequence (allowing for twice the threshold). And so on...

There are a few more small features, but you can see these for yourself in the script `check_gps.py`:

```python
import os
import shutil
import argparse
import csv
import exifread
from geopy.distance import geodesic

def extract_gps_metadata(image_path):
    with open(image_path, 'rb') as image_file:
        tags = exifread.process_file(image_file, stop_tag='GPS', details=False)
    try:
        latitude = convert_to_degrees(tags['GPS GPSLatitude'])
        longitude = convert_to_degrees(tags['GPS GPSLongitude'])
        return latitude, longitude
    except KeyError:
        return None, None

def convert_to_degrees(value):
    d, m, s = [x.num / x.den for x in value.values]
    return d + (m / 60.0) + (s / 3600.0)

def find_next_valid(index, gps_data):
    """Find the next valid photo in the sequence."""
    for i in range(index + 1, len(gps_data)):
        if gps_data[i]:
            return gps_data[i]
    return None

def find_prev_valid(index, gps_data):
    """Find the previous valid photo in the sequence."""
    for i in range(index - 1, -1, -1):
        if gps_data[i]:
            return gps_data[i]
    return None

def analyze_gps(directory, deviation_threshold_meters, distance_threshold_meters, close_distance_threshold_meters, output_file, bad_photos_dir):
    if not os.path.isdir(directory):
        raise FileNotFoundError(f"Directory not found: {directory}")
    
    if not os.path.exists(bad_photos_dir):
        os.makedirs(bad_photos_dir)

    # Get sorted list of files
    photos = sorted(
        [os.path.join(directory, f) for f in os.listdir(directory) if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
    )
    
    gps_data = []
    bad_photos = []
    output_rows = []

    # Extract GPS metadata
    for photo in photos:
        lat, lon = extract_gps_metadata(photo)
        if lat is not None and lon is not None:
            gps_data.append((photo, lat, lon))
        else:
            gps_data.append(None)
            bad_photos.append((photo, "Missing GPS data"))

    # Find the first valid photo
    first_photo = None
    for photo_data in gps_data:
        if photo_data:
            first_photo = photo_data
            break

    if not first_photo:
        raise ValueError("No photos with valid GPS data found in the directory.")

    first_location = (first_photo[1], first_photo[2])

    # Analyze for corruption and deviations
    for i, current in enumerate(gps_data):
        if not current:
            continue

        photo, lat, lon = current
        current_location = (lat, lon)

        # Default values for distances and deviations
        dist_prev = None
        dist_next = None
        avg_deviation = None
        issue = ""
        has_issue = False
        prev_file = None
        next_file = None

        # Check distance from the first valid photo
        dist_from_first = geodesic(first_location, current_location).meters
        if dist_from_first > distance_threshold_meters:
            issue = f"Distance from first photo is {dist_from_first:.2f}m (Threshold: {distance_threshold_meters}m)"
            has_issue = True
            bad_photos.append((photo, issue))
            gps_data[i] = None
            continue

        # Find next valid neighbor
        next_valid = find_next_valid(i, gps_data)
        if next_valid:
            next_location = (next_valid[1], next_valid[2])
            dist_next = geodesic(current_location, next_location).meters
            next_file = next_valid[0]
            if dist_next < close_distance_threshold_meters:
                issue = f"Distance to next photo is {dist_next:.2f}m (Too close, threshold: {close_distance_threshold_meters}m)"
                has_issue = True
                bad_photos.append((photo, issue))
                gps_data[i] = None
                continue

        # Find previous and next valid neighbors for deviation calculation
        prev = find_prev_valid(i, gps_data)
        next = find_next_valid(i, gps_data)

        if prev:
            prev_location = (prev[1], prev[2])
            dist_prev = geodesic(prev_location, current_location).meters
            prev_file = prev[0]

        if prev and next:
            avg_deviation = (dist_prev + dist_next) / 2 if dist_prev and dist_next else None
            if avg_deviation and avg_deviation > deviation_threshold_meters:
                issue = f"Deviation is {avg_deviation:.2f}m (Threshold: {deviation_threshold_meters}m)"
                has_issue = True
                bad_photos.append((photo, issue))
                gps_data[i] = None
                continue

        # Add data to output rows
        output_rows.append({
            "File Name": os.path.basename(photo),
            "GPS Latitude": lat,
            "GPS Longitude": lon,
            "Distance to Next (m)": f"{dist_next:.2f}" if dist_next else "",
            "Deviation Average (m)": f"{avg_deviation:.2f}" if avg_deviation else "",
            "Previous File": os.path.basename(prev_file) if prev_file else "",
            "Next File": os.path.basename(next_file) if next_file else "",
            "Has Issue": "True" if has_issue else "False",
            "Issue Details": issue
        })

    # Write CSV output
    fieldnames = [
        "File Name", "GPS Latitude", "GPS Longitude", "Distance to Next (m)",
        "Deviation Average (m)", "Previous File", 
        "Next File", "Has Issue", "Issue Details"
    ]
    with open(output_file, "w", newline="") as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(output_rows)
    
    print(f"Analysis complete. Results written to {output_file}")
    print(f"Bad photos moved to: {bad_photos_dir}")

# Main function to handle CLI
def main():
    parser = argparse.ArgumentParser(description="Analyze GPS metadata in a directory of photos.")
    parser.add_argument("directory", type=str, help="Path to the directory containing photos.")
    parser.add_argument("--deviation-threshold-meters", type=float, default=50, help="Max allowed average deviation between neighboring photos (in meters).")
    parser.add_argument("--distance-threshold-meters", type=float, default=500, help="Max allowed distance from the first photo (in meters).")
    parser.add_argument("--close-distance-threshold-meters", type=float, default=0.1, help="Min distance between consecutive photos (in meters).")
    parser.add_argument("--output-file", type=str, default="gps_analysis.csv", help="Path to the output CSV file for analysis results.")
    parser.add_argument("--bad-photos-dir", type=str, required=True, help="Path to the directory where bad photos will be moved.")
    args = parser.parse_args()

    analyze_gps(
        directory=args.directory,
        deviation_threshold_meters=args.deviation_threshold_meters,
        distance_threshold_meters=args.distance_threshold_meters,
        close_distance_threshold_meters=args.close_distance_threshold_meters,
        output_file=args.output_file,
        bad_photos_dir=args.bad_photos_dir
    )

if __name__ == "__main__":
    main()
```

The script accepts the following;

* **`directory`** (`str`, required):
Path to the directory containing the photos to analyse.
* **`--deviation-threshold-meters`** (`float`, default: `50`):
Maximum allowed average deviation between neighbouring photos (in meters).
* **`--distance-threshold-meters`** (`float`, default: `500`):
Maximum allowed distance from the first photo (in meters).
* **`--close-distance-threshold-meters`** (`float`, default: `0.1`):
Minimum allowed distance between consecutive photos (in meters). Useful for removing photos when stanfding still.
* **`--output-file`** (`str`, default: `gps_analysis.csv`):
Path to the output CSV file for analysis results.
* **`--bad-photos-dir`** (`str`, required):
Path to the directory where photos flagged as "bad" (e.g., missing/corrupt GPS) will be moved.

e.g.

```shell
python3 check_gps.py /Users/johndoe/photos/road_trip/ \
--deviation-threshold-meters 20 \
--distance-threshold-meters 1000 \
--close-distance-threshold-meters 0.5 \
--output-file road_trip_analysis.csv \
--bad-photos-dir /Users/johndoe/photos/bad_photos/
```