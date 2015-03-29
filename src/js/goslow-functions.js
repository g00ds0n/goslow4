/**
 * Commands to send to the camera
 *
 * Known commands found at
 * https://github.com/KonradIT/goprowifihack/blob/master/HERO4.md
 */
function command(cmd, ignore_fail) {
  ignore_fail = typeof ignore_fail !== 'undefined' ? ignore_fail : false;
  if (goslow.test_mode) {
    return true;
  }
  var path = 'http://10.5.5.9/gp/gpControl/' + cmd;
  var code = null;
  $.ajax({
    url: path,
    async: false,
    timeout: 2000,
    jsonp: false,
    cache: true,
    dataType: 'jsonp',
  }).done(function(data, status, xhr){
    console.log(status);
    code = data;
  }).fail(function(xhr, status, error){
    if (!ignore_fail) {
      console.log(error);
    }
  });
  return code;
}

/**
 * Get the last MP4 file
 */
function get_last() {
  if (goslow.test_mode) {
    return 'clip.mp4';
  }
  var url = goslow.videos;
  $.ajax({
    url: url,
    async: false,
    dataType: 'html'
  }).done(function(data, status, xhr){
    // Looking for the last directory on the list
    var last_dir = $("tbody img[alt='[DIR]']", data).last();
    url += last_dir.closest('tr').find('a.link').attr('href');
    $.ajax({
      url: url,
      async: false,
      dataType: 'html'
    }).done(function(data, status, xhr){
      // Find the last anchor tag with the extension MP4
      var latest = $("a:contains('MP4')", data).last().attr('href');
      url += latest;
    });
  });
  return url;
}

/**
 * Change to camera mode
 */
function mode(type) {
  switch (type) {
    case 'photo':
      command('command/mode?p=1');
      break;
    case 'multishot':
      command('command/mode?p=2');
      break;
    case 'video':
    case 'default':
      command('command/mode?p=0');
  }
}

/**
 * Trigger the shutter
 */
function startCapture() {
  command('command/shutter?p=1');
}

/**
 * Stop the video/timelapse
 */
function stopCapture() {
  command('command/shutter?p=0', true);
}

/**
 * Change the field of view
 */
function fov(fov) {
  switch(fov) {
    case 'medium':
      command('setting/4/1');
      break;
    case 'narrow':
      command('setting/4/2');
      break;
    case 'wide':
    case 'default':
      command('setting/4/0');
      break;
  }
}

/**
 * Change the camera's resolution
 */
function resolution(res) {
  switch(res) {
    case 'WVGA':
      command('setting/2/13');
      break;
    case '960':
      command('setting/2/10');
      break;
    case '720':
      command('setting/2/12');
      break;
    case '720w': // Superview
      command('setting/2/11');
      break;
    case '1440':
      command('setting/2/7');
      break;
    case '2.7K4:3':
      command('setting/2/6');
      break;
    case '2.7kw': // Superview
      command('setting/2/5');
      break;
    case '2.7K':
      command('setting/2/4');
      break;
    case '4.7Kw': // Superview
      command('setting/2/2');
      break;
    case '4.7K':
      command('setting/2/1');
      break;
    case '1080w': // Superview
      command('setting/2/8');
      break;
    default:
    case '1080':
      command('setting/2/9');
      break;
  }
}

/**
 * Change the frames per second
 */
function frameRate(fps) {
  switch(fps) {
    case 24:
      command('setting/3/10');
      break;
    case 30:
      command('setting/3/8');
      break;
    case 48:
      command('setting/3/7');
      break;
    case 60:
      command('setting/3/5');
      break;
    case 90:
      command('setting/3/3');
      break;
    case 120:
      command('setting/3/0');
      break;
  }
}

/**
 * Get the camera's maximum ISO setting
 */
function iso(iso) {
  switch(iso) {
    case 6400:
      command('setting/13/0');
      break;
    case 1600:
      command('setting/13/1');
      break;
    case 400:
    default:
      command('setting/13/2');
      break;
  }
}

/**
 * Change the White Balance
 */
function whiteBalance(balance) {
  switch(balance) {
    case '3000k':
      command('setting/11/1');
      break;
    case '5500k':
      command('setting/11/2');
      break;
    case '6500k':
      command('setting/11/3');
      break;
    case 'native':
      command('setting/11/4');
      break;
    default:
    case 'auto':
      command('setting/11/0');
      break;
  }
}

/**
 * Get the camera's maximum ISO setting
 */
function sharpness(sharp) {
  switch(sharp) {
    case 'high':
      command('setting/14/0');
      break;
    case 'med':
      command('setting/14/1');
      break;
    case 'low':
    default:
      command('setting/14/2');
      break;
  }
}

/**
 * Change the color settings
 */
function iso(color) {
  switch(color) {
    case 'flat':
      command('setting/12/1');
      break;
    case 'gopro':
    default:
      command('setting/12/1');
      break;
  }
}
