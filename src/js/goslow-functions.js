/**
 * Block the page, show a message, and reload the whole thing
 */
function error_restart(m) {
  var message = "There was a problem, please try again."
  if (m !== undefined) {
    message = m;
  }
  $('body').append('<div class="goslow-error-wrapper"></div><div class="alert alert-danger goslow-error">' + message + '</div>');
  // Block the page
  $('.goslow-error-wrapper').bind('click', function(){ return false; });

  setTimeout(function() {
    $('body').fadeOut(1000, function(){
      location.reload();
    });
  }, 4000);
}

/**
 * Get the last LRV (or MP4) file from the URL defined by goslow.videos
 */
function get_last() {
  var url = goslow.videos;
  $.ajax({
    url: url,
    async: false,
    //jsonp: false,
    //cache: true,
    dataType: 'html'
  }).done(function(data, status, xhr){
    // Looking for the last directory on the list
    var last_dir = $("tbody img[alt='[DIR]']", data).last();
    url += last_dir.closest('tr').find('a.link').attr('href');
    //console.log(url);
    $.ajax({
      url: url,
      async: false,
      dataType: 'html'
    }).done(function(data, status, xhr){
      // Find the last anchor tag with the extension MP4
      var latest = $("a:contains('MP4')", data).last().attr('href');
      url += latest;
      //console.log(url);
    });
  });
  return url;
}

/**
 * Commands to send to the camera
 *
 * Known commands found at
 * http://forums.openpilot.org/topic/15545-gcs-go-pro-wifi-widget/?p=168223
 * https://github.com/joshvillbrandt/GoProController/blob/master/GoProController.py
 * https://github.com/PhilMacKay/PyGoPro/blob/master/goPro.py
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

function powerOn() {
  //command('bacpac/PW', '01');
  //sleep(5000);
}
function volume(vol) {
  //command('camera/BS', vol);
}
function previewOn() {
  command('execute?p1=gpStream&c1=start');
}

function previewOff() {
  command('execute?p1=gpStream&c1=stop');
}

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

function modeVideo() {
  command('command/mode?p=0');
}

function startCapture() {
  command('command/shutter?p=1');
}

function stopCapture() {
  command('command/shutter?p=0', true);
}

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

function resolution(res) {
  // 00: wvga
  // 01: 720
  // 02: 960
  // 03: 1080
  // 04: 1440
  // 05: 2.7K
  // 06: 4K
  // 07: 2.7K 17:9
  // 08: 4K 17:9

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
    default:
    case '1080':
      command('setting/2/9');
      break;
  }
}

function frameRate(fps) {
  switch(fps) {
    case 12:  // (4K 17:9)
      //command('camera/FS', '00');
      break;
    case 15:  // (4K)
      //command('camera/FS', '01');
      break;
    case 24:  // (1080, 1440, 2.7K 17:9)
      command('setting/3/10');
      break;
    case 30:  // (1080, 1440, 2.7K)
      command('setting/3/8');
      break;
    case 48:  // (960, 1080, 1440)
      command('setting/3/7');
      break;
    case 60:  // (720, 1080)
      command('setting/3/5');
      break;
    case 90:  // (960)
      command('setting/3/3');
      break;
    case 120:  // (1080)
      command('setting/3/0');
      break;
    case 240:  // (720 N)
      //command('camera/FS', '0a');
      break;
  }
}

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

function next_page(show) {
  $('.goslow-page').hide();
  var height = $(window).height() + "px";
  $('#' + show).css('height', height).show();
}

var auto_off = function auto_off(){
  // Unbind the click so the user can't click the screen while it's powering off
  $('#instructions').unbind('click', ready);
  command('bacpac','PW','%00');
  setTimeout(function(){
    // Rebind the home page to be click ready after 3 seconds
    $('#instructions').bind('click', ready);
  }, 3000);
};

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}
