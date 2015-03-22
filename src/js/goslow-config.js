/**
 * GoSlow configuration variables
 *
 */

var goslow = {
  choices: [
    {
      title: "High Speed",
      mode: 'video',
      fps: 120,
      resolution: '1080',
      fov: 'medium',
      btn: 'primary',
      count: 5,
      playback: 10,
    },
    {
      title: "Message",
      mode: 'video',
      fps: 24,
      resolution: '1080',
      fov: 'wide',
      btn: 'warning',
      count: 15,
      playback: 5,
    },
  ],
// Camera Variables
//
// videos:          The DCIM folder to find newly created videos
//                   (usually http://10.5.5.9:8080/videos/DCIM/).
// test_mode:       true runs the program without connecting to the camera
  videos: "http://10.5.5.9:8080/videos/DCIM/",
  test_mode: false,

// Other Variables
//
// show_clip:       true shows clip.mp4 (not included); false shows goslow.png
// direction:       The position of the camera relative to the device.
//                   Values can be up, right, left, or down.
  show_clip: false,
  direction: 'down',
};
