## Unstitched `.360` files (GoPro MAX only)

As I started by talking about `.360`'s from the GoPro MAX, I also wanted to show how these chaptered files from raw videos can also be concatenated in the same way.

Here are the demo files I'll use:

* [GS010141.360](https://drive.google.com/file/d/1-Ikg4TOwYOb8g5sAwWThxvLJKuJPA6eH/view?usp=sharing) - 4.01GB - 08min:02sec
* [GS020141.360](https://drive.google.com/file/d/1-NgfbU5juFUtLxkD6eQG2_K82zMJl_VQ/view?usp=sharing) - 4.01GB - 08min:02sec
* [GS030141.360](https://drive.google.com/file/d/1-SV4tKwTh7MiX48wkmXP7ctJKP3_XN9V/view?usp=sharing) - 1.12GB - 02min:24sec

As before, let us examine the first video (`GS010141.360`) using ffprobe;

```
Input #0, mov,mp4,m4a,3gp,3g2,mj2, from 'GS010141.360':
  Metadata:
    major_brand     : mp41
    minor_version   : 538120216
    compatible_brands: mp41
    creation_time   : 2020-08-02T12:45:54.000000Z
    location        : +28.7013-013.9193/
    location-eng    : +28.7013-013.9193/
    firmware        : H19.03.01.50.00
  Duration: 00:08:02.50, start: 0.000000, bitrate: 66400 kb/s
  Stream #0:0[0x1](eng): Video: hevc (Main) (hvc1 / 0x31637668), yuvj420p(pc, bt709), 4096x1344 [SAR 1:1 DAR 64:21], 29968 kb/s, 29.97 fps, 29.97 tbr, 90k tbn (default)
    Metadata:
      creation_time   : 2020-08-02T12:45:54.000000Z
      handler_name    : GoPro H.265
      vendor_id       : [0][0][0][0]
      encoder         : GoPro H.265 encoder
      timecode        : 12:45:09:01
  Stream #0:1[0x2](eng): Audio: aac (LC) (mp4a / 0x6134706D), 48000 Hz, stereo, fltp, 189 kb/s (default)
    Metadata:
      creation_time   : 2020-08-02T12:45:54.000000Z
      handler_name    : GoPro AAC  
      vendor_id       : [0][0][0][0]
      timecode        : 12:45:09:01
  Stream #0:2[0x3](eng): Data: none (tmcd / 0x64636D74) (default)
    Metadata:
      creation_time   : 2020-08-02T12:45:54.000000Z
      handler_name    : GoPro TCD  
      timecode        : 12:45:09:01
  Stream #0:3[0x4](eng): Data: bin_data (gpmd / 0x646D7067), 90 kb/s (default)
    Metadata:
      creation_time   : 2020-08-02T12:45:54.000000Z
      handler_name    : GoPro MET  
  Stream #0:4[0x5](eng): Data: none (fdsc / 0x63736466), 19 kb/s (default)
    Metadata:
      creation_time   : 2020-08-02T12:45:54.000000Z
      handler_name    : GoPro SOS  
  Stream #0:5[0x6](eng): Video: hevc (Main) (hvc1 / 0x31637668), yuvj420p(pc, bt709), 4096x1344 [SAR 1:1 DAR 64:21], 29971 kb/s, 29.97 fps, 29.97 tbr, 90k tbn (default)
    Metadata:
      creation_time   : 2020-08-02T12:45:54.000000Z
      handler_name    : GoPro H.265
      vendor_id       : [0][0][0][0]
      encoder         : GoPro H.265 encoder
      timecode        : 12:45:09:01
    Side data:
      displaymatrix: rotation of nan degrees
  Stream #0:6[0x7](eng): Audio: pcm_s32le (in32 / 0x32336E69), 48000 Hz, 4 channels, s32, 6144 kb/s (default)
    Metadata:
      creation_time   : 2020-08-02T12:45:54.000000Z
      handler_name    : GoPro AMB  
      vendor_id       : [0][0][0][0]
Unsupported codec with id 0 for input stream 2
Unsupported codec with id 98314 for input stream 3
Unsupported codec with id 0 for input stream 4
```

Here there are 6 streams in each of the 3 chaptered `.360` videos as follows:

* `0:0` = video track 1 (GoPro H.265)
* `0:1` = audio (GoPro AAC)
* `0:2` = starting timecode (GoPro TCD)
* `0:3` = gpmf telemetry (GoPro MET)
* `0:4` = SOS (used in file recovery) (GoPro SOS)
* `0:5` = video track 2 (GoPro H.265)

Streams 0:2 and 0:4 are not really useful for anything at this point (they are used in GoPro's own software), so these will be ignored.

As before, create a file (e.g. `GS0141-360.txt`) with all the files you want to have concatenated, e.g.

```
file 'GS010141.360'
file 'GS020141.360'
file 'GS030141.360'
```

Now use the following ffmpeg command to concatenate the videos, the only difference between the .mp4 example and this one being the change in mappings as per the ffprobe output;

```
ffmpeg -f concat -safe 0 -i GS0141-360.txt -c copy -map 0:0 -map 0:1 -map 0:3 -map 0:5 -c:v libx264 -pix_fmt yuv420p GS0141-360.mp4
```

Note, this time we are outputting the video as an .mp4 again. This is because ffmpeg cannot natively write into the `.360` file format (which is really just an pseudo mp4, but with two video tracks).

Once processing is finished, you can copy it to have a .360 file extension like so;

```shell
cp GS0141-360.mp4 GS0141-360.360
```

This will ensure your newly concatenated .360 can be read properly by GoPro software if needed (it's worth doing a test in GoPro Player to check this).

And finally, lets copy the global metadata like so;

```shell
cp GS0141-360.360 GS0141-360-meta.360
exiftool -TagsFromFile GS010141.360 "-all:all>all:all" GS0141-360-meta.360
exiftool -ee -X GS0141-mp4-meta.mp4 > GS0141-mp4-meta.xml
```